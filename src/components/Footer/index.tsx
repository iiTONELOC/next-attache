import gitHubSettings from '../../../.github.config.json';
import userSettings from '../../../attache-defaults.json';
import { BsGithub, BsLinkedin, BsEnvelope } from 'react-icons/bs';

const { username } = gitHubSettings;
const { linkedIn, email } = userSettings;

type footerLink = {
    href: string;
    name: string;
    icon: JSX.Element;
};

const componentStyles = {
    footer: 'w-full h-auto bg-zinc-900 flex flex-wrap flex-row justify-center items-center gap-2 p-3',
    linkSection: 'w-full h-auto flex flex-wrap flex-row justify-center items-center gap-8',
    footerLink: 'text-gray-300 hover:text-purple-600 hover:cursor-pointer',
    copyWrite: 'text-gray-300 text-sm',
    linkIcon: 'h-8 w-8'
};

const footerLinks: footerLink[] = [
    {
        name: 'GitHub',
        href: `https:github.com/${username}`,
        icon: <BsGithub className={componentStyles.linkIcon} />
    },
    {
        name: 'LinkedIn',
        href: `https:linkedin.com/in/${linkedIn}`,
        icon: <BsLinkedin className={componentStyles.linkIcon} />
    },
    {
        name: 'Email',
        href: `mailto:${email}`,
        icon: <BsEnvelope className={componentStyles.linkIcon} />
    }
];



export default function Footer() { // NOSONAR
    const currentYear = new Date().getFullYear();
    const copyWriteText = `© ${currentYear} ${username}`;

    return (
        <footer className={componentStyles.footer}>
            <section className={componentStyles.linkSection}>
                {footerLinks.map(link => (
                    <a
                        key={link.name}
                        href={link.href}
                        target='_blank'
                        rel='noreferrer noopener'
                        className={componentStyles.footerLink}
                    >
                        {link.icon}
                    </a>
                ))}
            </section>

            <p className={componentStyles.copyWrite}>{copyWriteText}</p>
        </footer>
    );
}
