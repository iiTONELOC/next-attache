import { useProjectCache } from '../../providers/AttacheProjectCache';
import ProjectCard from '../ProjectCard';
import { Suspense } from 'react';
import Loading from '../Loading';

export type componentProps = {
    names?: string[];
    dynamic?: boolean;
};


const styles = {
    projectSection: 'w-4/6 md:w-3/6 lg:w-4/6 h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 hover:gap-4 mt-5',
    div: 'text-white text-2xl text-center h-full'
};

export default function ProjectsComponent(props: componentProps) {
    const [projectState,] = useProjectCache();

    const { names, dynamic } = props;

    return (
        <section className={styles.projectSection}>
            <Suspense fallback={<Loading />}>
                {names?.map((repoName, index) => {
                    return (
                        <div className={styles.div} key={index}>
                            {projectState.projects[repoName] ? (
                                <ProjectCard
                                    project={projectState.projects[repoName]}
                                    dynamic={dynamic}
                                />
                            ) : <ProjectCard projectName={repoName} dynamic={dynamic} />}
                        </div>
                    );
                })}
            </Suspense>
        </section>
    );
}
