import { useAttacheListState } from '../../providers';
import { ADD_TO_LIST_CACHE } from '../../actions';
import { useIsMounted } from '../../hooks';
import { useEffect } from 'react';
import AdminAPI from '../../utils/API/AdminAPI';

export default function ListItem(props: { id: string }) {
    const [attacheListState, dispatch] = useAttacheListState();
    const isMounted = useIsMounted();

    const styles = {
        li: 'w-full p-3 bg-pink-500 flex flex-row flex-wrap justify-between items-center px-4 mt-2',
    };

    useEffect(() => {
        if (isMounted) {
            const existsInCache = attacheListState['cache'][props.id];
            !existsInCache && AdminAPI.getAttacheById(props.id).then(res => {
                dispatch({ type: ADD_TO_LIST_CACHE, payload: res });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);
    // TODO: fetch the details of the attache from the database
    // Use the attache id to fetch the details
    return (
        <li className={styles.li}>
            {attacheListState['cache'][props.id] ? attacheListState['cache'][props.id].name : 'loading...'}
        </li>
    );
}
