import Input from '../../inputs/Input';
import { useIsMounted } from '../../../../hooks';
import { validateEmail } from '../../../../utils';
import { InputProps, inputTypes } from '../../inputs/attache/types';

export default function Email_Input({ //NOSONAR
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
            _setError('Email is required');
            setValidated(false);
            _clearError();
        }

        if (len > 0) {
            const isValid = validateEmail(value);
            if (!isValid) {
                _setError('Please enter a valid email address');
                setValidated(false);
                _clearError();
            } else {
                setValidated(true);
                _setError(null);
            }
        }
    };

    return isMounted ? <Input
        type='text'
        name='email'
        id='contactEmail'
        required={true}
        autoComplete='off'
        onChange={onChange}
        validate={validate}
        currentValue={currentValue}
        setValidated={setValidated}
        placeholder={`What's your email?`}
        description='Your email'
    /> : null;
}
