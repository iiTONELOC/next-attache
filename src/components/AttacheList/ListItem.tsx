export default function ListItem(props: { id: string }) {
    const styles = {
        li: 'w-full p-3 bg-pink-500 flex flex-row flex-wrap justify-between items-center px-4 mt-2',
    };

    // TODO: fetch the details of the attache from the database
    // Use the attache id to fetch the details
    return (
        <li className={styles.li}>
            {props.id}
        </li>
    );
}
