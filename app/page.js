'use client';
import{ useEffect, useLayoutEffect, useRef} from 'react';

import useHistory from '@/hooks/history';
import { mouseMove, mouseDown, mouseUp } from "./handlers/mouseEventHandlers"

export default function Home() {
  const canvasRef = useRef();
  const { elements, addElements } = useHistory();
  // Canvas
  useLayoutEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    elements.forEach(ele => ele.drawElement(ctx));
  }, [elements]);

  const canvasProps = {
    onMouseMove: mouseMove,
    onMouseDown: (ev) => mouseDown(ev, addElements),
    onMouseUp: mouseUp,
    width: window?.innerWidth,
    height: window?.innerHeight,
  }

  return (
    <div className="h-screen dark:bg-neutral-900 bg-white flex justify-center items-center">
      <canvas ref={canvasRef} {...canvasProps} />
    </div>
  );
}
