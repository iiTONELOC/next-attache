import { useState } from 'react';
import API from '../../utils/API';
import FormContainer from './FormContainer';
import { UsernameInput, PasswordInput } from './inputs';
import { HiLockClosed, HiExclamationCircle as AlertIcon } from 'react-icons/hi';
import { errorType } from '../../types';

type FormState = {
    email?: string,
    password?: string,
    username?: string
};

export const timeOutInMilliseconds = 3500;
export const minPassLength = 18;

export function isFormValidated(password: string) {
    const length: number = password?.length || 0;
    return length >= minPassLength;
}

export default function LoginForm() {
    const [formState, setFormState] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState<errorType>(null);

    const handleChange = (e: React.SyntheticEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSignUpInstead: React.MouseEventHandler<HTMLButtonElement> = e => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/admin/sign-up';
    };

    const handleErrorMessage: (message: string) => void = message => {
        setErrorMessage(message);
        setTimeout(() => {
            setErrorMessage(null);
        }, timeOutInMilliseconds);
    };

    const submitFormHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const user = {
            name: formState.username || '',
            password: formState.password || ''
        };
        if (isFormValidated(formState.password)) {
            try {
                // will automatically redirect to /admin if successful
                const response = await API.adminLogin(user);
                if (!response?.data?.token) {
                    const { error } = response;

                    error && handleErrorMessage(error.message);
                }
            } catch (error) {
                /*@ts-ignore */
                handleErrorMessage(error.message || 'An error occurred');
            }
        } else {
            handleErrorMessage('Password must be at least 18 characters');
        }
    };

    return (
        <>
            <div className='bg-red-500 rounded-lg text-white flex flex-row justify-between drop-shadow-lg'>
                {errorMessage && <>
                    <AlertIcon className='ml-1 w-7 h-7 self-center' />
                    <span className='p-2 ml-1 content-center'>
                        {errorMessage}
                    </span>
                </>
                }
            </div>
            <FormContainer>
                <h2 className='text-center text-xl text-gray-300 -mt-8'>Login</h2>

                <div className="rounded-md shadow-sm -space-y-px">
                    <UsernameInput
                        onChange={handleChange}
                        defaultValue={formState.username}
                        isSignUp={true}
                    />
                    <PasswordInput onChange={handleChange} />
                </div>

                <div className="flex items-center justify-between">
                    <span
                        tabIndex={-1}
                        onClick={handleSignUpInstead}
                        className="bg-slate-900 hover:bg-indigo-800 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Create account instead
                    </span>
                </div>

                <div>
                    <button
                        onClick={submitFormHandler}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white
                        bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <HiLockClosed className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                        </span>
                        Sign in
                    </button>
                </div>
            </FormContainer>
        </>
    );
}
