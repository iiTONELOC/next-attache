import { createContext, useContext, useEffect, useReducer } from 'react';
import ProfileDefaults from '../../attache-defaults.json';
import { SET_AVATAR } from '../actions';
import { useIsMounted } from '../hooks';
import API from '../utils/API';


// Create our context
const versionStoreContext = createContext<any>(null); //NOSONAR
// Get the provider
const { Provider } = versionStoreContext;

// Initial State
const defaultState = '';

// Controller for the state
const reducer = (state: any, action: any) => { // NOSONAR
    if (action.type === SET_AVATAR) {
        return action.payload;
    } else {
        return state;
    }
};


// Reducer
const useAvatarReducer = (initialState: typeof defaultState) => useReducer(reducer, initialState);

// Create the provider
function AvatarProvider({ value = [], ...props }) {//NOSONAR
    const [state, dispatch] = useAvatarReducer(defaultState);
    const isMounted = useIsMounted();

    const getAndSetAvatar = (): void => {
        const currUrl = state;

        const defaultUrl = ProfileDefaults?.avatar;

        if (defaultUrl && defaultUrl !== currUrl) {
            dispatch({
                type: SET_AVATAR,
                payload: defaultUrl
            });
        } else if (!defaultUrl && !currUrl) {
            API.getAvatar().then(d => {
                const url = d?.avatar_url;

                if (url && url !== currUrl) {
                    dispatch({
                        type: SET_AVATAR,
                        payload: url ? url : '/images/default-img.jpg'
                    });
                }
            }).catch(e => {
                console.error('There was an error updating the avatar url:\n', e);
            });
        } else {
            // do nothing
        }
    };

    useEffect(() => {
        isMounted && getAndSetAvatar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    return <Provider value={[state, dispatch]} {...props} />;
}

// consumer
const useAvatarState = () => useContext(versionStoreContext);

// export the provider and consumer
export { AvatarProvider, useAvatarState };
