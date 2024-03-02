import { v4 as uuidv4 } from 'uuid';

export function generateElementId(){
    return uuidv4();
}

export function generateSessionId() {
    let id = crypto.randomUUID();
    return id;
}