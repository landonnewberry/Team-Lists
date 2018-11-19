const items = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return [ ...state, {
                id: action.id,
                value: action.value
            }];
        case 'REMOVE_ITEM':
            return state.filter(item =>
                item.id !== action.id
            );
        default:
            return state;
    }
};

module.exports = items;