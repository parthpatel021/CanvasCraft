import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { io } from 'socket.io-client';
import rough from 'roughjs/bundled/rough.esm';

import ToolBar from '../components/Draw/ToolBar';
import DrawFooter from '../components/Draw/DrawFooter';
import Session from '../components/Draw/Session';

import { useTool } from '../hooks/useTool';
import createElement from '../utils/Element/createElement';
import drawElement from '../utils/Element/drawElement';
import getElementAtPosition from '../utils/Element/getElementAtPosition';

import useHistory from '../hooks/useHistory';
import usePressedKey from './../hooks/usePressedKey';
import adjustElementCoordinates, { adjustmentRequires } from '../utils/Element/adjustElementCoordinates';

const cursorForPosition = (position) => {
    switch (position) {
        case "tl":
        case "br":
        case "start":
        case "end":
            return "nwse-resize";
        case "tr":
        case "bl":
            return 'nesw-resize';
        default:
            return 'move';
    }
};

const Draw = () => {
    const { tool, setTool } = useTool();
    const [elements, setElements, undo, redo] = useHistory([]);
    const pressedKeys = usePressedKey();

    const [action, setAction] = useState('none');
    const [selectedElement, setSelectedElement] = useState(null);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [scaleOffset, setScaleOffset] = useState({x: 0, y: 0});
    const textAreaRef = useRef();

    const location = useLocation();
    const [sessionCard, setSessionCard] = useState(false);
    const [sessionId, setSessionId] = useState(undefined);
    const [socket, setSocket] = useState(undefined);

    // Session Id
    useEffect(() => {
        const { room } = queryString.parse(location.search);

        if (room) {
            setSessionId(room);
            setSocket(io(process.env.REACT_APP_API));
        }
    }, [setSessionId, location.search])

    // Socket
    useEffect(() => {

        if (socket && sessionId) {
            socket.emit('join', sessionId);

            socket.on('createElement', element => {
                setElements((prev) => [...prev, element]);
            })

            socket.on('updateElement', element => {
                setElements((prev) => prev.map(e => e.id === element.id ? element : e));
            })
        }
    }, [sessionId, setElements, socket]);

    // Textarea focus
    useEffect(() => {
        const textArea = textAreaRef.current;
        if (action === 'write') {
            setTimeout(() => {
                textArea.focus();
                textArea.value = selectedElement.text;
            }, 0);
        }
    }, [action, selectedElement])

    // Canvas 
    useLayoutEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const roughCanvas = rough.canvas(canvas);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        
        const scaleWidth = canvas.width * scale;
        const scaleHeight = canvas.height * scale;
        const scaleOffSetX = (scaleWidth - canvas.width) / 2;
        const scaleOffSetY = (scaleHeight - canvas.height) / 2;
        setScaleOffset({ x: scaleOffSetX, y: scaleOffSetY});
        
        
        ctx.save();
        ctx.translate(panOffset.x * scale - scaleOffSetX, panOffset.y * scale - scaleOffSetY);
        ctx.scale(scale,scale);

        elements.forEach(element => {
            if (action === 'write' && selectedElement.id === element.id) return;
            drawElement(roughCanvas, ctx, element);
        })
        ctx.restore();
    }, [action, elements, selectedElement, panOffset, scale]);

    // KeyDown 
    useEffect(() => {
        const undoRedoFunction = event => {
            if ((event.metaKey || event.ctrlKey) && event.keyCode === 90) {
                if (event.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            }
        }

        document.addEventListener('keydown', undoRedoFunction);
        return () => {
            document.removeEventListener('keydown', undoRedoFunction);
        }
    }, [undo, redo])

    // Mouse wheel 
    useEffect(() => {
        const panOrZoomFunction = event => {
            if(pressedKeys.has('Meta') || pressedKeys.has('Control')){ 
                event.preventDefault();
                onZoom(event.deltaY * -0.01);
            }
            else setPanOffset(prevState => ({
                x: prevState.x - event.deltaX,
                y: prevState.y - event.deltaY,
            }));
        };

        if(pressedKeys.has('Meta') || pressedKeys.has('Control')){ 
            if(pressedKeys.has('=')) onZoom(0.1);
            if(pressedKeys.has('-')) onZoom(-0.1);
        }

        document.addEventListener("wheel", panOrZoomFunction, {passive: false});
        return () => {
            document.removeEventListener("wheel", panOrZoomFunction, {passive: false});
        };
    }, [pressedKeys]);


    const updateElement = (id, x1, y1, x2, y2, type, options) => {
        const elementCopy = [...elements];

        switch (type) {
            case 'rectangle':
            case 'line':
                elementCopy[id] = createElement(id, x1, y1, x2, y2, type);
                break;
            case 'draw':
                elementCopy[id].points = [...elementCopy[id].points, { x: x2, y: y2 }];
                break;

            case 'text':
                const textwidth = document
                    .getElementById("canvas")
                    .getContext("2d")
                    .measureText(options.text).width;
                const textHeight = 24;
                elementCopy[id] = {
                    ...createElement(id, x1, y1, x1 + textwidth*2.25, y1 + textHeight, type),
                    text: options.text
                }
                break;

            default:
                throw new Error(`Type not Recognised: ${type}`);
        }
        setElements(elementCopy, true);
    }

    const getMouseCoordinates = event => {
        const clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
        const clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;

        return { clientX, clientY };
    }

    // Mouse Handlers
    const handleMouseDown = (event) => {
        if (action === 'write') return;

        const { clientX, clientY } = getMouseCoordinates(event);

        if (tool.selectedTool === 'hand' || event.button === 1 || pressedKeys.has(" ")) {
            setAction('pan');
            setStartPanMousePosition({ x: clientX, y: clientY });
            return;
        }

        if (tool.selectedTool === 'selection') {
            const element = getElementAtPosition(clientX, clientY, elements);

            if (element) {
                if (element.type === 'draw') {
                    const xOffsets = element.points.map(point => clientX - point.x);
                    const yOffsets = element.points.map(point => clientY - point.y);
                    setSelectedElement({ ...element, xOffsets, yOffsets });
                } else {
                    const offsetX = clientX - element.x1;
                    const offsetY = clientY - element.y1;
                    setSelectedElement({ ...element, offsetX, offsetY });
                }
                setElements(prev => prev);

                if (element.position === 'inside') {
                    setAction('move');
                } else {
                    setAction('resize');
                }
            }
        } else {
            const id = elements.length;
            const newElement = createElement(id, clientX, clientY, clientX, clientY, tool.selectedTool);
            setElements(prev => [...prev, newElement]);
            setSelectedElement(newElement);

            setAction(tool.selectedTool === 'text' ? 'write' : 'draw');
        }
    }

    const handleMouseMove = (event) => {
        const { clientX, clientY } = getMouseCoordinates(event);

        event.target.style.cursor = tool.cursor;
        if (action === 'pan') {
            event.target.style.cursor = 'hand';
            const deltaX = clientX - startPanMousePosition.x;
            const deltaY = clientY - startPanMousePosition.y;
            setPanOffset({
                x: panOffset.x + deltaX,
                y: panOffset.y + deltaY,
            });
            return;
        }

        if (tool.selectedTool === 'selection') {
            const element = getElementAtPosition(clientX, clientY, elements);
            if (element) {
                event.target.style.cursor = cursorForPosition(element.position);
            }
        }   

        if (action === 'draw') {
            const index = elements.length - 1;
            const { x1, y1 } = elements[index];
            updateElement(index, x1, y1, clientX, clientY, tool.selectedTool);

        } else if (action === 'move') {
            if (selectedElement.type === 'draw') {
                const newPoints = selectedElement.points.map((_, index) => ({
                    x: clientX - selectedElement.xOffsets[index],
                    y: clientY - selectedElement.yOffsets[index]
                }));

                // updateElement();
                const elementCopy = [...elements];
                elementCopy[selectedElement.id] = {
                    ...elementCopy[selectedElement.id],
                    points: newPoints,
                }
                setElements(elementCopy, true);
            } else {
                const { id, x1, y1, x2, y2, type, offsetX, offsetY } = selectedElement;
                const width = x2 - x1;
                const height = y2 - y1;
                const newX1 = clientX - offsetX;
                const newY1 = clientY - offsetY;
                const options = type === 'text' ? { text: selectedElement.text } : {};
                updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options);
            }
        } else if (action === 'resize') {
            const { id, type, position, ...coordinates } = selectedElement;
            const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
            updateElement(id, x1, y1, x2, y2, type);

        }
    }

    const handleMouseUp = (event) => {
        const { clientX, clientY } = getMouseCoordinates(event);
        if (selectedElement) {

            if (
                selectedElement.type === 'text' &&
                clientX - selectedElement.offsetX === selectedElement.x1 &&
                clientY - selectedElement.offsetY === selectedElement.y1
            ) {
                setAction('write');
                return;
            }

            const index = selectedElement.id;
            const { id, type } = elements[index];
            if ((action === 'draw' || action === 'resize') && adjustmentRequires(type)) {
                const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
                updateElement(id, x1, y1, x2, y2, type);
            }
        }

        if (action === 'write') return;

        setAction('none');
        setSelectedElement(null);

        // Tool reset
        (!tool.toolLock && (tool.selectedTool !== 'hand')) && setTool({ selectedTool: 'selection', toolLock: false, cursor: 'default', });
    }

    const resizedCoordinates = (clientX, clientY, position, coordinates) => {
        const { x1, y1, x2, y2 } = coordinates;
        switch (position) {
            // Rectangle
            case "tl":
            case "start":
                return { x1: clientX, y1: clientY, x2, y2 };
            case "tr":
                return { x1, y1: clientY, x2: clientX, y2 };
            case "bl":
                return { x1: clientX, y1, x2, y2: clientY };
            case "br":
            case "end":
                return { x1, y1, x2: clientX, y2: clientY };

            default:
                console.log(`Position:${position} - corresponding resizedCoordinates function is not written`);
                return null;
        }
    }

    const handleBlur = (event) => {
        const { id, x1, y1, type } = selectedElement;
        setAction('none');
        setSelectedElement(null);

        updateElement(id, x1, y1, null, null, type, { text: event.target.value });
    }

    const onZoom = (delta) => {
        setScale(prev => delta ? Math.min(Math.max(prev + delta, 0.1), 20): 1);
    }

    return (
        <div className={`h-screen dark:bg-neutral-900 bg-white flex justify-center items-center}`}>
            <ToolBar />
            <button
                className={`${sessionId ? 'bg-[#0fb884]' : 'bg-[#a8a5ff] hover:bg-[#bbb8ff]'} min-h-[2.25rem] px-3 rounded-lg border-[1px] border-transparent cursor-pointer  absolute top-4 right-4 text-sm`}
                onClick={() => setSessionCard(true)}
                disabled={true}
                style={{
                    cursor: 'no-drop',
                    opacity: 0.5,
                }}
            >
                Share
            </button>
            {sessionCard ? <Session closeSessionCard={() => setSessionCard(false)} sessionId={sessionId} /> : null}

            <DrawFooter scale={scale} onZoom={onZoom} undo={undo} redo={redo} />

            {action === 'write' ? (
                <textarea
                    ref={textAreaRef}
                    onBlur={handleBlur}
                    className='rounded-md px-1 text-white'
                    style={{
                        position: "fixed",
                        top: (selectedElement.y1 - 5) * scale + panOffset.y * scale - scaleOffset.y,
                        left: (selectedElement.x1) * scale + panOffset.x * scale - scaleOffset.x,
                        font: `${24 * scale}px serif`,
                        margin: 0,
                        padding: 0,
                        border: 0,
                        outline: 0,
                        resize: "auto",
                        overflow: "hidden",
                        whiteSpace: "pre",
                        background: "transparent",
                        zIndex: 2,
                    }}
                />
            ) : null}
            <canvas
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                width={window.innerWidth}
                height={window.innerHeight}
                id='canvas'
            >
                Drawing Canvas
            </canvas>
        </div>
    )
}

export default Draw