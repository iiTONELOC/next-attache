import { useEffect, useState } from 'react';

export default function AttacheVersion() { //NOSONAR
    const [attacheVersion, setAttacheVersion] = useState('');

    useEffect(() => {
        const existingVersion = localStorage.getItem('attacheVersion');
        if (existingVersion) {
            setAttacheVersion(existingVersion);
        }
    }, []);

    return {
        attacheVersion
    };
}
