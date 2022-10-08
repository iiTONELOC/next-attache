import { useState } from 'react';
import { inputTypes } from './types';
import { errorType } from '../../../../types';

export const clearErrorTimeoutMs = 10000;

export default function AttacheInput(props: inputTypes): JSX.Element {
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


    return (
        <div className='relative'>
            {error !== null && (
                <div className="absolute bottom-0 right-0 z-40 mb-1 mr-1">
                    <p className='text-red-600 '>{error}</p>
                </div>
            )}
            <label htmlFor="name" className="sr-only">
                {description}
            </label>
            <input
                id={id}
                type={type}
                name={name}
                onBlur={_validate}
                required={required}
                value={currentValue}
                placeholder={placeholder}
                onChange={handleOnChange}
                autoComplete={autoComplete}
                className={className || `appearance-none rounded-lg relative 
                block w-full px-3 py-2 bg-zinc-800 border-purple-900
                border-2 placeholder-gray-500 text-gray-300 focus:outline-none 
                focus:ring-purple-700 focus:border-purple-700 focus:z-10
                sm:text-sm`.replace(/\n/g, ' ')}
            />
        </div>
    );
}
