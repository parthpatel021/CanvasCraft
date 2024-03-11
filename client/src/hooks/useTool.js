import React, { createContext, useContext, useState } from "react";

const ToolContext = createContext(undefined);

function ToolProvider({ children }) {
    const [tool, setTool] = useState({
        selectedTool: 'selection',
        toolLock: false,
        cursor: 'default',
    });
    
    return (
        <ToolContext.Provider value={{ tool, setTool }}>
            {children}
        </ToolContext.Provider>
    )
}

function useTool() {
    const context = useContext(ToolContext)

    if (context === undefined) {
        throw new Error('useTool must be used within a ToolProvider')
    }
    return context
}

export { ToolProvider, useTool };