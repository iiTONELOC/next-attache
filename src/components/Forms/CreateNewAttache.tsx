/**
 * To create a new attache the portfolio needs to have at least 6 projects
 * Will will set the max at 8 because thats a lot of projects
 *
 * To add a new project the repository must have a README.md file
 * The screenshot and demo links are extracted from the README
 *
 * To add the project to the portfolio
 * we need the project name and link to live url
 *
 *  - If deployed to GitHub Pages we can pass GITHUB for the live url and the portfolio will automatically handle it
 *  - If not deployed to GitHub Pages we need to pass the live url
 *  - If the project is not deployed we can pass DEMO if there is a demo link in the README
 *
 *  Projects should be added in the order you want them to appear on the portfolio
 */


import { useState } from 'react';
import { useIsMounted } from '../../hooks';
import { RepoNameInput, RepoLiveUrlInput } from './inputs';

const minNumProjects = 6;
const maxNumProjects = 8;
const timeOutInMilliseconds = 4500;

interface FormInputState {
    name: string;
    liveUrl: string;
    demo: string;
}

const defaultFormInputState: FormInputState = {
    name: '',
    liveUrl: '',
    demo: ''
};

const canAddProjects = (currentStep: number): boolean => currentStep < maxNumProjects;
const hasEnoughProjects = (currentStep: number): boolean => currentStep >= minNumProjects;

export default function CreateNewAttache(): JSX.Element {
    const [formInputState, setFormInputState] = useState<FormInputState>(defaultFormInputState);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const isMounted = useIsMounted();


    const handleChange = (e: React.SyntheticEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormInputState({
            ...formInputState,
            [name]: value
        });
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(formInputState);
        if (isMounted) {
            setCurrentStep(currentStep + 1);
        }
    };

    const styles: { [key: string]: string } = {
        container: 'w-full  bg-zinc-900 rounded-lg p-3',
        form: '"w-full mt-8 space-y-6',
        footer: 'w-full flex justify-between items-center bg-green-800',
    };

    if (!isMounted) {
        return <></>;
    }

    return (
        <div className={styles.container} >
            <form className={styles.form} autoComplete="off">
                <RepoNameInput
                    onChange={handleChange}
                    defaultValue={formInputState.name}
                />

                <RepoLiveUrlInput
                    onChange={handleChange}
                    defaultValue={formInputState.liveUrl}
                />

                <footer className={styles.footer}>
                    {currentStep > 0 && (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            Back
                        </button>
                    )
                    }
                    <button
                        type="submit"
                        onClick={e => handleSubmit(e)}
                        disabled={!canAddProjects(currentStep)}
                    >
                        Add Project and Continue
                    </button>


                </footer>
            </form>
        </div>
    );
}
