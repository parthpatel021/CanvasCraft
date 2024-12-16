'use client';
import{ useLayoutEffect, useRef, useState} from 'react';
import rough from 'roughjs/bundled/rough.esm';

import useHistory from '@/hooks/useHistory';
import useTool from '@/hooks/useTool';
import useWindowSize from '@/hooks/useWindowSize';

import { mouseMove, mouseDown, mouseUp } from "./handlers/mouseEventHandlers"

import ToolBar from '@/components/ToolBar';
import { DrawFooter } from '@/components/Footer';

export default function Home() {
    const canvasRef = useRef();
    const { windowSize } = useWindowSize();
    const { elements, addElements, updateScreen } = useHistory();
    const { tool, setTool } = useTool();
    // FIXME: store element id and get element from that to use.
    const [ activeElement, setActiveElement ] = useState(null);
    const [stage, setStage] = useState({
        scale: 1,
        x: 0,
        y: 0,
    })
    // Canvas rendering
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const roughCanvas = rough.canvas(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Compute scale offset
        const scale = stage.scale;
        const scaleOffSetX = canvas.width * (scale - 1) / 2;
        const scaleOffSetY = canvas.height * (scale - 1) / 2;

        // Handling canvas scaling
        ctx.save();
        ctx.translate(stage.x * scale - scaleOffSetX, stage.y * scale - scaleOffSetY);
        ctx.scale(scale,scale);

        elements.forEach(ele => ele.drawElement(roughCanvas));
        ctx.restore();
    }, [elements, stage]);

    const handleCanvasScale = (newScale) => {

        setStage(prev => ({...prev, scale: newScale/100}));
    }

    const canvasProps = {
        onMouseMove: (ev) => mouseMove(ev, updateScreen, activeElement),
        onMouseDown: (ev) => mouseDown(ev, addElements, tool.selectedTool, setActiveElement),
        onMouseUp: (ev) =>  mouseUp(ev, setActiveElement),
        width: windowSize.width,
        height: windowSize.height,
    }

    return (
        <div className="h-screen dark:bg-neutral-900 bg-white flex justify-center items-center">
            <ToolBar tool={tool} setTool={setTool} />
            <canvas ref={canvasRef} {...canvasProps} />
            <DrawFooter handleCanvasScale={handleCanvasScale} scale={stage.scale} />
        </div>
    );
}
