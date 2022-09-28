import { useEffect, useState } from 'react';
import { useIsMounted } from '../../../hooks';
import { FormInputState, AttacheState } from './types';
import { dashboardProps } from '../../../pages/admin/dashboard';
import {
    maxNumProjects,
    defaultAttacheState,
    defaultFormInputState
} from './constants';

import { formStyles } from './styles';
import { AddProjects } from './Fragments';

const footerStyles = formStyles.footer;
const btnStyles = formStyles.button;
const addBtnStyles = formStyles.addButton;

export default function CreateNewAttache(props: { repoNames: dashboardProps['repoNames'] }): JSX.Element {
    /*
        AddProject Managed State
    */
    const [formInputState, setFormInputState] = useState<FormInputState>(defaultFormInputState);
    const [repoNamePool, setRepoNamePool] = useState<string[] | undefined>(props.repoNames);
    const [attacheState, setAttacheState] = useState<AttacheState>(defaultAttacheState);
    const [repoNameValidated, setRepoNameValidated] = useState<boolean>(false);
    const [repoUrlValidated, setRepoUrlValidated] = useState<boolean>(false);
    const [validProjectInputs, setValidProjectInputs] = useState<boolean>([repoNameValidated, repoUrlValidated].every(Boolean));
    const [currentStep, setCurrentStep] = useState<number>(0);

    // Current component only
    const isMounted: boolean | null = useIsMounted();

    /* 
        Dynamic CSS Styles

            Sometimes inline dynamic styles do not load properly,
            TailwindCSS seems to purge the declarations or some properties
            intermittently appear. To fix this, all styles are declared in
            the ./styles.ts file and imported into the component. We can then
            decide here which styles to use based on the current state of the
            component.    
       */

    const footerStyle = footerStyles.container + ` ${currentStep > 1 ?
        footerStyles.currentStepGreaterThan1 :
        footerStyles.currentStepLessThan1}`;

    const addButton = btnStyles + ` ${validProjectInputs ? addBtnStyles.validated :
        addBtnStyles.default}`;

    const backButtonStyles = btnStyles + ` ${formStyles.backButton}`;

    /*
        Event Handlers
    */

    // Add Project Inputs
    const handleAddProjectStateChange = (e: React.SyntheticEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormInputState({
            ...formInputState,
            [name]: value
        });
    };

    // add project to attacheState
    const addProject = () => {
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

    // Adds the project to the list for the attache
    const handleAddProject = (e: React.SyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        validProjectInputs && isMounted && addProject();
    };

    // Fired once all projects have been added
    // Will toggle state for the form to appear
    const getAttacheInfo = async (e: React.SyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        // const attache = await API.createAttache(attacheState);
        // TODO: CONTINUE PROCESS
        // FIXME: need to get the name, any notes and a resume for the attache
    };

    // controls the back button in the AddProjects fragment
    const handleGoBackProject = () => {
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

    /*
     * Initial State
     */
    useEffect(() => {
        setCurrentStep(1);
        return () => {
            setCurrentStep(0);
            setAttacheState(defaultAttacheState);
        };
    }, []);

    /**
     * Validates inputs for AddProject Fragment
     */
    useEffect(() => {
        isMounted && setValidProjectInputs(
            [repoNameValidated, repoUrlValidated].every(Boolean)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formInputState]);

    if (!isMounted && repoNamePool?.length === 0) {
        return <></>;
    }




    return (
        <div className={formStyles.container} >
            <form className={formStyles.form} autoComplete="off">
                <AddProjects
                    currentStep={currentStep}
                    currentNameValue={formInputState.name}
                    currentUrlValue={formInputState.liveUrl}
                    addBtnClassNames={addButton}
                    backBtnClassNames={backButtonStyles}
                    footerClassNames={footerStyle}
                    availableRepoNames={repoNamePool}
                    attacheState={attacheState}
                    onNameChange={handleAddProjectStateChange}
                    onUrlChange={handleAddProjectStateChange}
                    setNameValidated={setRepoNameValidated}
                    setUrlValidated={setRepoUrlValidated}
                    handleAddProject={handleAddProject}
                    handleGoBackProject={handleGoBackProject}
                    handleFinishProjects={getAttacheInfo}
                />
            </form>
        </div>
    );
}
