import { useState } from "react";

export default function useHistory() {
    const [elements, setElements] = useState([]);

    /**
     * add array of elements to current elements state
     * @param {Array of Object} newElements 
     */
    const addElements = (newElements) => {
        if (newElements?.length === 0) {
            console.log("ERROR: addElements expects array of object : ", newElements);            
        }
        setElements(prev => [...prev, ...newElements]); 
    }

    return {elements, addElements};
}