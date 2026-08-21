import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PrimaryButton from '@/Components/PrimaryButton';
import ProductCarousal from '@/Components/ProductCarousal';
import { PageProps } from '@/types';
import { Carousel } from 'flowbite-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sales_price?: number;
    images: string[];
    category: string;
    subcategory: string;
}

interface ProductShowProps extends PageProps {
    product: Product;
    relatedProducts: Product[];
}

export default function Show({ auth, product, relatedProducts }: ProductShowProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [addingToBag, setAddingToBag] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState(false);

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const handleAddToBag = () => {
        if (!selectedSize && product.category !== 'accessories') {
            alert('Please select a size first.');
            return;
        }

        setAddingToBag(true);
        router.post(route('bag.add', product.id), {
            size: selectedSize
        }, {
            preserveScroll: true,
            onFinish: () => setAddingToBag(false),
        });
    };

    const handleAddToWishlist = () => {
        setAddingToWishlist(true);
        router.post(route('wishlist.add', product.id), {}, {
            preserveScroll: true,
            onFinish: () => setAddingToWishlist(false),
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white pb-6">
            <Head title={`${product.name} - Cutie McPretty`} />
            <Navbar user={auth.user} />

            <main className="flex-grow w-full pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    
                    {/* Left: Image Gallery */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                            {product.images && product.images.length > 0 ? (
                                <Carousel slide={false} indicators={product.images.length > 1}>
                                    {product.images.map((imgUrl, idx) => (
                                        <img 
                                            key={idx}
                                            src={imgUrl} 
                                            alt={`${product.name} view ${idx + 1}`} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image Available
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.map((imgUrl, idx) => (
                                    <div key={idx} className="w-20 h-24 flex-shrink-0 bg-gray-100 border border-gray-200 rounded overflow-hidden">
                                        <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        <nav className="text-sm text-gray-500 mb-4 flex gap-2 capitalize">
                            <Link href="/" className="hover:text-black">Home</Link>
                            <span>/</span>
                            <Link href={`/${(product.category || '').toLowerCase()}/${(product.subcategory || '').toLowerCase()}`} className="hover:text-black">
                                {product.subcategory || 'General'}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{product.name}</span>
                        </nav>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        
                        <div className="flex items-center gap-3 mb-6">
                            {product.sales_price ? (
                                <>
                                    <span className="text-2xl font-bold text-red-600">₹{product.sales_price}</span>
                                    <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                            )}
                        </div>

                        <div className="prose prose-sm text-gray-600 mb-8">
                            <p>{product.description || "A lovely addition to your wardrobe."}</p>
                        </div>

                        {/* Size Selection (hide for accessories mostly, or keep it generic) */}
                        {product.category !== 'accessories' && (
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Select Size</h3>
                                    <button className="text-sm text-gray-500 underline hover:text-black">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 text-sm font-medium rounded-md border transition-colors ${
                                                selectedSize === size 
                                                ? 'border-black bg-black text-white' 
                                                : 'border-gray-300 bg-white text-gray-900 hover:border-black'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={handleAddToBag}
                                disabled={addingToBag}
                                className="flex-1 bg-black text-white px-8 py-4 rounded-md font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {addingToBag ? 'Adding...' : 'Add to Bag'}
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                disabled={addingToWishlist}
                                className="flex-none px-6 py-4 rounded-md border-2 border-gray-200 font-bold hover:border-black disabled:opacity-50 transition-colors flex justify-center items-center group"
                                aria-label="Add to wishlist"
                            >
                                {addingToWishlist ? 'Saving...' : (
                                    <svg className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Accordion style details (Static for now) */}
                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Product Details</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>Premium quality material</li>
                                    <li>Regular fit</li>
                                    <li>Machine washable</li>
                                    <li>Imported</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-20 border-t border-gray-200 pt-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">You Might Also Like</h2>
                        <ProductCarousal products={relatedProducts} />
                    </div>
                )}
            </main>
            
            <Footer user={auth.user} />
        </div>
    );
}
