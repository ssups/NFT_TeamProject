import axios from "axios";

export const sample_action = () => async (_dispatch, _getState) => {
    //
    const sample = await axios.get("/");

    const account = _getState().main_reducer.account;
    _dispatch({ type: "SAMPLE", payload: sample.data });
}