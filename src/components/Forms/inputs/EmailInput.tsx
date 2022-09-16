import { useState } from 'react';

const validateEmail = (email: string) => {
    const emailRegex = /.+@.+\..+/;
    return emailRegex.test(email);
};

type propTypes = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    defaultValue: string | null
};


export default function EmailInput({ onChange, defaultValue }: propTypes) {
    const [error, setError] = useState<null | string>(null);

    const clearError = () => {
        setTimeout(() => {
            setError(null);
        }, 10000);
    };

    const validate = (e: React.SyntheticEvent) => {
        const { value } = e.target as HTMLInputElement;
        const len = value.length;

        if (len === 0) {
            setError('Email is required');
            clearError();
        }

        if (len > 0) {
            const isValid = validateEmail(value);
            if (!isValid) {
                setError('Please enter a valid email address');
                clearError();
            } else {
                setError(null);
            }
        }
    };

    return (
        <div className="relative">
            {error !== null && (
                <div className="absolute bottom-0 right-0 z-40 mb-1 mr-1">
                    <p className='text-red-500 '>{error}</p>
                </div>
            )}
            <label htmlFor="email-address" className="sr-only" >
                Email address
            </label>
            <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                onBlur={validate}
                onChange={onChange}
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border bg-yellow-100 border-gray-300
                placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                defaultValue={defaultValue || ''}
            />
        </div>
    );
}
