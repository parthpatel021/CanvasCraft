import { useEffect, useState } from "react";

const usePressedKey = () => {
    const [pressedKeys, setPressedKeys] = useState(new Set());

    useEffect(() => {

        const handleKeyDown = event => {
            if((event.metaKey || event.ctrlKey) && (event.key === '=' || event.key === '-'))
                event.preventDefault();
            setPressedKeys(prev => new Set(prev).add(event.key));
        }

        const handleKeyUp = event => {
            setPressedKeys(prev => {
                const updatedKeys = new Set(prev);
                updatedKeys.delete(event.key);
                return updatedKeys;
            })
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, []);

    return pressedKeys;
}

export default usePressedKey