import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-red-50 px-4 pt-12 sm:justify-center sm:pt-0 dark:bg-gray-900">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full max-w-md overflow-hidden bg-white px-6 py-8 shadow-xl rounded-xl sm:rounded-2xl border border-gray-100 dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
