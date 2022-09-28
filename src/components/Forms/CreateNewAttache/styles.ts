export const formStyles = {
    container: 'w-full bg-zinc-900 rounded-b-lg p-3',
    form: 'w-full space-y-6',
    header: 'w-full flex flex-wrap flex-row justify-between text-center items-center',
    headerText: 'text-base underline decoration-zinc-600 underline-offset-4 text-center',
    footer: {
        container: 'w-full flex flex-wrap flex-row items-center p-3',
        currentStepLessThan1: 'justify-center',
        currentStepGreaterThan1: 'justify-between',
        textSectionContainer: 'w-full flex flex-wrap flex-row justify-center items-center gap-3',
        textSectionP: 'text-justify text-base m-b-2'
    },
    button: 'w-auto p-3 rounded-lg font-bold text-center hover:scale-105 transition-all duration-300',
    addButton: {
        default: 'bg-zinc-800 hover:bg-zinc-700 cursor-not-allowed',
        validated: 'bg-purple-900 hover:bg-green-800 cursor-pointer'
    },
    backButton: 'bg-zinc-800 hover:bg-red-700',
    submitButton: 'bg-green-800 hover:bg-green-700'
};