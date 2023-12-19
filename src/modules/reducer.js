const initialState = {
    data: 0 // Initial state of your data
};

function reducer(state = initialState, action) {
    console.log("reducer action: ", action.payload)
    console.log("reducer state: ", state)
    switch (action.type) {
        case 'UPDATE_DATA':
            return { ...state, data: action.payload };
        default:
            return state;
    }
    
}

export default reducer;