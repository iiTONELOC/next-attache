import AttacheInput from './AttacheInput';
import { inputTypes, AttacheInputProps } from './types';

const acceptableNonUrls: string[] = [
    'GITHUB',
    'NONE',
    'DEMO'
];

// regular expressions for validating URLs
const urlRegex = /^(https):\/\/[^ "]+$/;

export default function RepoLiveUrlInput({
    onChange, currentValue, setValidated
}: AttacheInputProps): JSX.Element {
    const liveUrl = 'liveUrl';

    const validate = (
        e: React.SyntheticEvent,
        setValidated: inputTypes['setValidated'],
        _setError: React.Dispatch<React.SetStateAction<string | null>>,
        _clearError: Function
    ) => {
        const { value } = e.target as HTMLInputElement;

        if (acceptableNonUrls.includes(value) || urlRegex.test(value)) {
            _setError(null);
            setValidated(true);
        } else {
            _setError('Invalid URL');
            setValidated(false);
            _clearError();
        }
    };

    return (
        <AttacheInput
            type='text'
            id={liveUrl}
            name={liveUrl}
            required={true}
            autoComplete='off'
            onChange={onChange}
            validate={validate}
            setValidated={setValidated}
            currentValue={currentValue}
            description='The URL to the deployed application'
            placeholder='Enter a deployment URL'
        />
    );
}
