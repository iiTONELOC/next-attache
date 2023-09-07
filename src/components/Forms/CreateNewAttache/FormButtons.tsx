const minNumSteps = 7;

export type BackButtonProps = {
    currentStep: number;
    handleBack: () => void;
    className: string;
    text?: string;
};

export function BackButton(props: BackButtonProps) { //NOSONAR
    const { text, currentStep, handleBack, className } = props;
    return (currentStep > 1 ? (
        <button
            type="button"
            className={className}
            onClick={handleBack}
        >
            {text || 'Back'}
        </button>) : <></>);
}

export type AddButtonProps = {
    currentStep: number;
    disableAddButton: (currentStep: number) => boolean;
    handleAddProject: (e: React.MouseEvent) => void;
    className: string;
    text?: string;
};

export function AddButton(props: AddButtonProps) {// NOSONAR
    const {
        disableAddButton,
        handleAddProject,
        currentStep,
        className,
        text
    } = props;

    return (
        !disableAddButton(currentStep) ? (
            <button
                type={currentStep < minNumSteps ? 'submit' : 'button'}
                onClick={e => handleAddProject(e)}
                disabled={disableAddButton(currentStep)}
                className={className}
            >
                {text || 'Add Project'}
            </button>
        ) :
            <></>
    );
}

export type SubmitButtonProps = {
    handleSubmit: (e: React.MouseEvent) => void;
    currentStep: number;
    label?: string;
    className: string;
};

export function SubmitAttache(props: SubmitButtonProps) {// NOSONAR
    const { currentStep, handleSubmit, className, label } = props;

    if (currentStep < minNumSteps) {
        return <></>;
    }

    return (
        <button
            onClick={e => handleSubmit(e)}
            type="submit"
            className={className}
        >
            {label || 'Create Attaché'}
        </button>
    );
}

export type AttacheAddProjectButtonProps = {
    styles: { section: { container: string, p: string } }
    backButtonProps: BackButtonProps;
    addButtonProps: AddButtonProps;
    submitButtonProps: SubmitButtonProps;
};

export function AttacheAddProjectButton(props: AttacheAddProjectButtonProps) {
    const { backButtonProps, addButtonProps, submitButtonProps, styles } = props;
    const { currentStep } = { ...backButtonProps };

    if (currentStep >= minNumSteps) {
        return (
            <section className={styles.section.container}>
                <p className={styles.section.p}>
                    You have added the minimum number of projects. Would you like
                    to continue adding projects or submit your attaché?
                </p>

                <BackButton text="Go back"{...backButtonProps} />
                {
                    currentStep < 9 && (
                        <AddButton text={
                            currentStep === 8 ? 'Add' : 'Add project and continue'}
                            {...addButtonProps}
                        />
                    )
                }
                <SubmitAttache {...submitButtonProps} />
            </section>

        );
    } else {
        return (
            <>
                <BackButton key='backButton' {...backButtonProps} />
                <AddButton key='addButton' {...addButtonProps} />
            </>
        );
    }
}
