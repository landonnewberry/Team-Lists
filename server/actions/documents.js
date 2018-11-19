const uuid = require('node-uuid');

const addDocument = (title, shared=false) => ({
    type: 'ADD_DOCUMENT',
    title,
    items: [],
    shared,
    available: true,
    id: uuid.v4()
});

const toggleAvailable = (id) => ({
    type: 'TOGGLE_AVAILABLE',
    id
});

const removeDocument = (id) => ({
    type: 'REMOVE_DOCUMENT',
    id
});

const initialize = (state) => ({
    type: 'INITIALIZE',
    state
});

module.exports = {
    addDocument,
    toggleAvailable,
    removeDocument,
    initialize
};