import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Carousel } from 'flowbite-react';
import { PageProps } from '@/types';
import ProductCarousel, { Product } from '@/Components/ProductCarousal'; 
import React from 'react';
import StickyHeader from '@/Components/StickyHeader';
import GeminiChat from '@/Components/GeminiChat';


interface BottomsPageProps extends PageProps {
    products: Product[];
}
export default function BottomsPage({ auth,products }: BottomsPageProps) {
    return (
        <div className="flex flex-col min-h-screen bg-white-50">
                    <Head title="Welcome to Cutie McPretty" />
                    
                    {/* Navbar */}
                    <Navbar user={auth.user} />
        
                    <main className="flex-grow max-w mx-auto p-4 pt-[18px] md:p-8 md:pt-[28px]">
                        <StickyHeader title="Skirts and Pants" bgColor="bg-white/95" />
                        
                        {/* Products */}
                        <ProductCarousel products={products} />
                        <GeminiChat products={products} />
                    </main>
                    {/* Footer */}
                    <Footer user={auth.user}/>
                </div>
    );
}