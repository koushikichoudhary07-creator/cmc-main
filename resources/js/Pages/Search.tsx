import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import ProductCarousal from '@/Components/ProductCarousal';
import Navbar from '@/Components/Navbar';
import StickyHeader from '@/Components/StickyHeader';

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

interface SearchProps extends PageProps {
    products: Product[];
    searchQuery: string;
}

export default function Search({ auth,products, searchQuery }: SearchProps) {
    return (
        <div className="min-h-screen bg-white pb-6">
            <Head title={`Search Results for "${searchQuery}"`} />
            <Navbar user={auth.user} />

            {/* page contents */}
            <main className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 pt-[18px] md:pt-[28px]">
                <StickyHeader 
                    title="Search Results" 
                    bgColor="bg-white/95"
                    subtitle={
                        <p className="text-sm md:text-base text-gray-500">
                            {products.length} {products.length === 1 ? 'result' : 'results'} found for <span className="text-gray-900 font-bold">"{searchQuery}"</span>
                        </p>
                    }
                />

                {products.length > 0 ? (
                    //display products
                    <div className="flex flex-wrap justify-center gap-6 m-4 pb-4">
                        <ProductCarousal products={products} />
                    </div>
                    
                ) : (
                    //invalid search
                    <div className="text-center py-20">
                        <svg className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <h2 className="text-base md:text-lg font-medium text-gray-900">No products found</h2>
                        <p className="text-sm md:text-base text-gray-500 mt-2">Try checking for typos or searching for a different term.</p>
                        <Link href="/" className="mt-6 inline-block text-xs md:text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1">
                            Clear Search
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}