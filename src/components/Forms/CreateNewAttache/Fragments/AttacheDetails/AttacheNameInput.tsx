import { useIsMounted } from '../../../../../hooks';
import Input from '../../../inputs/Input';
import { InputProps, inputTypes } from '../../../inputs/attache/types';

export function AttacheNameInput({ //NOSONAR
    onChange,
    currentValue,
    setValidated
}: InputProps
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
            _setError('An attaché name is required');
            setValidated(false);
            _clearError();
        } else if (len > 0 && len <= 2) {
            _setError('Attaché names must be at least 3 characters');
            setValidated(false);
            _clearError();
        } else {
            _setError(null);
            setValidated(true);
        }
    };


    return isMounted ? <Input
        type='text'
        name='name'
        id='attacheName'
        required={true}
        autoComplete='off'
        onChange={onChange}
        validate={validate}
        currentValue={currentValue}
        setValidated={setValidated}
        placeholder='Enter an attache name'
        description='Enter a name for your attaché'
    /> : null;
}
