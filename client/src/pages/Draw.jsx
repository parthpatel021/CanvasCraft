import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { io } from 'socket.io-client';
import rough from 'roughjs/bundled/rough.esm';

import ToolBar from './../components/Draw/ToolBar';
import Session from '../components/Draw/Session';
import DrawFooter from '../components/Draw/DrawFooter';

import { useTool } from '../hooks/useTool';
import createElement from '../utils/Element/createElement';
import drawElement from '../utils/Element/drawElement';

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}


const onLine = (x1, y1, x2, y2, x, y, offsetLimit = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x: x, y: y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));

    return Math.abs(offset) < offsetLimit ? 'inside' : null
}
const isWithinElement = (x, y, element) => {
    const { type, x1, y1, x2, y2 } = element;
    switch (type) {
        case 'rectangle': {
            const topLeft = nearPoint(x, y, x1, y1, 'tl');
            const topRight = nearPoint(x, y, x2, y1, 'tr');
            const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
            const bottomRight = nearPoint(x, y, x2, y2, 'br');
            const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;

            return topLeft || topRight || bottomLeft || bottomRight || inside;
        }
        case 'line': {
            const on = onLine(x1, y1, x2, y2, x, y);

            const start = nearPoint(x, y, x1, y1, 'start');
            const end = nearPoint(x, y, x2, y2, 'end');
            return start || end || on;
        }
        case 'draw': {
            const betweenAnyPoint = element.points.some((point, index) => {
                const nextPoint = element.points[index+1];
                if(!nextPoint) return false;

                return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 10) != null;
            });
            return betweenAnyPoint ? 'inside' : null;
        }
        case 'text': {

            return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
        }

        default: 
            throw new Error(`Type not Recognised: ${type}`);
    }
}


const getElementAtPosition = (x, y, elements) => {
    return elements
        .map(element => ({ ...element, position: isWithinElement(x, y, element) }))
        .find(element => element.position !== null);
}

const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;
    switch (type) {
        case 'rectangle': {
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            return { x1: minX, y1: minY, x2: maxX, y2: maxY };
        }
        case 'line': {
            if (x1 < x2 || (x1 === x2 && y1 < y2)) {
                return { x1, y1, x2, y2 };
            } else {
                return { x1: x2, y1: y2, x2: x1, y2: y1 };
            }
        }
        default: {
            console.log('corresponding selectedTool element adjustElementCoordinates function is not written')
        }
    }
}

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

const useHistory = (initalState) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState([initalState]);

    const setState = (action, overWrite = false) => {
        const newState = typeof action === 'function' ? action(history[index]) : action;

        if (overWrite) {
            const historyCopy = [...history];
            historyCopy[index] = newState;

            setHistory(historyCopy);

        } else {
            const updatedState = [...history].slice(0, index + 1);
            setHistory([...updatedState, newState]);
            setIndex(prev => prev + 1);
        }
    }

    const undo = () => index > 0 && setIndex(prev => prev - 1);
    const redo = () => index < history.length - 1 && setIndex(prev => prev + 1);

    return [history[index], setState, undo, redo];
}

const adjustmentRequires = (type) => ['rectangle', 'line'].includes(type);

const Draw = () => {
    const { tool, setTool } = useTool();

    const [elements, setElements, undo, redo] = useHistory([]);
    const [action, setAction] = useState('none');
    const [selectedElement, setSelectedElement] = useState(null);
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
    }, [sessionId, socket]);

    // Textarea focus
    useEffect(() => {
        const textArea = textAreaRef.current;
        if(action === 'write'){  
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

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roughCanvas = rough.canvas(canvas);

        elements.forEach(element => {
            if(action === 'write' && selectedElement.id === element.id) return;
            drawElement(roughCanvas, ctx, element);
        })
    }, [action, elements, selectedElement]);

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

    const updateElement = (id, x1, y1, x2, y2, type, options) => {
        const elementCopy = [...elements];

        switch (type) {
            case 'rectangle':
            case 'line':
                elementCopy[id] = createElement(id, x1, y1, x2, y2, type);
                break;
            case 'draw':
                elementCopy[id].points = [...elementCopy[id].points, { x:x2, y:y2}];
                break;

            case 'text':
                const textwidth = document.
                    getElementById('canvas').
                    getContext('2d').
                    measureText(options.text).width;
                const textHight = 24;
                elementCopy[id] = {
                    ...createElement(id, x1, y1, x1+textwidth, y1+textHight, type),
                    text: options.text
                }
                break;

            default:
                throw new Error(`Type not Recognised: ${type}`);
        }
        setElements(elementCopy, true);
    }

    // Mouse Handlers
    const handleMouseDown = (event) => {
        if(action === 'write') return;

        const { clientX, clientY } = event;
        if (tool.selectedTool === 'hand') return;

        if (tool.selectedTool === 'selection') {
            const element = getElementAtPosition(clientX, clientY, elements);

            if (element) {
                if(element.type === 'draw'){
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

            setAction(tool.selectedTool==='text' ? 'write' : 'draw');
        }
    }

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;

        event.target.style.cursor = tool.cursor;
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
            if(selectedElement.type === 'draw'){
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
                const options = type === 'text' ? {text: selectedElement.text} : {};
                updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options);
            }
        } else if (action === 'resize') {
            const { id, type, position, ...coordinates } = selectedElement;
            const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
            updateElement(id, x1, y1, x2, y2, type);

        }
    }

    const handleMouseUp = (event) => {
        const { clientX, clientY } = event;
        if (selectedElement) {

            if(
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

        if(action === 'write') return;

        setAction('none');
        setSelectedElement(null);

        // Tool reset
        !tool.toolLock && setTool({ selectedTool: 'selection', toolLock: false, cursor: 'default', });
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
        const {id, x1, y1, type} = selectedElement;
        setAction('none');
        setSelectedElement(null);

        updateElement(id, x1, y1, null, null, type, {text: event.target.value});
    }

    return (
        <div className={`h-screen dark:bg-neutral-900 bg-white flex justify-center items-center}`}>
            <ToolBar />
            <button
                className={`${sessionId ? 'bg-[#0fb884]' : 'bg-[#a8a5ff] hover:bg-[#bbb8ff]'} min-h-[2.25rem] px-3 rounded-lg border-[1px] border-transparent cursor-pointer  absolute top-4 right-4 text-sm`}
                onClick={() => setSessionCard(true)}
            >
                Share
            </button>
            {sessionCard ? <Session closeSessionCard={() => setSessionCard(false)} sessionId={sessionId} /> : null}

            <DrawFooter undo={undo} redo={redo} />

            {action === 'write' ? (
                <textarea 
                    ref = {textAreaRef}
                    onBlur={handleBlur}
                    className='rounded-md px-1 text-white' 
                    style={{
                        position: "fixed",
                        top: selectedElement.y1 - 5,
                        left: selectedElement.x1,
                        font: "24px serif",
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