import { formStyles } from './styles';
import { useEffect, useState } from 'react';
import { useIsMounted } from '../../../hooks';
import AdminAPI from '../../../utils/API/AdminAPI';
import { FormInputState, AttacheState } from './types';
import { useAttacheListState } from '../../../providers';
import { dashboardProps } from '../../../pages/admin/dashboard';
import { SET_LIST_STATE, ADD_TO_LIST_CACHE } from '../../../actions';
import {
    AddProjects,
    AttacheDetails,
    AttacheFormData,
    AttacheDetailsDefaultFormData
} from './Fragments';
import {
    maxNumProjects,
    defaultAttacheState,
    defaultFormInputState
} from './constants';



const addBtnStyles = formStyles.addButton;
const footerStyles = formStyles.footer;
const btnStyles = formStyles.button;


export default function CreateNewAttache(
    props: {
        repoNames: dashboardProps['repoNames'],
        closeForm: () => void,
    }
): JSX.Element {
    /* AddProject Fragment Managed State */
    const [formInputState, setFormInputState] = useState<FormInputState>(defaultFormInputState);
    const [repoNamePool, setRepoNamePool] = useState<string[] | undefined>(props.repoNames);
    const [attacheState, setAttacheState] = useState<AttacheState>(defaultAttacheState);
    const [repoNameValidated, setRepoNameValidated] = useState<boolean>(false);
    const [repoUrlValidated, setRepoUrlValidated] = useState<boolean>(false);
    const [validProjectInputs, setValidProjectInputs] = useState<boolean>([repoNameValidated, repoUrlValidated].every(Boolean));
    const [currentStep, setCurrentStep] = useState<number>(0);

    /*  Controls which fragment is rendered  */
    const [projectsAdded, setProjectsAdded] = useState<boolean>(false);

    /*  AttacheDetails Fragment Managed State  */
    const [attacheFormState, setAttacheFormState] = useState<AttacheFormData>(AttacheDetailsDefaultFormData);
    const [attacheDetailsNameValidated, setAttacheDetailsNameValidated] = useState<boolean>(false);

    /* AttacheListState Provider Used to update the AttacheList component without forcing a page refresh  */
    const [, dispatch] = useAttacheListState();

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

    /*  Event Handlers  */

    // Add Project Inputs
    const handleAddProjectStateChange = (e: React.SyntheticEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormInputState({
            ...formInputState,
            [name]: value
        });
    };

    // Attache Details
    const handleAttacheDetailsOnChange = (e: React.SyntheticEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setAttacheFormState({
            ...attacheFormState,
            [name]: value
        });
    };

    // add project to attacheState
    const addProject = () => {
        setAttacheState({
            ...attacheState,
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
        // toggle the view
        setProjectsAdded(true);
    };


    const handleCreateAttache = async (e: React.SyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        const attache = await AdminAPI.createAttache({
            ...attacheState,
            details: {
                ...attacheFormState
            }
        });

        if (attache) {
            // reset the state
            setCurrentStep(0);
            setProjectsAdded(false);
            setRepoUrlValidated(false);
            setRepoNameValidated(false);
            setValidProjectInputs(false);
            setAttacheState(defaultAttacheState);
            setFormInputState(defaultFormInputState);
            setAttacheFormState(AttacheDetailsDefaultFormData);

            // close the form
            props?.closeForm();
            // update the list state
            dispatch({ type: SET_LIST_STATE, payload: attache._id });
            // add the attache data to the list cache
            dispatch({ type: ADD_TO_LIST_CACHE, payload: attache });
        }
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
            projectsAdded && setProjectsAdded(false);
        }

        attacheState.projectData.length <= maxNumProjects - 1 && (
            setAttacheState({
                ...attacheState,
                projectData
            })
        );
    };

    /* Initial State */
    useEffect(() => {
        setCurrentStep(currentStep === 0 ? 1 : currentStep);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Validates inputs for AddProject Fragment */
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
                {/* Returns the Add Project Fragment by default */}
                {
                    !projectsAdded ? <AddProjects
                        currentStep={currentStep}
                        addBtnClassNames={addButton}
                        footerClassNames={footerStyle}
                        availableRepoNames={repoNamePool}
                        backBtnClassNames={backButtonStyles}
                        currentNameValue={formInputState.name}
                        currentUrlValue={formInputState.liveUrl}
                        onNameChange={handleAddProjectStateChange}
                        onUrlChange={handleAddProjectStateChange}
                        handleGoBackProject={handleGoBackProject}
                        setNameValidated={setRepoNameValidated}
                        setUrlValidated={setRepoUrlValidated}
                        handleFinishProjects={getAttacheInfo}
                        handleAddProject={handleAddProject}
                    /> : <AttacheDetails
                        currentStep={currentStep}
                        footerClassNames={footerStyle}
                        currentNameValue={attacheFormState.name}
                        isValidated={attacheDetailsNameValidated}
                        currentNotesValue={attacheFormState.notes}
                        currentResumeValue={attacheFormState.resume}
                        setNameValidated={setAttacheDetailsNameValidated}
                        onChange={handleAttacheDetailsOnChange}
                        createAttache={handleCreateAttache}
                        goBack={handleGoBackProject}
                    />
                }
            </form>
        </div>
    );
}
