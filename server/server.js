const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketServer = require('socket.io');
const configureStore = require('./configureStore');
const itemActions = require('./actions/items');
const documentActions = require('./actions/documents');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketServer(server);

server.listen(8000, () => console.log("Server listening on 8000"));

const store = configureStore();

/* ALL SOCKET LOGIC */
io.on('connect', (socket) => {

    const initialState = store.getState();
    socket.emit('INITIALIZE', initialState.documents);

    socket.on('ADD_ITEM', ({ value, documentId }) => {
        const a = itemActions.addItem(value, documentId);
        store.dispatch(a);
        io.emit('RECEIVE_ITEM', value, documentId, a.id);
    });

    socket.on('REMOVE_ITEM', ({ documentId, id }) => {
        store.dispatch(itemActions.removeItem(documentId, id));
        io.emit('REMOVE_ITEM', documentId, id);
    });

    socket.on('TOGGLE_AVAILABLE', ({ documentId }) => {
        store.dispatch(documentActions.toggleAvailable(documentId));
        io.emit('TOGGLE_AVAILABLE', documentId);
    });

    socket.on('ADD_DOCUMENT', ({ title, shared }) => {
        const a = documentActions.addDocument(title, shared);
        store.dispatch(a);
        io.emit('RECEIVE_DOCUMENT', a.title, a.items, a.shared, a.available, a.id);
    });

});