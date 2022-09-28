import { formStyles } from '../../styles';
import { AttacheState } from '../../types';
import RepoNameInput from './RepoNameInput';
import { FormButtons } from '../../FormButtons';
import { AttacheFormHeader } from '../../Header';
import { maxNumProjects } from '../../constants';
import RepoLiveUrlInput from './RepoLiveUrlInput';
import { AttacheInputProps } from '../../../inputs/attache/types';


export type AddProjectProps = {
    currentStep: number,
    numToDisplay: number,
    currentNameValue: string,
    currentUrlValue: string,
    footerClassNames: string,
    addBtnClassNames: string,
    backBtnClassNames: string,
    attacheState: AttacheState,
    availableRepoNames: AttacheInputProps['availableRepos'],
    onNameChange: AttacheInputProps['onChange'],
    onUrlChange: AttacheInputProps['onChange'],
    setNameValidated: AttacheInputProps['setValidated'],
    setUrlValidated: AttacheInputProps['setValidated'],
    handleGoBackProject: () => void,
    handleAddProject: (e: React.SyntheticEvent) => void,
    handleFinishProjects(e: React.SyntheticEvent): void
};


export function AddProjects(props: AddProjectProps) {
    const {
        currentStep,
        numToDisplay,
        currentNameValue,
        currentUrlValue,
        addBtnClassNames,
        footerClassNames,
        backBtnClassNames,
        availableRepoNames,
        attacheState,
        onNameChange,
        onUrlChange,
        setNameValidated,
        setUrlValidated,
        handleAddProject,
        handleGoBackProject,
        handleFinishProjects

    } = props;

    const canAddProjects = (currentStep: number): boolean => currentStep < maxNumProjects + 1;
    const disableAddButton = (currentStep: number): boolean => !canAddProjects(currentStep);

    return (
        <>
            <AttacheFormHeader
                currentStep={currentStep}
                numToDisplay={numToDisplay}
            />

            <RepoNameInput
                onChange={onNameChange}
                availableRepos={availableRepoNames}
                currentValue={currentNameValue}
                setValidated={setNameValidated}
            />

            <RepoLiveUrlInput
                onChange={onUrlChange}
                setValidated={setUrlValidated}
                currentValue={currentUrlValue}
            />

            <footer className={footerClassNames}>
                <FormButtons
                    styles={{
                        section: {
                            container: formStyles.footer.textSectionContainer,
                            p: formStyles.footer.textSectionP
                        }
                    }}
                    addButtonProps={{
                        currentStep,
                        disableAddButton,
                        handleAddProject,
                        className: addBtnClassNames
                    }}
                    backButtonProps={{
                        currentStep,
                        handleBack: handleGoBackProject,
                        className: backBtnClassNames
                    }}
                    submitButtonProps={{
                        currentStep,
                        attacheState,
                        handleSubmit: handleFinishProjects,
                        className: formStyles.button + ` ${formStyles.submitButton}`
                    }}
                />
            </footer>
        </>
    );
}
