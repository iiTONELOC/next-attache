import { useEffect, useState } from 'react';
import { useIsMounted } from '../../../hooks';
import { FormInputState, AttacheState } from './types';
import { dashboardProps } from '../../../pages/admin/dashboard';
import {
    styles,
    maxNumProjects,
    defaultAttacheState,
    defaultFormInputState
} from './constants';

import { AddProjects } from './Fragments';

const canAddProjects = (currentStep: number): boolean => currentStep < maxNumProjects + 1;
const disableAddButton = (currentStep: number): boolean => !canAddProjects(currentStep);

export default function CreateNewAttache(props: { repoNames: dashboardProps['repoNames'] }): JSX.Element {
    const [formInputState, setFormInputState] = useState<FormInputState>(defaultFormInputState);
    const [repoNamePool, setRepoNamePool] = useState<string[] | undefined>(props.repoNames);
    const [attacheState, setAttacheState] = useState<AttacheState>(defaultAttacheState);
    const [repoNameValidated, setRepoNameValidated] = useState<boolean>(false);
    const [repoUrlValidated, setRepoUrlValidated] = useState<boolean>(false);
    const [validInputs, setValidInputs] = useState<boolean>([repoNameValidated, repoUrlValidated].every(Boolean));

    const [currentStep, setCurrentStep] = useState<number>(0);
    const isMounted: boolean | null = useIsMounted();

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

    const getAttacheInfo = async (e: React.SyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        // const attache = await API.createAttache(attacheState);
        // TODO: CONTINUE PROCESS
        // FIXME: need to get the name, any notes and a resume for the attache
    };

    const addProject = () => {
        // add project to attacheState
        setAttacheState({
            projectData: [
                ...attacheState.projectData,
                formInputState
            ]
        });

        // filter the repoName from the pool
        setRepoNamePool(repoNamePool?.filter(
            repoName => repoName !== formInputState.name));

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

    if (!isMounted && repoNamePool?.length === 0) {
        return <></>;
    }

    /* Dynamic Styles */

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
                <AddProjects
                    currentStep={currentStep}
                    numToDisplay={numToDisplay}
                    currentNameValue={formInputState.name}
                    currentUrlValue={formInputState.liveUrl}
                    addBtnClassNames={addButton}
                    backBtnClassNames={backButtonStyles}
                    footerClassNames={footerStyle}
                    availableRepoNames={repoNamePool}
                    attacheState={attacheState}
                    onNameChange={handleChange}
                    onUrlChange={handleChange}
                    setNameValidated={setRepoNameValidated}
                    setUrlValidated={setRepoUrlValidated}
                    handleAddProject={handleAddProject}
                    handleGoBackProject={handleBack}
                    handleFinishProjects={getAttacheInfo}
                />
            </form>
        </div >
    );
}
