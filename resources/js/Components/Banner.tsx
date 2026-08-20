import React from 'react';

export default function Banner() {
    return (
        <div className="w-full bg-rose-700 text-white overflow-hidden py-2.5 flex border-b border-rose-800">
            <div className="whitespace-nowrap animate-marquee flex space-x-8 shrink-0 px-4">
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
            </div>
            <div className="whitespace-nowrap animate-marquee flex space-x-8 shrink-0 px-4" aria-hidden="true">
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">SALE 50% OFF SELECT PRODUCTS</span>
            </div>
        </div>
    );
}
