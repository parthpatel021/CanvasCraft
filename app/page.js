'use client';

import {mouseMove, mouseDown, mouseUp} from "./handlers/mouseEventHandlers"

const canvasProps = {
  onMouseMove: mouseMove,
  onMouseDown: mouseDown,
  onMouseUp: mouseUp,
  width: window.innerWidth,
  height: window.innerHeight,
}

export default function Home() {
  return (
    <div className="h-screen dark:bg-neutral-900 bg-white flex justify-center items-center">
      <canvas {...canvasProps} />
    </div>
  );
}
