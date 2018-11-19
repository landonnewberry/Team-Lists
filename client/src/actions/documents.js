import { v4 } from 'node-uuid';

export const addDocument = (title, items=[], shared=false, available=true, id=v4()) => ({
    type: 'ADD_DOCUMENT',
    title,
    items,
    shared,
    available,
    id
});

export const toggleAvailable = (id) => ({
    type: 'TOGGLE_AVAILABLE',
    id
});

export const removeDocument = (id) => ({
    type: 'REMOVE_DOCUMENT',
    id
});

export const initialize = (state) => ({
    type: 'INITIALIZE',
    state
});