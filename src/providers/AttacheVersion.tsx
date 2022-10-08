import { createContext, useContext, useEffect, useReducer } from 'react';
import { SET_ATTACHE_VERSION } from '../actions';
import { useIsMounted } from '../hooks';


// Create our context
const versionStoreContext = createContext<any>(null); //NOSONAR
// Get the provider
const { Provider } = versionStoreContext;

// Initial State
const defaultState = {
    version: ''
};

// Controller for the state
const reducer = (state: any, action: any) => { // NOSONAR
    if (action.type === SET_ATTACHE_VERSION) {
        return {
            version: action.payload
        };
    } else {
        return state;
    }
};

const getVersionId = () => {
    if (typeof window !== 'undefined') {
        const href = window.location.href;
        // find mongoose _id in href
        const id = href.match(/[a-f\d]{24}$/g);
        const isAdmin = /admin/.test(href);
        if (id && !isAdmin) {
            return id[0];
        }
    }
    return null;
};

const checkURLForVersion = () => {
    if (typeof window !== 'undefined') {
        return getVersionId();
    }
    return '';
};

// Reducer
const useVersionProviderReducer = (initialState: typeof defaultState) => useReducer(reducer, initialState);

// Create the provider
function VersionProvider({ value = [], ...props }) {//NOSONAR
    const [state, dispatch] = useVersionProviderReducer(defaultState);
    const isMounted = useIsMounted();

    const handleVersion = () => {
        if (typeof window !== 'undefined') {
            const storageVersion = localStorage.getItem('attacheVersion');
            const urlVersion = checkURLForVersion();

            if (storageVersion && !urlVersion) {
                dispatch({ type: SET_ATTACHE_VERSION, payload: storageVersion });
            } else if (urlVersion) {
                dispatch({ type: SET_ATTACHE_VERSION, payload: urlVersion });
                storageVersion !== urlVersion && localStorage.setItem('attacheVersion', urlVersion);
            } else {
                return;
            }
        }
    };

    useEffect(() => {
        isMounted && handleVersion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, props.children]);

    return <Provider value={[state, dispatch]} {...props} />;
}

// consumer
const useVersionState = () => useContext(versionStoreContext);

// export the provider and consumer
export { VersionProvider, useVersionState };
