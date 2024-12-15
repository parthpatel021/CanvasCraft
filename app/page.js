'use client';
import{ useEffect, useLayoutEffect, useRef} from 'react';
import rough from 'roughjs/bundled/rough.esm';

import useHistory from '@/hooks/useHistory';
import useTool from '@/hooks/useTool';

import { mouseMove, mouseDown, mouseUp } from "./handlers/mouseEventHandlers"

import ToolBar from '@/components/ToolBar';

export default function Home() {
    const canvasRef = useRef();
    const { elements, addElements } = useHistory();
    const { tool, setTool } = useTool();
    // Canvas
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const roughCanvas = rough.canvas(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        elements.forEach(ele => ele.drawElement(roughCanvas));
    }, [elements]);

    const canvasProps = {
        onMouseMove: mouseMove,
        onMouseDown: (ev) => mouseDown(ev, addElements, tool.selectedTool),
        onMouseUp: mouseUp,
        width: window?.innerWidth,
        height: window?.innerHeight,
    }

    return (
        <div className="h-screen dark:bg-neutral-900 bg-white flex justify-center items-center">
            <ToolBar tool={tool} setTool={setTool} />
            <canvas ref={canvasRef} {...canvasProps} />
        </div>
    );
}
