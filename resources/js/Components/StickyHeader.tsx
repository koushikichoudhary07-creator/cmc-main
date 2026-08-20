import { useState, useEffect, ReactNode, useRef } from 'react';

interface StickyHeaderProps {
    title: string;
    subtitle?: ReactNode;
    className?: string;
    bgColor?: string;
}

export default function StickyHeader({ title, subtitle, className = '', bgColor = 'bg-gray-50/95' }: StickyHeaderProps) {
    const [navbarHeight, setNavbarHeight] = useState(105); // Fallback height
    const [headerHeight, setHeaderHeight] = useState(70); // Fallback header height
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateHeight = () => {
            const navbar = document.getElementById('main-navbar');
            if (navbar) {
                setNavbarHeight(navbar.offsetHeight);
            }
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };
        
        // Initial measurement
        updateHeight();
        
        // Small delay to ensure images/fonts are loaded
        setTimeout(updateHeight, 100);
        setTimeout(updateHeight, 500);

        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return (
        <>
            {/* Ghost placeholder to push content down */}
            <div 
                style={{ height: `${headerHeight}px` }} 
                className={`w-full shrink-0 -mt-4 mb-[18px] md:mb-[28px] ${className}`} 
                aria-hidden="true" 
            />

            <div 
                ref={headerRef}
                className={`fixed left-0 right-0 z-40 backdrop-blur-sm py-4 ${bgColor}`}
                style={{ top: `${navbarHeight}px` }}
            >
                <h1 className="flex justify-center text-[22.5px] md:text-[36px] font-bold text-gray-900">{title}</h1>
                {subtitle && (
                    <div className="text-center mt-1">
                        {subtitle}
                    </div>
                )}
            </div>
        </>
    );
}
