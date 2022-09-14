import { useState } from 'react';


export default function useHovered() {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleHover = (): void => setIsHovered(!isHovered);

    return { isHovered, handleHover };
}
