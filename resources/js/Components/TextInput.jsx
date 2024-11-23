import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md py-2 border-none bg-transparent shadow-sm hover:shadow-lg focus:shadow-md shadow-blue-800 hover:shadow-blue-800 focus:shadow-blue-800 transition ease-in-out duration-150 focus:ring-0 focus:border-0' +
                className
            }
            ref={localRef}
        />
    );
});
