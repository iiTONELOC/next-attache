import { useIsMounted } from '../../../../../hooks';
import Input from '../../../inputs/Input';
import { InputProps } from '../../../inputs/attache/types';

export function AttacheNotesInput({ //NOSONAR
    onChange,
    currentValue,
    setValidated
}: InputProps
): JSX.Element | null {
    const isMounted = useIsMounted();

    return isMounted ? <Input
        type='text'
        name='notes'
        id='attacheNotes'
        required={false}
        autoComplete='off'
        onChange={onChange}
        validate={() => { }}
        currentValue={currentValue}
        setValidated={setValidated}
        placeholder='Notes: '
        description='Enter any notes for your attaché'
    /> : null;
}
