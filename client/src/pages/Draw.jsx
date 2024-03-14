import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { io } from 'socket.io-client';
import rough from 'roughjs/bundled/rough.esm';

import ToolBar from './../components/Draw/ToolBar';
import Session from '../components/Draw/Session';
import DrawFooter from '../components/Draw/DrawFooter';

import { useTool } from '../hooks/useTool';

import createNewElement from '../utils/Element/createNewElement';

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}

const isWithinElement = (x, y, element) => {
    const {type, x1, y1, x2, y2} = element;
    switch (type) {
        case 'rectangle': {
            const topLeft = nearPoint(x, y, x1, y1, 'tl');
            const topRight = nearPoint(x, y, x2, y1, 'tr');
            const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
            const bottomRight = nearPoint(x, y, x2, y2, 'br');
            const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;

            return topLeft || topRight || bottomLeft || bottomRight ||  inside;
        }
        case 'line': {
            const a = {x: x1, y: y1};
            const b = {x: x2, y: y2};
            const c = {x: x, y: y};
            const offset = distance(a,b) - (distance(a,c) + distance(b,c));

            const start = nearPoint(x, y, x1, y1, 'start');
            const end = nearPoint(x, y, x2, y2, 'end');
            const inside = Math.abs(offset) < 1 ? 'inside' : null
            return start || end || inside;
        }
        default: {
            console.log('corresponding selectedTool element isWithinElement function is not written')
        }
    }
}   


const getElementAtPosition = (x, y, elements) => {
    return elements
        .map(element => ({...element, position: isWithinElement(x, y, element)}))
        .find(element => element.position !== null);
}

const adjustElementCoordinates = (element) => {
    const {type, x1, y1, x2, y2} = element;
    switch (type) {
        case 'rectangle': {
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            return {x1:minX, y1: minY, x2:maxX, y2:maxY};
        }
        case 'line': {
            if(x1 < x2 || (x1 === x2 && y1 < y2)){
                return {x1, y1, x2, y2};
            } else {
                return {x1:x2, y1:y2, x2:x1, y2:y1};
            }
        }
        default: {
            console.log('corresponding selectedTool element adjustElementCoordinates function is not written')
        }
    }
}

const cursorForPosition = (position) => {
    switch(position){
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

    const [elements, setElements] = useState([]); 
    const [action, setAction] = useState('none');
    const [selectedElement, setSelectedElement] = useState(null);
    
    const location = useLocation();
    const [sessionCard, setSessionCard] = useState(false);
    const [sessionId, setSessionId] = useState(undefined);
    const [socket, setSocket] = useState(undefined);

    // Session Id
    useEffect(() => {
        const { room } = queryString.parse(location.search);
        
        if(room){
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
    }, [sessionId, socket])
    
    // Canvas 
    useLayoutEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roughCanvas = rough.canvas(canvas);

        elements.forEach(({roughElement}) => roughCanvas.draw(roughElement));
    }, [elements])

    const updateElement = (id, x1, y1, x2, y2, type) => {
        const updateElement = createNewElement(id, x1, y1, x2, y2, type);
        
        const elementCopy = [...elements];
        elementCopy[id] = updateElement;
        setElements(elementCopy);
    }

    // Mouse Handlers
    const handleMouseDown = (event) => {
        const {clientX, clientY} = event;

        if(tool.selectedTool === 'hand') return;

        if(tool.selectedTool === 'selection'){
            const element = getElementAtPosition(clientX, clientY, elements);

            if(element){
                const offsetX = clientX -  element.x1;
                const offsetY = clientY - element.y1;
                setSelectedElement({...element, offsetX, offsetY});
                if(element.position === 'inside'){
                    setAction('move');
                } else {
                    setAction('resize');
                }
            }
        } else {
            const id = elements.length;
            const newElement = createNewElement(id, clientX, clientY, clientX, clientY, tool.selectedTool);
            setElements(prev => [...prev, newElement]);
            setAction('draw');
        }
    }

    const handleMouseMove = (event) => {
        const {clientX, clientY} = event;

        event.target.style.cursor = tool.cursor;
        if(tool.selectedTool === 'selection'){
            const element = getElementAtPosition(clientX, clientY, elements);
            if(element){
                event.target.style.cursor = cursorForPosition(element.position);
            }
        }

        if(action === 'draw'){ 
            const index = elements.length - 1;
            const {x1, y1} = elements[index];
            updateElement(index, x1, y1, clientX, clientY, tool.selectedTool);

        } else if(action === 'move'){
            const {id, x1, y1, x2, y2, type, offsetX, offsetY} = selectedElement;
            const width = x2 - x1;
            const height  = y2 - y1;

            const newX1 = clientX - offsetX;
            const newY1 = clientY - offsetY;

            updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);

        } else if(action === 'resize'){
            const {id, type, position, ...coordinates} = selectedElement;
            const {x1, y1, x2, y2} = resizedCoordinates(clientX, clientY, position, coordinates);
            updateElement(id, x1, y1, x2, y2, type);

        }
    }

    const handleMouseUp = () => {
        const index = elements.length - 1;
        if(action === 'draw' || action === 'resize'){
            const {id, type} = elements[index];
            const {x1, y1, x2, y2} = adjustElementCoordinates(elements[index]);
            updateElement(id, x1, y1, x2, y2, type);
        }
        
        setAction('none');
        setSelectedElement(null);

        // Tool reset
        !tool.toolLock && setTool({ selectedTool: 'selection', toolLock: false, cursor: 'default',});
    }

    const resizedCoordinates = (clientX, clientY, position, coordinates) => {
        const {x1, y1, x2, y2} = coordinates;
        switch(position){
            // Rectangle
            case "tl":
            case "start":
                return {x1:clientX, y1:clientY, x2, y2};  
            case "tr":
                return {x1, y1:clientY, x2:clientX, y2};  
            case "bl":
                return {x1:clientX, y1, x2, y2:clientY};  
            case "br":
                case "end":
                return {x1, y1, x2:clientX, y2:clientY};  

            default:
                console.log(`Position:${position} - corresponding resizedCoordinates function is not written`);
                return null;
        }
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

            <DrawFooter />

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