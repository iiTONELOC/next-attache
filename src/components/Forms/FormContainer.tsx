export default function FormContainer(
    props: {
        children: JSX.Element[] | JSX.Element | null,
        _ref?: React.RefObject<HTMLFormElement>
    }) {

    const { children, _ref } = props;
    return (
        <div className='w-full max-w-lg bg-zinc-900 rounded-lg p-3' >

            {_ref ? (
                <form ref={_ref} className="mt-8 space-y-6" autoComplete="off">
                    {children}
                </form>
            ) : (
                <form className="mt-8 space-y-6" autoComplete="off">
                    {children}
                </form>
            )
            }
        </div>
    );
}
