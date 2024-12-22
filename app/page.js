'use client';
import{ useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';

import useHistory from '@/hooks/useHistory';
import usePressedKey from '@/hooks/usePressedKey';
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
    const { pressedKeys } = usePressedKey();

    // FIXME: store element id and get element from that to use.
    const [ activeElement, setActiveElement ] = useState(null);
    // FIXME: add effect of scle while drwaing
    const [stage, setStage] = useState({
        scale: 1,
        x: 0,
        y: 0,
    });
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

    const handleCanvasScale = (scaleFactor) => {
        const getNewScale = (currentScale) => {
            if(!scaleFactor) return 1;

            let newScale = currentScale + scaleFactor;
            if(newScale < 0.1) newScale = 0.1;
            if(newScale >= 10) newScale = 9.9;
            return newScale;
        }
        setStage(prev => ({...prev, scale: getNewScale(prev.scale)}));
    }

    // Mouse wheel 
    useEffect(() => {
        const handleMouseWheel = event => {
            if(pressedKeys.has('Meta') || pressedKeys.has('Control')){ 
                event.preventDefault();
                handleCanvasScale(event.deltaY * -0.001);
            } else {
                setStage(prevStage => ({
                    ...prevStage,
                    x: prevStage.x - event.deltaX,
                    y: prevStage.y - event.deltaY,
                }));
            }
        };

        if(pressedKeys.has('Meta') || pressedKeys.has('Control')){ 
            if(pressedKeys.has('=')) handleCanvasScale(0.1);
            if(pressedKeys.has('-')) handleCanvasScale(-0.1);
        }

        document.addEventListener("wheel", handleMouseWheel, {passive: false});
        return () => {
            document.removeEventListener("wheel", handleMouseWheel, {passive: false});
        };
    }, [pressedKeys]);

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
