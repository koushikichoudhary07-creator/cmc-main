import { Head, Link } from '@inertiajs/react';

export default function Success() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Order Successful" />
            {/* payment successful */}
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-500 mb-8 text-sm">
                    Thank you for shopping with us. Your order has been placed successfully.
                </p>
                
                {/* back to shop */}
                <Link 
                    href="/" 
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-gray-800 transition text-sm"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}