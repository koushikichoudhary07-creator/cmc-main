import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Banner from './Banner';

interface NavbarProps {
    user: User | null;
}

interface CustomPageProps extends PageProps {
    wishlistCount: number;
    bagCount: number;
}

export default function Navbar({ user }: NavbarProps) {
    const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
    const [isTraditionalOpen, setIsTraditionalOpen] = useState(false);
    const [isWesternOpen, setIsWesternOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Mobile accordion states (separate from desktop hover states)
    const [mobileTraditionalOpen, setMobileTraditionalOpen] = useState(false);
    const [mobileWesternOpen, setMobileWesternOpen] = useState(false);
    const [mobileAccessoriesOpen, setMobileAccessoriesOpen] = useState(false);
    
    const { wishlistCount = 0, bagCount = 0 } = usePage<CustomPageProps>().props;
    const { url } = usePage();

    const [searchQuery, setSearchQuery] = useState('');
    const [navbarHeight, setNavbarHeight] = useState(135);

    useEffect(() => {
        const updateHeight = () => {
            const navbar = document.getElementById('main-navbar');
            if (navbar) setNavbarHeight(navbar.offsetHeight);
        };
        updateHeight();
        setTimeout(updateHeight, 100);
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/search', { q: searchQuery });
            setIsMobileMenuOpen(false);
        }
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <div style={{ height: `${navbarHeight}px` }} className="w-full shrink-0" aria-hidden="true" />
            <div id="main-navbar" className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col shadow-sm">
                <header className='w-full flex justify-between items-center bg-gradient-to-r from-red-100 to-white p-4 md:p-6'>
                    
                    {/* Left: Logo + Hamburger (mobile) + Desktop Nav */}
                    <div className='flex items-center gap-4 md:gap-8'>
                        {/* Hamburger button — mobile only */}
                        <button 
                            className='md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5'
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label='Toggle menu'
                        >
                            <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
                            <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
                        </button>

                        {url !== '/' && (
                            <Link href='/' onClick={closeMobileMenu}>
                                <img src='/favicon.png' alt='Logo' className='h-8 md:h-10 w-auto' />
                            </Link>
                        )}
                        
                        {/* Desktop nav — hidden on mobile */}
                        <nav className='hidden md:flex gap-8 items-center'>
                            <div 
                                className='relative'
                                onMouseEnter={() => setIsTraditionalOpen(true)}
                                onMouseLeave={() => setIsTraditionalOpen(false)}
                            >
                                <button className='font-medium text-gray-700 hover:text-black py-2'>
                                    Traditional
                                </button>
                                
                                {isTraditionalOpen && (
                                    <div className='absolute top-full left-1/2 -translate-x-1/2 w-36 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden z-50'>
                                        <Link href='/traditional/festive' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Festive Kurta Sets</Link>
                                        <Link href='/traditional/classics' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Cotton Kurta Sets</Link>
                                        <Link href='/traditional/fusion' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Short Kurtis</Link>
                                    </div>
                                )}
                            </div>
                            <div 
                                className='relative'
                                onMouseEnter={() => setIsWesternOpen(true)}
                                onMouseLeave={() => setIsWesternOpen(false)}
                            >
                                <button className='font-medium text-gray-700 hover:text-black py-2'>
                                    Western
                                </button>
                                
                                {isWesternOpen && (
                                    <div className='absolute top-full left-1/2 -translate-x-1/2 w-36 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden z-50'>
                                        <Link href='/western/tops' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Shirts & Tshirts</Link>
                                        <Link href='/western/dresses' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Dresses & more</Link>
                                        <Link href='/western/bottoms' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Skirts & Pants</Link>
                                    </div>
                                )}
                            </div>
                            <div 
                                className='relative'
                                onMouseEnter={() => setIsAccessoriesOpen(true)}
                                onMouseLeave={() => setIsAccessoriesOpen(false)}
                            >
                                <button className='font-medium text-gray-700 hover:text-black py-2'>
                                    Accessories
                                </button>
                                
                                {isAccessoriesOpen && (
                                    <div className='absolute top-full left-1/2 -translate-x-1/2 w-36 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden z-50'>
                                        <Link href='/accessories/purses' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Purses</Link>
                                        <Link href='/accessories/footwear' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Footwear</Link>
                                        <Link href='/accessories/scarves' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Scarves</Link>
                                    </div>
                                )}
                            </div>
                            <Link href='/bonus' className='font-medium text-rose-700 hover:text-rose-950'>Gift Shop</Link>
                        </nav>
                    </div>

                    {/* Right side: Desktop search + icons */}
                    <div className='flex items-center gap-3 md:gap-6'>
                        {/* Search */}
                        <form 
                            onSubmit={handleSearch} 
                            className='flex items-center border pl-2 md:pl-4 gap-1 md:gap-2 border-rose-300 h-8 md:h-[46px] rounded-full overflow-hidden w-[150px] sm:w-[150px] md:w-[400px]'
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' className='w-3.5 h-3.5 md:w-[18px] md:h-[18px]' viewBox='0 0 30 30' fill='#6B7280'>
                                <path d='M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8'/>
                            </svg>
                            
                            <input 
                                type='text' 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder='Search...' 
                                className='w-full h-full border-none outline-none focus:ring-0 text-gray-700 bg-transparent placeholder-gray-400 text-[10px] md:text-sm pr-2 md:pr-4' 
                            />
                        </form>
                        
                        {/* Wishlist */}
                        <Link 
                            href={route('wishlist.index')} 
                            className="relative text-gray-600 hover:text-black transition flex flex-col items-center group"
                        >
                            <div className="relative">
                                <img src="/heart.png" alt="wishlist" className="h-6 w-6 md:h-8 md:w-8 object-contain cursor-pointer" />
                                
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-700 text-white font-black text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:block text-gray-600 font-medium text-xs mt-0.5 group-hover:text-black transition">
                                Wishlist
                            </span>
                        </Link>

                        {/* Bag */}
                        <Link 
                            href="/bag" 
                            className="relative text-gray-600 hover:text-black transition flex flex-col items-center group"
                        >
                            <div className="relative">
                                <img 
                                    src="/shopping.png" 
                                    alt="Shopping Bag" 
                                    className="h-6 w-6 md:h-8 md:w-8 object-contain hover:opacity-80 transition cursor-pointer" 
                                />
                                {bagCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-700 text-white font-black text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs pointer-events-none transition-all duration-300 scale-100">
                                        {bagCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:block text-gray-600 font-medium text-xs mt-0.5 group-hover:text-black transition">
                                Bag
                            </span>
                        </Link>

                        {/* Profile Section — desktop only */}
                        <div className="hidden md:block">
                            {user ? (
                                <Link href={route('dashboard')} className="flex flex-col items-center group">
                                    <img src='/user.png' alt='Profile' className='h-7 w-7 object-contain hover:opacity-80 transition cursor-pointer' />
                                    <span className='text-gray-600 group-hover:text-black font-medium text-xs mt-1 transition'>Profile</span>
                                </Link>
                            ) : (
                                <div className='flex gap-4 items-center relative'>
                                    <div 
                                        className='relative flex flex-col items-center'
                                        onMouseEnter={() => setIsProfileOpen(true)}
                                        onMouseLeave={() => setIsProfileOpen(false)}
                                    >
                                        <button className='flex flex-col items-center text-gray-600 hover:text-black transition'>
                                            <img src='/user.png' alt='Profile' className='h-7 w-7 object-contain cursor-pointer' />
                                            <span className='font-medium text-xs mt-1'>Profile</span>
                                        </button>
                                        
                                        {isProfileOpen && (
                                            <div className='absolute top-full right-0 w-24 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden z-50'>
                                                <Link href={route('login')} className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Log in</Link>
                                                <Link href={route('register')} className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Sign up</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <Banner />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className='fixed inset-0 bg-black/30 z-40 md:hidden'
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Slide-out Drawer */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Drawer Header */}
                <div className='flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white'>
                    {url !== '/' ? (
                        <Link href='/' onClick={closeMobileMenu}>
                            <img src='/favicon.png' alt='Logo' className='h-8 w-auto' />
                        </Link>
                    ) : (
                        <div></div>
                    )}
                    <button 
                        onClick={closeMobileMenu}
                        className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition'
                        aria-label='Close menu'
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                            <line x1='18' y1='6' x2='6' y2='18'/>
                            <line x1='6' y1='6' x2='18' y2='18'/>
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav Links */}
                <nav className='flex-1 overflow-y-auto'>
                    {/* Traditional — accordion */}
                    <div className='border-b border-gray-50'>
                        <button 
                            className='w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition'
                            onClick={() => setMobileTraditionalOpen(!mobileTraditionalOpen)}
                        >
                            Traditional
                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileTraditionalOpen ? 'rotate-180' : ''}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                                <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clipRule='evenodd'/>
                            </svg>
                        </button>
                        {mobileTraditionalOpen && (
                            <div className='bg-gray-50/50'>
                                <Link href='/traditional/festive' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Festive Kurta Sets</Link>
                                <Link href='/traditional/classics' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Cotton Kurta Sets</Link>
                                <Link href='/traditional/fusion' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Short Kurtis</Link>
                            </div>
                        )}
                    </div>

                    {/* Western — accordion */}
                    <div className='border-b border-gray-50'>
                        <button 
                            className='w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition'
                            onClick={() => setMobileWesternOpen(!mobileWesternOpen)}
                        >
                            Western
                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileWesternOpen ? 'rotate-180' : ''}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                                <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clipRule='evenodd'/>
                            </svg>
                        </button>
                        {mobileWesternOpen && (
                            <div className='bg-gray-50/50'>
                                <Link href='/western/tops' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Shirts & Tshirts</Link>
                                <Link href='/western/dresses' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Dresses & more</Link>
                                <Link href='/western/bottoms' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Skirts & Pants</Link>
                            </div>
                        )}
                    </div>

                    {/* Accessories — accordion */}
                    <div className='border-b border-gray-50'>
                        <button 
                            className='w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition'
                            onClick={() => setMobileAccessoriesOpen(!mobileAccessoriesOpen)}
                        >
                            Accessories
                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileAccessoriesOpen ? 'rotate-180' : ''}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                                <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clipRule='evenodd'/>
                            </svg>
                        </button>
                        {mobileAccessoriesOpen && (
                            <div className='bg-gray-50/50'>
                                <Link href='/accessories/purses' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Purses</Link>
                                <Link href='/accessories/footwear' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Footwear</Link>
                                <Link href='/accessories/scarves' onClick={closeMobileMenu} className='block pl-9 pr-5 py-2.5 text-xs text-gray-500 hover:text-black transition'>Scarves</Link>
                            </div>
                        )}
                    </div>

                    {/* Gift Shop */}
                    <Link href='/bonus' onClick={closeMobileMenu} className='block px-5 py-3.5 text-sm font-medium text-rose-700 hover:bg-gray-50 border-b border-gray-50 transition'>
                        Gift Shop
                    </Link>
                </nav>

                {/* Mobile Profile / Auth Section */}
                <div className='border-t border-gray-100 p-4'>
                    {user ? (
                        <Link 
                            href={route('dashboard')} 
                            onClick={closeMobileMenu}
                            className='flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition'
                        >
                            <img src='/user.png' alt='Profile' className='h-6 w-6 object-contain' />
                            <span className='text-sm font-medium text-gray-700'>My Profile</span>
                        </Link>
                    ) : (
                        <div className='flex flex-col gap-2'>
                            <Link 
                                href={route('login')} 
                                onClick={closeMobileMenu}
                                className='flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-700 text-white text-sm font-medium rounded-lg hover:bg-rose-800 transition'
                            >
                                Log in
                            </Link>
                            <Link 
                                href={route('register')} 
                                onClick={closeMobileMenu}
                                className='flex items-center justify-center gap-2 px-4 py-2.5 border border-rose-300 text-rose-700 text-sm font-medium rounded-lg hover:bg-rose-50 transition'
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}