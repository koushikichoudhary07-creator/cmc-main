import { Head, useForm, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import axios from 'axios';

interface BagItem {
    id: number;
    name: string;
    price: number;
    sales_price?: number;
    pivot: { quantity: number; };
}

interface Address {
    id: number;
    full_name: string;
    address: string;
    city: string;
    postal_code: string;
    phone: string;
}

export default function CheckoutIndex({ auth, bagItems, addresses = [] }: PageProps & { bagItems: BagItem[], addresses?: Address[] }) {
    const { razorpayKey } = usePage<PageProps & { razorpayKey: string }>().props;

    // Calculate order totals
    const subtotal = bagItems.reduce((total, item) => total + ((item.sales_price || item.price) * item.pivot.quantity), 0);
    const shipping = 50;
    const grandTotal = subtotal + shipping;

    // Manage checkout form
    const { data, setData, post, processing } = useForm({
        full_name: '',
        address: '',
        city: '',
        postal_code: '',
        phone: '',
    });

    // Fill saved address
    const selectSavedAddress = (savedAddress: Address) => {
        setData({
            full_name: savedAddress.full_name,
            address: savedAddress.address,
            city: savedAddress.city,
            postal_code: savedAddress.postal_code,
            phone: savedAddress.phone,
        });
    };

    // Load Razorpay SDK
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Start checkout
    const submitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Load Razorpay
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert("Failed to load Razorpay SDK. Are you online?");
            return;
        }

        try {
            // 2. Fetch the Order ID from your Laravel Backend
            const response = await axios.post(route('checkout.create'));
            const { order_id, amount } = response.data;

            // 3. Configure the Razorpay Popup
            const options = {
                key: razorpayKey,
                amount: amount,
                currency: "INR",
                name: "Cutie McPretty",
                description: "Order Payment",
                order_id: order_id,
                handler: function (response: any) {
                    // 4. On success, send data to Laravel to verify and redirect
                    router.post(route('checkout.verify'), {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,

                        full_name: data.full_name,
                        address: data.address,
                        city: data.city,
                        postal_code: data.postal_code,
                        phone: data.phone,
                    });
                },
                prefill: {
                    name: data.full_name,
                    contact: data.phone,
                },
                theme: {
                    color: "#000000",
                },
            };

            // 5. Open the modal!
            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Error creating order:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8 md:pb-12">
            <Head title="Checkout" />
            
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[18px] md:pt-[28px]">
                {/* Header */}
                <h1 className="text-[22.5px] md:text-[36px] font-bold text-gray-900 mb-[18px] md:mb-[28px]">Secure Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Shipping details */}
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-rose-300">
                        
                        {/* Saved addresses */}
                        {addresses.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Addresses</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {addresses.map((addr: Address) => (
                                        <button
                                            key={addr.id}
                                            type="button"
                                            onClick={() => selectSavedAddress(addr)}
                                            className={`text-left p-4 rounded-lg border-2 transition-all ${
                                                data.phone === addr.phone 
                                                ? 'border-black bg-gray-50' 
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <p className="font-bold text-gray-900">{addr.full_name}</p>
                                            <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                            <p className="text-sm text-gray-600">{addr.city}, {addr.postal_code}</p>
                                            <p className="text-sm text-gray-900 mt-2 font-medium">Phone: {addr.phone}</p>
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Shipping form */}
                                <div className="relative mt-8 mb-6">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-3 text-sm text-gray-500">OR ENTER A NEW ADDRESS</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Details <span className="text-base font-light">(Will be saved after first order)</span></h2>
                        
                        <form id="checkout-form" onSubmit={submitOrder} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="full_name" value="Full Name" />
                                <TextInput id="full_name" className="mt-1 block w-full" value={data.full_name} onChange={e => setData('full_name', e.target.value)} required />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="address" value="Street Address" />
                                <TextInput id="address" className="mt-1 block w-full" value={data.address} onChange={e => setData('address', e.target.value)} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="city" value="City" />
                                    <TextInput id="city" className="mt-1 block w-full" value={data.city} onChange={e => setData('city', e.target.value)} required />
                                </div>
                                <div>
                                    <InputLabel htmlFor="postal_code" value="Postal Code" />
                                    <TextInput id="postal_code" className="mt-1 block w-full" value={data.postal_code} onChange={e => setData('postal_code', e.target.value)} required />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Phone Number" />
                                <TextInput id="phone" type="tel" className="mt-1 block w-full" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
                            </div>
                        </form>
                    </div>

                    {/* Order summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-rose-300 sticky top-[180px] md:top-[220px]">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-3 border-b border-gray-100 pb-4 mb-4 max-h-60 overflow-y-auto">
                                {bagItems.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600 truncate pr-4">{item.pivot.quantity}x {item.name}</span>
                                        <span className="font-medium text-gray-900">₹{(item.sales_price || item.price) * item.pivot.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 border-b border-gray-100 pb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>₹{shipping}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-4 text-lg font-bold text-gray-900">
                                <span>Total To Pay</span>
                                <span>₹{grandTotal}</span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 border-b border-gray-100 pb-4">
                                <p>Please copy this demo card number for demo payment -- 4100 2800 0000 1007</p>
                                <p>Put a future date, and random numbers for CVV</p>
                            </div>
                            <PrimaryButton 
                                type="submit"
                                form="checkout-form"
                                disabled={processing} 
                                className="w-full justify-center py-3 mt-4"
                            >
                                Continue to Payment
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}