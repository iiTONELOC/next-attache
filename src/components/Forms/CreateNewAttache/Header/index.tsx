import { formStyles } from '../styles';
import { maxNumProjects } from '../constants';

export type HeaderProps = {
    currentStep?: number;
    title?: string;
};

export function AttacheFormHeader(props: HeaderProps): JSX.Element {
    const { header, headerText } = formStyles;

    let { title, currentStep } = props;

    currentStep = currentStep || 0;
    title = title || 'Add Projects';

    const numToDisplay = currentStep > maxNumProjects ? maxNumProjects : currentStep;


    return (
        <header className={header}>
            <h2 className={headerText}>
                {title}
            </h2>
            {currentStep !== 0 && (
                <p className={headerText}>
                    {numToDisplay !== 0 && (`${numToDisplay} of ${maxNumProjects}`)}
                </p>
            )}
        </header>
    );
}
