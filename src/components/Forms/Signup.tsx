import { useState } from 'react';
// import auth from '../../utils/auth';
import { isFormValidated } from './Login';
// import { createNewUser } from "../../api";
import FormContainer from './FormContainer';

import { PasswordInput, EmailInput, UsernameInput } from './inputs';
import { HiPlusCircle, HiExclamationCircle as AlertIcon } from 'react-icons/hi';


type FormState = {
    username: string | null,
    email: string | null,
    password: string | null
};

export default function SignUpForm() {
    const [errorMessage, setErrorMessage] = useState<{ message: string } | null>(null);
    const [formState, setFormState] = useState<FormState>({ email: null, username: null, password: null });

    const handleChange = (e: React.SyntheticEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const submitFormHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // const newUser = {
        //     email: formState.email,
        //     username: formState.username,
        //     password: formState.password
        // };

        if (isFormValidated(formState)) {
            // FIXME:

            // const response = await createNewUser(newUser);
            // const data = await response.json();
            // const { token } = data;
            // if (response.status === 200) {
            //     return auth.login(token);
            // } else {
            //     const { error } = data;
            //     if (error) {
            //         setErrorMessage(error);
            //         setTimeout(() => {
            //             setErrorMessage(null);
            //         }, 3500)
            //     };
            // };
        };
    };

    return (
        <>
            <div className='bg-red-500 rounded-lg text-white flex flex-row justify-between drop-shadow-lg'>
                {errorMessage && <><AlertIcon className='ml-1 w-7 h-7 self-center' /><span className='p-2 ml-1 content-center'>{errorMessage.message}</span></>}
            </div>
            <FormContainer>
                <h2 className='text-center text-xl text-gray-300 -mt-8'>Sign Up</h2>
                <div className="rounded-md shadow-sm -space-y-px">
                    <EmailInput onChange={handleChange} defaultValue={formState.email || ''} />
                    <UsernameInput onChange={handleChange} defaultValue={formState.username} />
                    <PasswordInput onChange={handleChange} />
                </div>
                <div className="flex items-center justify-between">
                    <span
                        tabIndex={-1}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.replace('/admin/login');
                        }}
                        className="bg-slate-900 hover:bg-indigo-800 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Login instead
                    </span>
                </div>
                <div>
                    <button
                        onClick={submitFormHandler}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white
                        bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <HiPlusCircle className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                        </span>
                        Create account
                    </button>
                </div>
            </FormContainer>
        </>
    );
}
