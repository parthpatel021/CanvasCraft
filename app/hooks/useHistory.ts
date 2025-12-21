"use client";

import { useState } from "react";
import { ShapeType } from "../models";

export type HistoryHook = {
    pushToHistory: (elements: Record<string, ShapeType>) => void;
    addHistoryElement: (element: ShapeType) => void;
    getElements: () => Record<string, ShapeType>;
    canUndo: () => boolean;
    canRedo: () => boolean;
    undo: () => void;
    redo: () => void;
};

export default function useHistory() {
    const [historyStack, setHistoryStack] = useState<Record<string, ShapeType>[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

    const pushToHistory = (elements: Record<string, ShapeType>) => {
        if (currentIndex < historyStack.length - 1) {
            popFromHistory();
        }
        setHistoryStack(prev => [...prev, elements]);
        setCurrentIndex(prev => prev + 1);
    };

    const addHistoryElement = (element: ShapeType) => {
        const currentElements = getElements();
        const newElements = { ...currentElements, [element.uuid]: element };
        pushToHistory(newElements);
    }

    const popFromHistory = () => {
        setHistoryStack(prev => prev.slice(0, currentIndex + 1));
    }

    const getElements = () => {
        return historyStack[currentIndex] || {};
    }

    const canUndo = () => currentIndex > 0;
    const canRedo = () => currentIndex < historyStack.length - 1;

    const undo = () => {
        if (canUndo()) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const redo = () => {
        if (canRedo()) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    return {
        pushToHistory,
        addHistoryElement,
        getElements,
        canUndo,
        canRedo,
        undo,
        redo,
    }
}