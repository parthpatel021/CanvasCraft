'use client';
import { Component, createRef } from 'react';
import rough from 'roughjs/bundled/rough.esm';

import useHistory from '@/hooks/useHistory';
import usePressedKey from '@/hooks/usePressedKey';
import useTool from '@/hooks/useTool';
import useWindowSize from '@/hooks/useWindowSize';

import { mouseMove, mouseDown, mouseUp } from "./handlers/mouseEventHandlers";

import ToolBar from '@/components/ToolBar';
import { DrawFooter } from '@/components/Footer';

class Home extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = createRef();
        this.state = {
            activeElement: null,
            stage: {
                scale: 1,
                x: 0,
                y: 0,
            }
        };
        this.handleCanvasScale = this.handleCanvasScale.bind(this);
    }

    componentDidMount() {
        document.addEventListener("wheel", this.handleMouseWheel, { passive: false });
        this.handleKeyPress();
    }

    componentWillUnmount() {
        document.removeEventListener("wheel", this.handleMouseWheel, { passive: false });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.elements !== this.props.elements || prevState.stage !== this.state.stage) {
            this.updateCanvas();
        }
    }

    handleKeyPress() {
        const { pressedKeys } = this.props;
        if (pressedKeys.has('Meta') || pressedKeys.has('Control')) {
            if (pressedKeys.has('=')) this.handleCanvasScale(0.1);
            if (pressedKeys.has('-')) this.handleCanvasScale(-0.1);
        }
    }

    updateCanvas() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const roughCanvas = rough.canvas(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const { scale, x, y } = this.state.stage;
        const scaleOffSetX = canvas.width * (scale - 1) / 2;
        const scaleOffSetY = canvas.height * (scale - 1) / 2;

        ctx.save();
        ctx.translate(x * scale - scaleOffSetX, y * scale - scaleOffSetY);
        ctx.scale(scale, scale);

        this.props.elements.forEach(ele => ele.drawElement(roughCanvas));
        ctx.restore();
    }

    handleCanvasScale(scaleFactor) {
        this.setState(prevState => ({
            stage: {
                ...prevState.stage,
                scale: this.getNewScale(prevState.stage.scale, scaleFactor)
            }
        }));
    }

    getNewScale(currentScale, scaleFactor) {
        if (scaleFactor === false) return 1;
        let newScale = currentScale + scaleFactor;
        return Math.min(Math.max(newScale, 0.1), 9.9);
    }

    handleMouseWheel = (event) => {
        const { pressedKeys } = this.props;
        if (pressedKeys.has('Meta') || pressedKeys.has('Control')) {
            event.preventDefault();
            this.handleCanvasScale(event.deltaY * -0.001);
        } else {
            this.setState(prevState => ({
                stage: {
                    ...prevState.stage,
                    x: prevState.stage.x - event.deltaX,
                    y: prevState.stage.y - event.deltaY,
                }
            }));
        }
    };

    render() {
        const { tool, setTool, windowSize, updateScreen, addElements } = this.props;
        const { activeElement, stage } = this.state;

        const canvasProps = {
            onMouseMove: (ev) => mouseMove(ev, updateScreen, activeElement, stage),
            onMouseDown: (ev) => mouseDown(ev, addElements, tool.selectedTool, (ele) => this.setState({ activeElement: ele }), stage),
            onMouseUp: (ev) => mouseUp(ev, () => this.setState({ activeElement: null })),
            width: windowSize.width,
            height: windowSize.height,
        };

        return (
            <div className="h-screen dark:bg-neutral-900 bg-white flex justify-center items-center">
                <ToolBar tool={tool} setTool={setTool} />
                <canvas ref={this.canvasRef} {...canvasProps} />
                <DrawFooter handleCanvasScale={this.handleCanvasScale} scale={stage.scale} />
            </div>
        );
    }
}

export default function HomeWrapper() {
    const { windowSize } = useWindowSize();
    const { elements, addElements, updateScreen } = useHistory();
    const { tool, setTool } = useTool();
    const { pressedKeys } = usePressedKey();

    return (
        <Home
            windowSize={windowSize}
            elements={elements}
            addElements={addElements}
            updateScreen={updateScreen}
            tool={tool}
            setTool={setTool}
            pressedKeys={pressedKeys}
        />
    );
}
