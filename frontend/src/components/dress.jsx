import React from 'react';

const Dress = ({ products, onSelect }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="glass-card group relative overflow-hidden rounded-[2rem] p-4 cursor-pointer flex flex-col h-full"
                    onClick={() => onSelect(product.id)}
                >
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-emerald-50/30 relative group-hover:shadow-2xl transition-all duration-500">
                        <img
                            src={product.image ? (product.image.startsWith('http') ? product.image : `https://online-eqat.onrender.com/image/${product.image}`) : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                            onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'; }}
                        />
                        {!product.image && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm">
                                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">No Image</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col flex-grow space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <p className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">{product.category}</p>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors uppercase leading-tight line-clamp-2">{product.name}</h3>
                        <p className="text-gray-500 text-[10px] md:text-sm font-medium line-clamp-2">{product.description}</p>
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-emerald-50/50">
                            <span className="text-2xl font-black text-emerald-950">
                                ${product.price}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center transition-all duration-500 group-hover:bg-emerald-700 shadow-xl shadow-emerald-900/10 group-hover:rotate-90">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Dress;
