import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-zinc-700 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus:outline-none ${
                    disabled ? 'pointer-events-none opacity-25' : ''
                } ` + className
            }
        >
            {children}
        </button>
    );
}