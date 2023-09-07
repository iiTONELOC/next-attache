import Head from 'next/head';
import { useState } from 'react';
import AuthService from '../../utils/Auth';
import { isMountedType } from '../../types';
import GitHubAPI from '../../../lib/GitHubAPI';
import { HiDocumentAdd } from 'react-icons/hi';
import { useHovered, useIsMounted } from '../../hooks';
import DefaultUserSettings from '../../../attache-defaults.json';
import { CreateNewAttache, AttacheList } from '../../components';
import { AiOutlineCloseCircle as CloseIcon } from 'react-icons/ai';
import { getAttacheIds } from '../../../lib/db/controller/Attache';


export type dashboardProps = {
    repoNames: string[];
    createdAttaches: string[];
};

export default function Dashboard(props: dashboardProps): JSX.Element | null { // NOSONAR
    const isMounted: isMountedType = useIsMounted();
    const { isHovered, handleHover } = useHovered();
    const [showForm, setShowForm] = useState(false);
    const loggedIn = AuthService.loggedIn();
    const { repoNames } = props;

    if (!isMounted) {
        return null;
    }

    const pageStyles = {
        mainContainer: 'flex flex-col items-center justify-start h-full py-2',
        header: 'flex flex-wrap flex-row items-center justify-center w-full px-4 py-2',
        headerTitle: 'w-full text-4xl text-center font-bold text-gray-300',
        addButton: `w-1/2 sm:w-1/3 h-auto gap-3 p-3 bg-zinc-800 rounded-lg flex flex-col items-center justify-around mt-6 
        hover:bg-green-800 hover:scale-105 transition-all duration-300.`,
        addIcon: `w-12 h-12 text-green-800 ${isHovered ? 'text-zinc-800' : 'text-green-800'}`,
        iconText: `text-xl font-bold ${isHovered ? 'text-zinc-800' : 'text-green-800'} ${isHovered ? 'text-2xl' : ''}`,
        formContainer: 'mt-6 w-full sm:w-5/6 md:w-4/6 2xl:w-1/2 flex flex-col items-center justify-start px-4 py-2',
        formHeader: 'bg-zinc-900 w-full relative text-center p-2 rounded-t-lg',
        formTitle: 'w-full text-2xl text-center font-bold text-gray-300',
        sectionIcon: 'w-6 h-6 text-gray-600 absolute top-0 right-0 m-1 hover:text-red-600 cursor-pointer hover:animate-spin transition-all duration-300',
        attacheListContainer: 'w-full flex justify-center p-3 overflow-hidden',
    };

    // only used when adding because we need to
    // reset the hover state
    // when closing the form this doesn't matter
    const handleAddClick = (): void => {
        setShowForm(!showForm);
        handleHover();
    };

    !loggedIn && AuthService.forceSignIn();

    return loggedIn ? (
        <main className={pageStyles.mainContainer}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Admin Dashboard`}</title>
            </Head>

            <header className={pageStyles.header}>
                <h1 className={pageStyles.headerTitle}>Admin Dashboard</h1>
            </header>

            {!showForm && (
                <button
                    className={pageStyles.addButton}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleHover}
                    onClick={() => handleAddClick()}
                >
                    <HiDocumentAdd className={pageStyles.addIcon} />

                    <p className={pageStyles.iconText}>Create new Attaché</p>

                </button>
            )
            }

            <section className={pageStyles.formContainer}>
                {showForm ? (
                    <>
                        <header className={pageStyles.formHeader}>
                            <h2 className={pageStyles.formTitle}>
                                Creating Attaché
                            </h2>
                            <CloseIcon
                                className={pageStyles.sectionIcon}
                                onClick={() => setShowForm(!showForm)}
                            />
                        </header>

                        <CreateNewAttache
                            repoNames={repoNames || []}
                            closeForm={() => setShowForm(!showForm)} />

                    </>
                ) : null
                }
            </section>

            {!showForm && (
                <section className={pageStyles.attacheListContainer}>
                    <AttacheList id={props.createdAttaches} />
                </section>
            )}

        </main>
    ) : (
        <>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Admin Dashboard`}</title>
            </Head>
            Not Authorized!
        </>
    );
}

export async function getServerSideProps(context: object) {
    const [repoNames, attacheIds] = await Promise.all([
        GitHubAPI.getAllRepoNames(),
        getAttacheIds()
    ]);
    return {
        props: {
            repoNames: repoNames.data,
            // list of attache _ids
            createdAttaches: attacheIds.map(el => String(el?._id))
        }
    };
}

