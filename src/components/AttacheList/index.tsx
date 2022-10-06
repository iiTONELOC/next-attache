import ListItem from './ListItem';
import { useState, useEffect } from 'react';
import { SET_LIST_STATE } from '../../actions';
import { useAttacheListState } from '../../providers';
import { useIsLandscape, useIsMounted } from '../../hooks';


export default function AttacheList(props: { id: string[] }): JSX.Element | null { //NOSONAR
    const [attacheListState, dispatch] = useAttacheListState();
    const { isLandscape } = useIsLandscape();
    const isMounted = useIsMounted();

    const setHeight = (): string => isLandscape ? 'max-h-[70vh]' : 'max-h-[40vh]';
    const [containerHeight, setContainerHeight] = useState(setHeight());

    const styles = {
        ul: `w-5/6 flex bg-zinc-900 p-3 rounded-md flex-col gap-3 items-center justify-start ${containerHeight} overflow-y-scroll p-2`,
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
        <ul className={styles.ul}>
            {attacheListState.attaches.map((attache: string) => (
                <ListItem
                    key={attache}
                    id={attache}
                />
            ))}
        </ul>
    ) : <>    </>;
}
