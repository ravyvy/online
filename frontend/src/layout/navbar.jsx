import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'react-use-cart';

const Navbar = () => {
    const navigate = useNavigate();
    const { totalUniqueItems } = useCart();

    return (
        <nav className="w-full bg-white/90 backdrop-blur-xl border-b border-emerald-50 sticky top-0 z-50">
            <div className="max-w-[1920px] mx-auto flex justify-between items-center py-6 px-4 md:px-12">
                <div className="cursor-pointer group flex flex-col" onClick={() => navigate('/')}>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-emerald-800 to-emerald-950 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    MALY ONLINE
                    </h1>
                    <span className="text-emerald-700 text-[8px] tracking-[0.4em] font-black uppercase opacity-60">Curated Essentials</span>
                </div>

                <div className="flex items-center gap-10">
                    <div className="hidden md:flex gap-12">
                        <button
                            onClick={() => navigate('/')}
                            className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-900/40 hover:text-emerald-600 transition-all relative group"
                        >
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
                        </button>
                        
                    </div>

                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => navigate('/cart')}
                            className="relative p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl group hover:bg-emerald-600 hover:text-white transition-all duration-500 cursor-pointer shadow-sm hover:shadow-emerald-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                            {totalUniqueItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white group-hover:bg-white group-hover:text-emerald-600 animate-in zoom-in duration-300">
                                    {totalUniqueItems}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
