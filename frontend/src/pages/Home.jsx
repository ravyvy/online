import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Kao from '../components/kao';
import Av from '../components/av';
import Dress from '../components/dress';
import Pagination from '../components/Pagination';



const Home = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('ទាំងអស់');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch('https://online-eqat.onrender.com/api/getall')
      .then(res => res.json())
      .then(data => {
        let productsData = [];
        if (Array.isArray(data)) {
          productsData = data;
        } else if (data && data.status && Array.isArray(data.data)) {
          productsData = data.data;
        } else if (data && Array.isArray(data.products)) {
          productsData = data.products;
        } else if (data && typeof data === 'object') {
          const possibleArray = Object.values(data).find(val => Array.isArray(val));
          if (possibleArray) {
            productsData = possibleArray;
          } else {
            console.error('API did not return an array:', data);
          }
        }
        setProducts(productsData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setIsLoading(false);
      });
  }, []);

  const handleProductSelect = (id) => {
    navigate(`/detail/${id}`);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = filter === 'ទាំងអស់'
    ? safeProducts
    : safeProducts.filter(p => p.category === filter);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const getFilteredComponent = () => {
    if (filter === 'ខោ') return <Kao products={currentItems} onSelect={handleProductSelect} />;
    if (filter === 'អាវ') return <Av products={currentItems} onSelect={handleProductSelect} />;
    if (filter === 'រ៉ូប') return <Dress products={currentItems} onSelect={handleProductSelect} />;

    return (
      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-600 pl-4 uppercase tracking-widest text-[14px]">
              ផលិតផលទាំងអស់ (All Products)
            </h2>
            <span className="text-gray-500 text-xs font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
            </span>
          </div>
          <Kao products={currentItems} onSelect={handleProductSelect} />
        </section>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-12 font-sans overflow-hidden">
      {/* Home Navigation */}
      <div className="max-w-7xl mx-auto flex justify-center mb-10 md:mb-16 overflow-x-auto">
        <nav className="flex gap-2 glass p-1 rounded-full border border-emerald-100 shadow-sm whitespace-nowrap">
          {['ទាំងអស់', 'អាវ', 'ខោ', 'រ៉ូប'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-4 md:px-8 py-2 rounded-full text-[10px] md:text-sm font-bold uppercase transition-all ${filter === cat
                ? 'bg-emerald-600 text-white scale-105 shadow-md'
                : 'hover:bg-emerald-50 text-emerald-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-xl font-bold text-gray-500 animate-pulse">កំពុងដំណើរការ.........</p>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          {filter === 'ទាំងអស់' && currentPage === 1 && (
            <div className="max-w-7xl mx-auto mb-20 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[500px] md:aspect-[21/9] glass-card flex items-center p-8 md:p-16 group border border-emerald-50/50 shadow-2xl shadow-emerald-900/5">
              <div className="relative z-10 max-w-2xl space-y-6 md:space-y-8">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-[2px] bg-emerald-600"></span>
                  <span className="text-emerald-800 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Season 2026 Collection</span>
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-gray-900">
                  Modern Fashion <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-900 bg-clip-text text-transparent italic">Defining Your Style</span>
                </h2>
                <p className="text-gray-500 text-sm md:text-xl font-medium leading-relaxed max-w-lg">
                  Experience the perfect blend of quality and contemporary design. Discover our latest curated essentials today.
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                  <button className="bg-emerald-600 text-white px-10 py-4 md:px-12 md:py-5 rounded-full font-black hover:bg-emerald-700 transition-all active:scale-95 uppercase tracking-widest shadow-2xl shadow-emerald-600/30 text-[10px] md:text-xs">
                    Explore Collection
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-full h-full opacity-30 group-hover:opacity-40 transition-all duration-1000 scale-105 group-hover:scale-100">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
                  className="w-full h-full object-cover"
                  alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Product List */}
          <main className="max-w-7xl mx-auto">
            {getFilteredComponent()}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </main>
        </>
      )}
    </div>
  );
};

export default Home;