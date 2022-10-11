import { useIsMounted, useIsLandscape } from '../../hooks';

const styles = {
    section: 'w-11/12 h-screen flex flex-col items-center justify-start rounded-lg gap-y-3',
    header: 'w-full h-auto flex flex-col items-center justify-center gap-y-3',
    heading: 'text-4xl font-bold text-center mt-3 p-2',
    toolbar: 'p-2 w-3/4 lg:w-2/3 xl:1/2 h-auto flex flex-row items-center justify-end bg-green-800 gap-x-5',
    body: 'w-full h-full flex flex-col items-center justify-start'
};

export default function Resume(props: {}): JSX.Element { // NOSONAR
    const { isLandscape } = useIsLandscape();
    const isMounted = useIsMounted();

    return isMounted ? (
        <section className={styles.section}>
            <header className={styles.header}>
                <h1 className={styles.heading}>Resume</h1>
            </header>

            <div className={styles.body}>
                {isLandscape && <embed
                    className='w-full h-full'
                    src={'/Resume.pdf'} />}

                {!isLandscape && <embed
                    className='w-full h-full'
                    type='application/pdf'
                    src={'/Resume.pdf'} />}
            </div>
        </section>
    ) : <></>;
}
