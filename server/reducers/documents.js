const items = require('./items');

const documents = (state = {}, action) => {
    switch (action.type) {
        case 'INITIALIZE':
            return action.state.documents;
        case 'ADD_DOCUMENT':
            return {
                ...state,
                byId: { 
                    ...state.byId,
                    [action.id]: {
                        available: action.available,
                        title: action.title,
                        items: action.items,
                        shared: action.shared,
                        id: action.id
                    }
                },
                allIds: [ ...state.allIds, action.id ]
            };
        case 'TOGGLE_AVAILABLE':
            return {
                ...state,
                byId: { 
                    ...state.byId,
                    [action.id]: {
                        ...state.byId[action.id],
                        available: !state.byId[action.id].available,
                    }
                }
            };
        case 'REMOVE_DOCUMENT':
            const newById = {};
            for (let key in state.byId) {
                if (key !== action.id) {
                    newById[key] = state.byId[key];
                }
            }
            return {
                ...state,
                byId: newById,
                allIds: state.allIds.filter(i => i !== action.id)
            };
        case 'ADD_ITEM':
        case 'REMOVE_ITEM':
            const { documentId, ...pass } = action;
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [documentId]: {
                        ...state.byId[documentId],
                        items: items(state.byId[documentId].items, pass)
                    }
                }
            };
        default:
            return state;
    }
}

module.exports = documents;