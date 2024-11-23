export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex justify-center rounded-md border border-transparent bg-blue-900 px-4 py-2 text-xs font-bold uppercase tracking-wider transition duration-150 ease-in-out hover:bg-blue-800 text-white ${disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
