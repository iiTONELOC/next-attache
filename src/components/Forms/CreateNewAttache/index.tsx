import { useEffect, useState } from 'react';
import { FormButtons } from './FormButtons';
import { useIsMounted } from '../../../hooks';
import { FormInputState, AttacheState } from './types';
import { RepoNameInput, RepoLiveUrlInput } from '../inputs';
import { dashboardProps } from '../../../pages/admin/dashboard';
import {
    styles,
    maxNumProjects,
    defaultAttacheState,
    defaultFormInputState
} from './constants';
import API from '../../../utils/API';

const canAddProjects = (currentStep: number): boolean => currentStep < maxNumProjects + 1;
const disableAddButton = (currentStep: number): boolean => !canAddProjects(currentStep);

export default function CreateNewAttache(props: { repoNames: dashboardProps['repoNames'] }): JSX.Element {
    const [formInputState, setFormInputState] = useState<FormInputState>(defaultFormInputState);
    const [attacheState, setAttacheState] = useState<AttacheState>(defaultAttacheState);
    const [repoNameValidated, setRepoNameValidated] = useState<boolean>(false);
    const [repoUrlValidated, setRepoUrlValidated] = useState<boolean>(false);
    const [validInputs, setValidInputs] = useState<boolean>([repoNameValidated, repoUrlValidated].every(Boolean));
    const [currentStep, setCurrentStep] = useState<number>(0);
    const isMounted: boolean | null = useIsMounted();

    const { repoNames } = props;

    const handleChange = (e: React.SyntheticEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormInputState({
            ...formInputState,
            [name]: value
        });
    };

    const handleAddProject = (e: React.SyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        validInputs && isMounted && addProject();
    };

    const handleSubmitAttache = async (e: React.SyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        console.log('CREATING NEW ATTACHE');
        console.log({ attacheState });
        const attache = await API.createAttache(attacheState);
    };

    const addProject = () => {
        // add project to attacheState
        setAttacheState({
            projectData: [
                ...attacheState.projectData,
                formInputState
            ]
        });

        // Reset State for the next project
        setFormInputState({ ...defaultFormInputState });
        setRepoNameValidated(false);
        setRepoUrlValidated(false);
        // Increment the current step
        setCurrentStep(currentStep + 1);
        // move the cursor back to the repo name input
        document.getElementById('repoName')?.focus();
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
        const projectData = [...attacheState.projectData];
        const lastProject = projectData.pop();

        if (lastProject) {
            setFormInputState(lastProject);
            setRepoNameValidated(true);
            setRepoUrlValidated(true);
        }

        attacheState.projectData.length <= maxNumProjects - 1 && (
            setAttacheState({ projectData })
        );
    };

    useEffect(() => {
        setCurrentStep(1);
        return () => {
            setCurrentStep(0);
            setAttacheState(defaultAttacheState);
        };
    }, []);

    useEffect(() => {
        isMounted && setValidInputs(
            [repoNameValidated, repoUrlValidated].every(Boolean)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formInputState]);

    if (!isMounted && repoNames.length === 0) {
        return <></>;
    }

    const footerStyle = styles.footer.container + ` ${currentStep > 1 ?
        styles.footer.currentStepGreaterThan1 :
        styles.footer.currentStepLessThan1}`;

    const addButton = styles.button + ` ${validInputs ? styles.addButton.validated :
        styles.addButton.default}`;

    const backButtonStyles = styles.button + ` ${styles.backButton}`;

    const numToDisplay = currentStep > maxNumProjects ? maxNumProjects : currentStep;
    return (
        <div className={styles.container} >
            <form className={styles.form} autoComplete="off">
                <header className={styles.header}>
                    <h2 className={styles.headerText}>
                        Adding Project
                    </h2>

                    <p className={styles.headerText}>
                        {numToDisplay} of {maxNumProjects}
                    </p>
                </header>

                <RepoNameInput
                    onChange={handleChange}
                    availableRepos={repoNames}
                    currentValue={formInputState.name}
                    setValidated={setRepoNameValidated}
                />

                <RepoLiveUrlInput
                    onChange={handleChange}
                    setValidated={setRepoUrlValidated}
                    currentValue={formInputState.liveUrl}
                />

                <footer className={footerStyle}>
                    <FormButtons
                        styles={{
                            section: {
                                container: styles.footer.textSectionContainer,
                                p: styles.footer.textSectionP
                            }
                        }}
                        addButtonProps={{
                            currentStep,
                            disableAddButton,
                            handleAddProject,
                            className: addButton
                        }}
                        backButtonProps={{
                            currentStep,
                            handleBack,
                            className: backButtonStyles
                        }}
                        submitButtonProps={{
                            currentStep,
                            attacheState,
                            handleSubmit: handleSubmitAttache,
                            className: styles.button + ` ${styles.submitButton}`
                        }}
                    />
                </footer>
            </form>
        </div >
    );
}
