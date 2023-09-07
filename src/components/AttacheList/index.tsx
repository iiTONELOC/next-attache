import ListItem from './ListItem';
import { useState, useEffect } from 'react';
import { SET_LIST_STATE } from '../../actions';
import { useAttacheListState } from '../../providers';
import { useIsLandscape, useIsMounted } from '../../hooks';


export default function AttacheList(props: { id: string[] }): JSX.Element { //NOSONAR
    const [attacheListState, dispatch] = useAttacheListState();
    const { isLandscape } = useIsLandscape();
    const isMounted = useIsMounted();

    const setHeight = (): string => isLandscape ? 'max-h-[70vh]' : 'max-h-[40vh]';
    const [containerHeight, setContainerHeight] = useState(setHeight());

    const styles = {
        container: `w-full sm:w-5/6 2xl:w-4/6 bg-zinc-900 flex flex-col justify-center items-center rounded-md ${containerHeight} overflow-y-auto`,
        table: `table-fixed w-full rounded-md ${containerHeight} overflow-y-scroll tracking-wide`,
        thead: 'w-full bg-zinc-800',
        thTitle: 'text-left p-5 text-shadow',
        tbody: 'w-full'
    };

    const handleIDs = () => {
        if (isMounted) {
            for (const ID of props.id) {
                if (!attacheListState.attaches.includes(ID)) {
                    dispatch({ type: SET_LIST_STATE, payload: ID });
                }
            }
        }
    };

    useEffect(() => {
        handleIDs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);


    // dynamically sets the height of the container depending on layout
    useEffect(() => {
        setContainerHeight(setHeight());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLandscape]);

    return isMounted && attacheListState.attaches.length > 0 ? (
        <section className={styles.container}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th className={styles.thTitle}>Name</th>
                        <th className={styles.thTitle}>Created At</th>
                        <th className={styles.thTitle}>Notes</th>
                        <th className={styles.thTitle}>Actions</th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {attacheListState.attaches.map((attache: string) => (
                        <ListItem
                            key={String(attache)}
                            id={attache}
                        />
                    ))}
                </tbody>
            </table>
        </section>
    ) : <>  </>;
}
