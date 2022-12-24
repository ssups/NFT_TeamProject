const init = {
    //
    account: "",
}

function reducer(state = init, action) {
    //
    const { type, payload } = action;

    switch (type) {
        //
        case "SAMPLE":
            return state;
        //
        default:
            return state;
    }
}

export default reducer;