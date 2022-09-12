
const componentStyles = {
    link: ' w-full md:w-auto flex flex-row justify-center items-center bg-black text-gray-100 p-3 rounded-md hover:bg-purple-700 hover:rounded:lg hover:cursor-pointer',
}
export default function NavLink({ linkName }: { linkName: string }): JSX.Element {
    return (
        <p className={componentStyles.link}>{linkName}</p>
    );
}
