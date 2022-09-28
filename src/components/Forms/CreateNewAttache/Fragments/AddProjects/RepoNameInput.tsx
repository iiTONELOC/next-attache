import { useIsMounted } from '../../../../../hooks';
import AttacheInput from '../../../inputs/attache/AttacheInput';
import { AttacheInputProps, inputTypes } from '../../../inputs/attache/types';

export default function RepoNameInput({ //NOSONAR
    onChange,
    currentValue,
    setValidated,
    availableRepos
}: AttacheInputProps
): JSX.Element | null {
    const isMounted = useIsMounted();
    const validate = (
        e: React.SyntheticEvent,
        setValidated: inputTypes['setValidated'],
        _setError: React.Dispatch<React.SetStateAction<string | null>>,
        _clearError: Function
    ) => {

        const { value } = e.target as HTMLInputElement;
        const len = value.length;

        if (len === 0) {
            _setError('A repo name is required');
            setValidated(false);
            _clearError();
        } else if (len > 0 && len <= 2) {
            _setError('Repo names must be at least 3 characters');
            setValidated(false);
            _clearError();
        } else if (!availableRepos?.includes(value)) {
            _setError('Invalid repo name');
            setValidated(false);
            _clearError();
        } else {
            _setError(null);
            setValidated(true);
        }
    };


    return isMounted ? <AttacheInput
        type='text'
        name='name'
        id='repoName'
        required={true}
        autoComplete='off'
        onChange={onChange}
        validate={validate}
        currentValue={currentValue}
        setValidated={setValidated}
        placeholder='Enter a repo name'
        description='The name of the repo'
    /> : null;
}
