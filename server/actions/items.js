const uuid = require('node-uuid');

const addItem = (value, documentId) => ({
    type: 'ADD_ITEM',
    value,
    documentId,
    id: uuid.v4()
});

const removeItem = (documentId, id) => ({
    type: 'REMOVE_ITEM',
    documentId,
    id
});

module.exports = {
    addItem,
    removeItem
};