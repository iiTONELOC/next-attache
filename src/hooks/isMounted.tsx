import { useEffect, useState } from 'react';
import type { isMountedType } from '../types';

export default function useIsMounted() {
    const [isMounted, setIsMounted] = useState<isMountedType>(null);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(null);
    }, []);

    return isMounted;
}
