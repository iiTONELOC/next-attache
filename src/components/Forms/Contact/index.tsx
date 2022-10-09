import { useState, useEffect, useRef } from 'react';
import Email_Input from '../inputs/Email_Input';
import ContactMessage from './ContactMessage';
import { useIsMounted } from '../../../hooks';
import ContactNameInput from './ContactName';
import FormContainer from '../FormContainer';
import emailjs from '@emailjs/browser';
import styles from './styles';

const defaultFormState = {
    user_name: '',
    user_email: '',
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
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [sendError, setSendError] = useState<boolean | null>(null);

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

    const emailJsFormRef = useRef<HTMLFormElement>(null);

    const displayMessage = (message: string) => {
        setMessage(message);
        setShowMessage(true);

        setTimeout(() => {
            setShowMessage(false);
            setMessage(null);
        }, 5000);
    };

    const handleSubmitForm = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (formValidated) {
            try {//NOSONAR
                emailjs.sendForm(
                    process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID || '',
                    process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID || '',
                    emailJsFormRef.current || '',
                    process.env.NEXT_PUBLIC_EMAIL_PUB_TOKEN || ''
                ).then(_ => {
                    displayMessage('Email sent successfully!');
                    resetState();
                    setTimeout(() => { window.location.assign('/') }, 3500);
                });
            } catch (error) {
                setSendError(true);
                displayMessage('There was an error sending your email. Please try again later.');
            }

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
            <FormContainer _ref={emailJsFormRef}>
                <h1 className={styles.title}>{`Let's get in touch!`}</h1>
                {showMessage ? (<h2 className={!sendError ? 'text-emerald-500' : 'text-red-500'}> {message} </h2>) : <></>}
                <ContactNameInput
                    onChange={handleFormStateChange}
                    currentValue={formState.user_name}
                    setValidated={setNameValidated}
                />

                <Email_Input
                    onChange={handleFormStateChange}
                    currentValue={formState.user_email}
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
