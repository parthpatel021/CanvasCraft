
export function generateSessionId() {
    let id = crypto.randomUUID();
    return id;
}