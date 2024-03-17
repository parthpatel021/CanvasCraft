import { useState } from "react";

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

export default useHistory;