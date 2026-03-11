import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import Swal from 'sweetalert2';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, inCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('https://online-eqat.onrender.com/api/getall')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data && typeof data === 'object') {
          const possibleArray = Object.values(data).find(val => Array.isArray(val));
          if (possibleArray) {
            setProducts(possibleArray);
          }
        }
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  const product = safeProducts.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-4xl font-black mb-4 uppercase text-emerald-900">រកមិនឃើញផលិតផល</h2>
        <button
          onClick={() => navigate('/')}
          className="text-emerald-600 hover:text-emerald-800 transition-colors underline uppercase tracking-widest font-bold"
        >
          ត្រឡប់ទៅទំព័រដើម
        </button>
      </div>
    );
  }

  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      Swal.fire({
        title: 'សូមជ្រើសរើសទំហំ',
        text: 'អ្នកត្រូវតែជ្រើសរើសទំហំមុននឹងបញ្ជូលទៅក្នុងកន្ត្រក',
        icon: 'warning',
        confirmButtonColor: '#059669',
        confirmButtonText: 'យល់ព្រម'
      });
      return;
    }

    addItem({ ...product, sizes, selectedSize: selectedSize || 'N/A' });

    Swal.fire({
      title: 'បានបញ្ជូលទៅក្នុងកន្ត្រក!',
      text: `${product.name} (ទំហំ: ${selectedSize || 'ធម្មតា'}) ត្រូវបានបញ្ជូលទៅក្នុងកន្ត្រកទំនិញរបស់អ្នក។`,
      icon: 'success',
      confirmButtonColor: '#059669',
      confirmButtonText: 'បន្តការទិញ',
      timer: 2500,
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false
    });
  };

  return (
    <div className="text-gray-900 p-6 md:p-20">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-12 text-emerald-800 hover:text-emerald-600 transition-colors uppercase font-black text-1xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          ត្រឡប់ក្រោយ
        </button>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Product Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative glass p-4 rounded-[3rem] overflow-hidden group border border-emerald-50 shadow-sm bg-gray-50/50">
              <img
                src={product.image ? (product.image.startsWith('http') ? product.image : `https://online-eqat.onrender.com/image/${product.image}`) : 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                alt={product.name}
                className="w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-xl transition-all duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'; }}
              />
              {!product.image && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm">
                  <span className="text-xl font-black uppercase tracking-widest text-gray-400">No Image Available</span>
                </div>
              )}
              <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-xl border border-emerald-100 px-8 py-3 rounded-2xl shadow-lg">
                <span className="text-emerald-900 text-xl font-black tracking-widest">${product.price}</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <span className="bg-emerald-100 text-emerald-800 font-bold uppercase   text-[10px] px-4 py-2 rounded-full border border-emerald-200">ការប្រមូល {product.category}</span>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-950 uppercase leading-none mt-4">
                {product.name}
              </h1>
            </div>

            <p className="text-xl text-emerald-900 font-light leading-relaxed border-l-4 border-emerald-600 pl-10">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="space-y-4 pt-4">
              <p className="text-sm font-black uppercase tracking-widest text-emerald-800/60">ជ្រើសរើសទំហំ</p>
              <div className="flex flex-wrap gap-3">
                {sizes.length > 0 ? sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all border ${selectedSize === size
                      ? 'bg-emerald-600 text-white border-emerald-600 scale-105 shadow-lg'
                      : 'bg-white text-emerald-800 border-emerald-100 hover:border-emerald-300'
                      }`}
                  >
                    {size}
                  </button>
                )) : (
                  <p className="text-gray-400 italic font-medium">គ្មានទំហំសម្រាប់ជ្រើសរើស</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20"
              >
                បញ្ជូលទៅក្នុងកន្ត្រក
              </button>
              <a href="/" className="flex-1 text-center glass text-emerald-800 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95 border border-emerald-100">
                បោះបង់
              </a>
            </div>

            <div className="pt-16 grid grid-cols-3 gap-12 border-t border-emerald-50">
              {[
                { label: 'ការដឹកជញ្ជូន', val: 'រហ័ស' },
                { label: 'ការធានា', val: 'ដូចរូបភាព' },
                { label: 'ការប្តូរវិញ', val: '២ ថ្ងៃ' }
              ].map((item, idx) => (
                <div key={idx} className="text-center group cursor-default">
                  <p className="text-[20px] text-emerald-800/40 uppercase mb-2 group-hover:text-emerald-600 transition-colors font-bold">{item.label}</p>
                  <p className="font-black text-sm text-emerald-900">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;