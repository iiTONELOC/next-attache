import { ReactElement, useState } from 'react';

const componentStyles = {
    section: 'static',
    toolTipContainer: `mt-8 absolute bg-green-500 text-white px-3 py-1 pb-2 rounded-full flex flex-row justify-center items-center`
};

export default function WithToolTip({ children, tip }: { children: ReactElement, tip: string }): JSX.Element {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const toggleHover = (): void => setIsHovered(!isHovered);

    return (
        <section
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
            className={componentStyles.section}
        >
            {children}
            {isHovered && (
                <div className={componentStyles.toolTipContainer}>
                    <p>{tip}</p>
                </div>
            )}
        </section>
    );
}
