import Head from 'next/head';
import { useState } from 'react';
import { isMountedType } from '../../types';
import GitHubAPI from '../../../lib/GitHubAPI';
import { HiDocumentAdd } from 'react-icons/hi';
import { useHovered, useIsMounted } from '../../hooks';
import DefaultUserSettings from '../../../attache-defaults.json';
import { AiOutlineCloseCircle as CloseIcon } from 'react-icons/ai';
import CreateNewAttache from '../../components/Forms/CreateNewAttache';

export type dashboardProps = {
    avatarUrl: string;
    repoNames: string[];
};

export default function Dashboard(props: dashboardProps): JSX.Element | null {
    const isMounted: isMountedType = useIsMounted();
    const { isHovered, handleHover } = useHovered();
    const [showForm, setShowForm] = useState(false);

    const { avatarUrl, repoNames } = props;

    if (!isMounted) {
        return null;
    }

    const pageStyles: { [key: string]: string } = {
        mainContainer: 'flex flex-col items-center justify-start min-h-screen py-2',
        header: 'flex flex-wrap flex-row items-center justify-center w-full px-4 py-2',
        headerTitle: 'w-full text-4xl text-center font-bold text-gray-300',
        addButton: 'w-1/3 h-auto gap-3 p-3 bg-zinc-800 rounded-lg flex flex-col items-center justify-around mt-6 hover:bg-green-800 hover:scale-105 transition-all duration-300',
        addIcon: `w-12 h-12 text-green-800 ${isHovered ? 'text-zinc-800' : 'text-green-800'}`,
        iconText: `text-xl font-bold ${isHovered ? 'text-zinc-800' : 'text-green-800'} ${isHovered ? 'text-2xl' : ''}`,
        sectionContainer: 'mt-6 w-full sm:w-5/6 md:w-4/6 2xl:w-1/2 flex flex-col items-center justify-start px-4 py-2',
        sectionHeader: 'bg-zinc-900 w-full relative text-center p-2 rounded-t-lg',
        sectionTitle: 'w-full text-2xl text-center font-bold text-gray-300',
        sectionIcon: 'w-6 h-6 text-gray-600 absolute top-0 right-0 m-1 hover:text-red-600 cursor-pointer hover:animate-spin transition-all duration-300'
    };

    // only used when adding because we need to
    // reset the hover state
    // when closing the form this doesn't matter
    const handleAddClick = (): void => {
        setShowForm(!showForm);
        handleHover();
    };

    return (
        <main className={pageStyles.mainContainer}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Admin Dashboard`}</title>
                <link rel="icon" href={avatarUrl} />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <header className={pageStyles.header}>
                <h1 className={pageStyles.headerTitle}>Admin Dashboard</h1>
            </header>
            {!showForm && <button
                className={pageStyles.addButton}
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
                onClick={() => handleAddClick()}
            >
                <HiDocumentAdd className={pageStyles.addIcon} />
                <p className={pageStyles.iconText}>Create new Attaché</p>
            </button>}
            <section className={pageStyles.sectionContainer}>
                {showForm ? (
                    <>
                        <header className={pageStyles.sectionHeader}>
                            <h2 className={pageStyles.sectionTitle}>
                                Creating Attaché
                            </h2>
                            <CloseIcon
                                className={pageStyles.sectionIcon}
                                onClick={() => setShowForm(!showForm)}
                            />
                        </header>
                        <CreateNewAttache repoNames={repoNames || []} />
                    </>
                ) : null
                }
            </section>
        </main>
    );
}

export async function getStaticProps() {
    const gitHubApi = new GitHubAPI();
    const [avatarUrl, repoNames] = await Promise.all([
        gitHubApi.getAvatarURL(),
        gitHubApi.getAllRepoNames()
    ]);

    return {
        props: {
            avatarUrl: avatarUrl.data.avatar_url,
            repoNames: repoNames.data
        }
    };
}

