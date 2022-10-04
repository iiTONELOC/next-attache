import { useIsMounted } from '../../../../../hooks';
import AttacheInput from '../../../inputs/attache/AttacheInput';
import { AttacheInputProps } from '../../../inputs/attache/types';

export function AttacheNotesInput({ //NOSONAR
    onChange,
    currentValue,
    setValidated
}: AttacheInputProps
): JSX.Element | null {
    const isMounted = useIsMounted();

    return isMounted ? <AttacheInput
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
