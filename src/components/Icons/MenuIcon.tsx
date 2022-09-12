import type { IconProps } from './types';

export default function MenuIcon(props?: IconProps): JSX.Element {
    return (
        <svg className={`w-6 h-6 ${props?.svg?.className || ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path
                className={props?.path?.className || ''}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
        </svg>
    );
}
