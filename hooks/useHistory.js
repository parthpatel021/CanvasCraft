import { useState } from "react";

export default function useHistory() {
    const [elements, setElements] = useState([]);

    const addElements = (newElements) => {
        if (!newElements?.length) {
            console.error("ERROR: addElements expects array of objects:", newElements);
            return;
        }
        setElements(prev => [...prev, ...newElements]);
    }

    const updateScreen = () => {
        setElements(prev => [...prev]);
    }

    return { elements, addElements, updateScreen };
}