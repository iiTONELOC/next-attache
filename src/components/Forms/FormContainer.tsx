export default function FormContainer({ children }: { children: JSX.Element[] | JSX.Element | null }) {
    return (
        <div className='w-full max-w-lg bg-zinc-900 rounded-lg p-3' >
            <form className="mt-8 space-y-6" autoComplete="off">
                {children}
            </form>
        </div>
    );
}
