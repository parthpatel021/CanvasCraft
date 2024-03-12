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

const isWithinElement = (x, y, element) => {
    const {type, x1, y1, x2, y2} = element;
    switch (type) {
        case 'rectangle': {
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            return x >= minX && x <= maxX && y >= minY && y <= maxY;
        }
        case 'line': {
            const a = {x: x1, y: y1};
            const b = {x: x2, y: y2};
            const c = {x: x, y: y};
            const offset = distance(a,b) - (distance(a,c) + distance(b,c));
            return Math.abs(offset) < 1;
        }
        default: {
            console.log('corresponding selectedTool element isWithinElement function is not written')
        }
    }
}   


const getElementAtPosition = (x, y, elements) => {
    return elements.find(element => isWithinElement(x, y, element));
}

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
                setAction('move');
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
        if(tool.selectedTool === 'selection' && getElementAtPosition(clientX, clientY, elements)){
            event.target.style.cursor = 'move';
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

        }
    }

    const handleMouseUp = () => {
        setAction('none');
        setSelectedElement(null);
        !tool.toolLock && setTool({
                selectedTool: 'selection',
                toolLock: false,
                cursor: 'default',
            });
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