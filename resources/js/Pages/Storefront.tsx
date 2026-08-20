import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Carousel } from 'flowbite-react';
import React from 'react';
import GeminiChat from '@/Components/GeminiChat';
import ProductCarousal from '@/Components/ProductCarousal';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number ;
    sales_price?: number ;
    images: string[];
}
interface CarouselProps{
    products: Product[];
} 
interface StorefrontProps extends PageProps {
    saleProducts: Product[];
    newProducts: Product[];
}

export default function Storefront({ auth, saleProducts, newProducts }: StorefrontProps) {
    return (
        <div className="flex flex-col min-h-screen bg-white-50">
            <Head title="Welcome to Cutie McPretty" />
            
            {/* Navbar */}
            <Navbar user={auth.user} />

            <main className="flex-grow w-full pt-0">
                {/* Banner Images */}
                {/* Dropped mobile height to 25vh to match image proportions, keeping desktop at 80vh */}
                <div className="w-full h-[25vh] sm:h-[50vh] md:h-[80vh] [&_.rounded-lg]:rounded-none"> 
                {/* Override Flowbite's default rounded corners */} 
                    <Carousel> 
                        <img 
                        src="/images/e-traditional.webp" 
                        alt="women in traditional" 
                        className="w-full h-full object-cover object-center md:object-top transform-gpu" 
                        fetchPriority="high"
                        decoding="async"
                        /> 
                        <img 
                        src="/images/e-western.webp" 
                        alt="women in western" 
                        className="w-full h-full object-cover object-center md:object-top" 
                        loading="lazy" 
                        decoding="async" 
                        /> 
                    </Carousel> 
                </div>

                <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-[20px] md:text-[36px] font-bold text-gray-900 mb-[16px] md:mb-[28px] text-center">Items on Sale</h2>
                    <ProductCarousal products={saleProducts} />
                    
                    <h2 className="text-[20px] md:text-[36px] font-bold text-gray-900 mt-16 mb-[16px] md:mb-[28px] text-center">New Additions</h2>
                    <ProductCarousal products={newProducts} />
                </div>
                
                {/* Gemini Chat */}
                <GeminiChat products={newProducts} />
                
            </main>
            {/* Footer */}
            <div className='pt-'>
                <Footer user={auth.user}/>
            </div>
            
        </div>
    );
}
