export const registerBindings = (socket) => (bindings) => {
    for (let key in bindings) {
        socket.on(key, bindings[key]);
    }
}