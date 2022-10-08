import { FcBriefcase as AttacheIcon } from 'react-icons/fc';
import { useAttacheListState } from '../../providers';
import { IsMobile, useIsMounted } from '../../hooks';
import { ADD_TO_LIST_CACHE } from '../../actions';
import AdminAPI from '../../utils/API/AdminAPI';
import { useEffect, useState } from 'react';




export default function ListItem(props: { id: string }) {
    const [attacheListState, dispatch] = useAttacheListState();
    const [displayDate, setDisplayDate] = useState('');
    const isMounted = useIsMounted();
    const { isMobile } = IsMobile();

    const styles = {
        tr: 'w-full hover:bg-zinc-700 cursor-pointer',
        td: 'p-5 text-shadow',
        tdNotes: `p-5 text-shadow truncate`,
        tdActions: {
            container: 'flex flex-row justify-center items-center gap-3 text-gray-400',
            view: 'hover:text-emerald-400 text-shadow',
            edit: 'hover:text-yellow-400 text-shadow',
            delete: 'hover:text-red-500 text-shadow'
        }
    };

    const { name, createdAt, notes } = attacheListState['cache'][props.id] || {};

    // truncate the notes at 50 characters
    const truncatedNotes = notes?.length > 50 ? `${notes.slice(0, 50)}...` : notes;

    const formatDateTime = (date: string) => {
        const currentDate = new Date(date).toLocaleString();
        if (isMobile) {
            return currentDate.split(',')[0];
        } else {
            return currentDate.replace(',', ' @');
        }
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

    useEffect(() => {
        if (isMounted && createdAt !== undefined) {
            setDisplayDate(formatDateTime(createdAt));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attacheListState['cache'][props.id], isMobile]);

    return (
        <tr className={styles.tr} >
            <td className={styles.td}>
                <span className='flex flex-row items-center gap-3'>
                    <AttacheIcon />
                    {name}
                </span>
            </td>

            <td className={styles.td}>
                {displayDate}
            </td>
            <td className={styles.tdNotes}>{truncatedNotes}</td>

            <td className={styles.td}>
                <span className={styles.tdActions.container}>
                    <button
                        className={styles.tdActions.view}
                        onClick={() => window.location.assign(`/admin/attaches/${props.id}`)}
                    >View</button>
                    <button className={styles.tdActions.edit}>Edit</button>
                    <button className={styles.tdActions.delete}>Delete</button>
                </span>
            </td>
        </tr>

    );
}
