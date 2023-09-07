import { createContext, useContext, useReducer } from 'react';
import { RESET_PROJECT_CACHE, ADD_PROJECT_TO_CACHE, REMOVE_PROJECT_FROM_CACHE } from '../actions';

// Create our context
const projectStoreContext = createContext<any>(null); //NOSONAR
// Get the provider
const { Provider } = projectStoreContext;

// Initial State
const defaultState = {
    projects: {}
};

// Controller for the state
const reducer = (state: any, action: any) => { // NOSONAR
    switch (action.type) {
        case ADD_PROJECT_TO_CACHE:
            return {
                ...state,
                projects: {
                    ...state.projects,
                    [action.payload.name]: action.payload
                }
            };
        case REMOVE_PROJECT_FROM_CACHE:
            const { [action.payload]: _, ...rest } = state.projects;
            return {
                ...state,
                projects: rest
            };
        case RESET_PROJECT_CACHE:
            return {
                ...state,
                projects: {}
            };

        default:
            return state;
    }
};

// Reducer
const useProjectCacheReducer = (initialState: typeof defaultState) => useReducer(reducer, initialState);

// Create the provider
function ProjectCacheProvider({ value = [], ...props }) {//NOSONAR
    const [state, dispatch] = useProjectCacheReducer(defaultState);

    return <Provider value={[state, dispatch]} {...props} />;
}

// consumer
const useProjectCache = () => useContext(projectStoreContext);

// export the provider and consumer
export { ProjectCacheProvider, useProjectCache };
