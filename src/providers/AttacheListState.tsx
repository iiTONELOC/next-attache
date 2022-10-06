import { createContext, useContext, useReducer } from 'react';
import { AttacheData } from '../../lib/db/controller/Attache';
import { REMOVE_FROM_LIST_STATE, RESET_LIST_STATE, SET_LIST_STATE } from '../actions';

// Create our context
const ListStoreContext = createContext<any>(null); //NOSONAR
// Get the provider
const { Provider } = ListStoreContext;

// Initial State
const defaultState = {
    attaches: []
};

// Controller for the state
const reducer = (state: any, action: any) => { // NOSONAR
    switch (action.type) {
        case SET_LIST_STATE:
            return {
                attaches: [
                    ...state.attaches,
                    action.payload
                ]
            };
        case REMOVE_FROM_LIST_STATE:
            return {
                attaches: state.attaches.filter((attache: AttacheData) => attache?._id !== action.payload)
            };
        case RESET_LIST_STATE:
            return {
                ...defaultState
            };
        default:
            return state;
    }
};

// Reducer
const useAttacheListStateReducer = (initialState: typeof defaultState) => useReducer(reducer, initialState);

// Create the provider
function AttacheListStateProvider({ value = [], ...props }) {//NOSONAR
    const [state, dispatch] = useAttacheListStateReducer(defaultState);

    return <Provider value={[state, dispatch]} {...props} />;
}

// consumer
const useAttacheListState = () => useContext(ListStoreContext);

// export the provider and consumer
export { AttacheListStateProvider, useAttacheListState };
