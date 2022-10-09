import { useState, useEffect } from 'react';
import FormContainer from '../FormContainer';
import ContactNameInput from './ContactName';
import { useIsMounted } from '../../../hooks';
import Email_Input from '../inputs/Email_Input';
import ContactMessage from './ContactMessage';
import styles from './styles';


const defaultFormState = {
    name: '',
    email: '',
    message: ''
};

type formButton = {
    name: string;
    type: 'submit' | 'reset';
    className: string;
    onClick: (e: React.SyntheticEvent) => void;
};

export default function ContactForm() { //NOSONAR
    const [formState, setFormState] = useState<typeof defaultFormState>(defaultFormState);
    const [messageValidated, setMessageValidated] = useState<boolean>(false);
    const [emailValidated, setEmailValidated] = useState<boolean>(false);
    const [nameValidated, setNameValidated] = useState<boolean>(false);

    const isFormValidated = () => [messageValidated, emailValidated, nameValidated].every(Boolean);

    const [formValidated, setFormValidated] = useState<boolean>(isFormValidated());

    const isMounted: boolean | null = useIsMounted();

    const handleFormStateChange = (e: React.SyntheticEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormState({ ...formState, [name]: value });
    };

    const resetState = () => {
        setFormState(defaultFormState);
        setFormValidated(false);
        setMessageValidated(false);
        setEmailValidated(false);
        setNameValidated(false);
    };

    const handleSubmitForm = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (formValidated) {
            alert('Form submitted!');
            resetState();
            window.location.assign('/');
        }
    };


    const handleResetForm = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        resetState();
    };


    useEffect(() => {
        isMounted && setFormValidated(isFormValidated());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState]);



    const formButtons: formButton[] = [
        {
            name: 'Cancel', type: 'reset',
            className: [styles.button, styles.cancelButton].join(' '),
            onClick: handleResetForm
        },
        {
            name: 'Submit', type: 'submit',
            className: `${styles.button} ${formValidated ? styles.submitButton.verified : styles.submitButton.regular}`,
            onClick: handleSubmitForm
        }
    ];

    const renderButtons = () => formButtons.map(({ name, type, className, onClick }, i) => (

        <button
            key={i}
            type={type}
            className={className}
            onClick={onClick}
        >
            {name}
        </button>
    ));


    return (
        isMounted ? (
            <FormContainer>
                <h1 className={styles.title}>{`Let's get in touch!`}</h1>

                <ContactNameInput
                    onChange={handleFormStateChange}
                    currentValue={formState.name}
                    setValidated={setNameValidated}
                />

                <Email_Input
                    onChange={handleFormStateChange}
                    currentValue={formState.email}
                    setValidated={setEmailValidated}
                />

                <ContactMessage
                    onChange={handleFormStateChange}
                    currentValue={formState.message}
                    setValidated={setMessageValidated}
                />

                {
                    formValidated ? (
                        <section className={styles.buttonSection}>
                            {renderButtons()}
                        </section>
                    ) : <></>
                }

            </FormContainer>
        ) : <></>
    );
}
