export const addItem = (value, documentId, id) => ({
    type: 'ADD_ITEM',
    value,
    documentId,
    id
});

export const removeItem = (documentId, id) => ({
    type: 'REMOVE_ITEM',
    documentId,
    id
});