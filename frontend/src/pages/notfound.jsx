import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            {/* Animated 404 Background */}
            <div className="relative mb-12">
                <h1 className="text-[12rem] md:text-[16rem] font-black text-emerald-50 leading-none select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-3xl md:text-5xl font-black text-emerald-900 uppercase tracking-tighter">
                        រកមិនឃើញទំព័រ
                    </p>
                </div>
            </div>

            <div className="space-y-6 max-w-lg mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-gray-950 uppercase tracking-tight">
                    Oops! Page Not Found
                </h2>
                <p className="text-emerald-800/60 font-medium leading-relaxed">
                    សុំទោស! ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានឡើយ ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។
                    សូមត្រឡប់ទៅកាន់ទំព័រដើមវិញ ដើម្បីបន្តការទិញទំនិញរបស់អ្នក។
                </p>

                <div className="pt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 text-lg"
                    >
                        ត្រឡប់ទៅទំព័រដើម
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="fixed top-1/2 left-10 -translate-y-1/2 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="fixed bottom-1/4 right-10 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>
        </div>
    );
};

export default NotFound;
