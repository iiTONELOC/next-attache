import { useState } from 'react';

type propTypes = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    defaultValue: string,
};

export default function RepoNameInput({ onChange, defaultValue }: propTypes) {
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
            setError('A repo name is required');
            clearError();
        } else if (len > 0 && len <= 3) {
            setError('repoNames must be at least 3 characters');
            clearError();
        } else {
            setError(null);
        }
    };

    return (
        <div className='relative'>
            {error !== null && (
                <div className="absolute bottom-0 right-0 z-40 mb-1 mr-1">
                    <p className='text-red-500 '>{error}</p>
                </div>
            )}
            <label htmlFor="repoName" className="sr-only">
                Repo Name
            </label>
            <input
                id="repoName"
                name="repoName"
                type="repoName"
                onBlur={validate}
                autoComplete="repoName"
                onChange={onChange}
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border
                bg-yellow-100 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Enter a repo name"
                defaultValue={defaultValue || ''}
            />
        </div>
    );
}
