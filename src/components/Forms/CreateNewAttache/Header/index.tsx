import { formStyles } from '../styles';
import { maxNumProjects } from '../constants';

export type HeaderProps = {
    currentStep?: number;
    title?: string;
    numToDisplay?: number;
};

export function AttacheFormHeader(props: HeaderProps): JSX.Element {
    const { header, headerText } = formStyles;
    const { title, currentStep, numToDisplay } = props;

    return (
        <header className={header}>
            <h2 className={headerText}>
                {title || 'Adding Project'}
            </h2>
            {currentStep && (
                <p className={headerText}>
                    {numToDisplay && (`${numToDisplay} of ${maxNumProjects}`)}
                </p>
            )}
        </header>
    );
}
