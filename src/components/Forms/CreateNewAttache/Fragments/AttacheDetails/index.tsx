import { AttacheFormHeader } from '../../Header';
import { AttacheNameInput } from './AttacheNameInput';
import { AttacheNotesInput } from './AttacheNotesInput';
import { BackButton, SubmitAttache } from '../../FormButtons';
import { InputProps } from '../../../inputs/attache/types';

import { formStyles } from '../../styles';

export type AttacheFormData = {
    name: string;
    notes?: string;
    resume?: string;
};
export const AttacheDetailsDefaultFormData = {
    name: '',
    notes: '',
    resume: ''
};

export type AttacheDetailsProps = {
    currentStep: number;
    isValidated: boolean;
    currentNameValue: string;
    footerClassNames: string;
    currentNotesValue?: string;
    currentResumeValue?: string;
    onChange: InputProps['onChange'];
    goBack: () => void;
    createAttache: (e: React.SyntheticEvent) => void;
    setNameValidated: InputProps['setValidated'];
};

export function AttacheDetails(props: AttacheDetailsProps) {
    const {
        isValidated,
        currentStep,
        footerClassNames,
        currentNameValue,
        currentNotesValue,
        goBack,
        createAttache,
        // currentResumeValue,
        setNameValidated,
        onChange
    } = props;

    /**
     * Form styles
     */
    const { backButton, submitButton, button, footer, container } = formStyles;
    const { currentStepGreaterThan1 } = footer;

    const sectionStyles = [
        'flex flex-wrap flex-row items-center',
        container,
        currentStepGreaterThan1
    ].join(' ');


    return (
        <>
            <AttacheFormHeader title='Attache Details' />

            <AttacheNameInput
                onChange={onChange}
                currentValue={currentNameValue}
                setValidated={setNameValidated}
            />

            <AttacheNotesInput
                onChange={onChange}
                currentValue={currentNotesValue || ''}
                setValidated={() => { }}
            />

            {/* TODO: Implement the Resume Input when decided how to handle */}

            <footer className={footerClassNames}>
                <section className={sectionStyles}>
                    <BackButton
                        currentStep={currentStep}
                        handleBack={goBack}
                        className={`${button} ${backButton}`}
                    />

                    {isValidated && (<SubmitAttache
                        className={`${button} ${submitButton}`}
                        currentStep={currentStep}
                        handleSubmit={createAttache}
                    />)}
                </section>
            </footer>
        </>
    );
}
