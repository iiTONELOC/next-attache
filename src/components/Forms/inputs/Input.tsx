import { useState } from 'react';
import { inputTypes } from './attache/types';
import { errorType } from '../../../types';

export const clearErrorTimeoutMs = 10000;

export default function Input(props: inputTypes): JSX.Element {
    const [error, setError] = useState<errorType>(null);

    const {
        id,
        name,
        type,
        required,
        className,
        description,
        placeholder,
        currentValue,
        autoComplete,
        errorClearTime,
        onChange,
        validate,
        setValidated
    } = props;

    const clearError = () => {
        setTimeout(() => {
            setError(null);
        }, errorClearTime || clearErrorTimeoutMs);
    };

    const _validate = (e: React.SyntheticEvent) => validate(
        e, setValidated, setError, clearError
    );

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        _validate(e);
    };

    const _props = {
        id,
        type,
        name,
        required,
        placeholder,
        autoComplete,
        onBlur: _validate,
        value: currentValue,
        onChange: handleOnChange,
        className: className || `appearance-none rounded-lg relative 
                block w-full px-3 py-2 bg-zinc-800 border-purple-900
                border-2 placeholder-gray-500 text-gray-300 focus:outline-none 
                focus:ring-purple-700 focus:border-purple-700 focus:z-10
                sm:text-sm text-shadow`.replace(/\n/g, ' ')
    };


    return (
        <div className='relative'>
            {error !== null && (
                <div className="absolute bottom-0 right-0 z-40 mb-1 mr-1">
                    <p className='text-red-600 text-shadow'>{error}</p>
                </div>
            )}
            <label htmlFor={name} className="sr-only">{description}</label>
            {
                /* @ts-ignore */
                type === 'textarea' ? (<textarea rows={6} {..._props} />) : <input {..._props} />
            }

        </div>
    );
}
