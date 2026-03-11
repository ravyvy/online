import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        categories: 0,
        totalValue: 0
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const navigate = useNavigate();

    const fetchProducts = () => {
        fetch('https://online-eqat.onrender.com/api/getall')
            .then(res => res.json())
            .then(data => {
                let productList = [];
                if (Array.isArray(data)) {
                    productList = data;
                } else if (data && Array.isArray(data.products)) {
                    productList = data.products;
                } else if (data && typeof data === 'object') {
                    const possibleArray = Object.values(data).find(val => Array.isArray(val));
                    if (possibleArray) {
                        productList = possibleArray;
                    }
                }
                setProducts(productList);

                // Calculate stats
                const categories = new Set(productList.map(p => p.category)).size;
                const totalValue = productList.reduce((acc, p) => acc + (p.price || 0), 0);
                setStats({
                    total: productList.length,
                    categories: categories,
                    totalValue: totalValue.toFixed(2)
                });
            })
            .catch(err => console.error('Error fetching dashboard data:', err));
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/login');
            return;
        }
        fetchProducts();
    }, []);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // CRUD Handlers
    const handleDelete = (id) => {
        Swal.fire({
            title: 'តើអ្នកប្រាកដទេ?',
            text: "អ្នកនឹងមិនអាចត្រឡប់វាវិញបានទេ!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#059669',
            cancelButtonColor: '#e11d48',
            confirmButtonText: 'បាទ លុបវា!',
            cancelButtonText: 'បោះបង់'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://online-eqat.onrender.com/api/delete/${id}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(() => {
                        Swal.fire('លុបរួចរាល់!', 'ផលិតផលត្រូវបានលុប។', 'success');
                        fetchProducts();
                    })
                    .catch(err => Swal.fire('Error', 'Failed to delete product', 'error'));
            }
        });
    };

    const handleCreate = () => {
        Swal.fire({
            title: 'បន្ថែមផលិតផលថ្មី',
            html: `
                <input id="swal-name" class="swal2-input" placeholder="ឈ្មោះផលិតផល">
                <select id="swal-category" class="swal2-input">
                    <option value="" disabled selected>ជ្រើសរើសកាតេហ្គោរី</option>
                    <option value="ខោ">ខោ (Pants)</option>
                    <option value="អាវ">អាវ (Shirts)</option>
                    <option value="រ៉ូប">រ៉ូប (Dress)</option>
                </select>
                <input id="swal-price" type="number" class="swal2-input" placeholder="តម្លៃ">
                <input id="swal-sizes" class="swal2-input" placeholder='ទំហំ (ឧទាហរណ៍: ["S", "M", "L"])'>
                <input id="swal-image" type="file" class="swal2-file" onchange="const f=this.files[0]; if(f){ if(f.type.startsWith('image/')){ const fr=new FileReader(); fr.onload=(e)=>document.getElementById('preview-img').src=e.target.result; fr.readAsDataURL(f); document.getElementById('preview-img').classList.remove('hidden'); document.getElementById('file-name').classList.add('hidden'); } else { document.getElementById('preview-img').classList.add('hidden'); document.getElementById('file-name').textContent=f.name; document.getElementById('file-name').classList.remove('hidden'); } }">
                <div id="image-preview" class="mt-4 flex flex-col items-center">
                    <img id="preview-img" src="" class="w-32 h-32 object-cover rounded-xl border border-emerald-100 hidden">
                    <div id="file-name" class="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 hidden"></div>
                </div>
                <textarea id="swal-desc" class="swal2-textarea" placeholder="ការពិពណ៌នា"></textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#059669',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const category = document.getElementById('swal-category').value;
                const price = document.getElementById('swal-price').value;
                const sizes = document.getElementById('swal-sizes').value;
                const imageFile = document.getElementById('swal-image').files[0];
                const description = document.getElementById('swal-desc').value;
                if (!name || !category || !price || !imageFile) {
                    Swal.showValidationMessage('សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់ រួមទាំងរូបភាព');
                    return false;
                }
                const formData = new FormData();
                formData.append('name', name);
                formData.append('category', category);
                formData.append('price', price);
                formData.append('sizes', sizes || '[]');
                formData.append('image', imageFile);
                formData.append('description', description);
                return formData;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('https://online-eqat.onrender.com/api/create', {
                    method: 'POST',
                    body: result.value
                })
                    .then(res => res.json())
                    .then(() => {
                        Swal.fire('ជោគជ័យ!', 'ផលិតផលថ្មីត្រូវបានបន្ថែម។', 'success');
                        fetchProducts();
                    })
                    .catch(err => Swal.fire('Error', 'Failed to create product', 'error'));
            }
        });
    };

    const handleUpdate = (product) => {
        Swal.fire({
            title: 'កែប្រែផលិតផល',
            html: `
                <input id="swal-name" class="swal2-input" placeholder="ឈ្មោះផលិតផល" value="${product.name}">
                <select id="swal-category" class="swal2-input">
                    <option value="ខោ" ${product.category === 'ខោ' ? 'selected' : ''}>ខោ (Pants)</option>
                    <option value="អាវ" ${product.category === 'អាវ' ? 'selected' : ''}>អាវ (Shirts)</option>
                    <option value="រ៉ូប" ${product.category === 'រ៉ូប' ? 'selected' : ''}>រ៉ូប (Dress)</option>
                </select>
                <input id="swal-price" type="number" class="swal2-input" placeholder="តម្លៃ" value="${product.price}">
                <input id="swal-sizes" class="swal2-input" placeholder='ទំហំ (ឧទាហរណ៍: ["S", "M"])' value='${JSON.stringify(product.sizes || [])}'>
                <input id="swal-image" type="file" class="swal2-file" onchange="const f=this.files[0]; if(f){ if(f.type.startsWith('image/')){ const fr=new FileReader(); fr.onload=(e)=>document.getElementById('preview-img').src=e.target.result; fr.readAsDataURL(f); document.getElementById('preview-img').classList.remove('hidden'); document.getElementById('file-name').classList.add('hidden'); } else { document.getElementById('preview-img').classList.add('hidden'); document.getElementById('file-name').textContent=f.name; document.getElementById('file-name').classList.remove('hidden'); } }">
                <div id="image-preview" class="mt-4 flex flex-col items-center">
                    <img id="preview-img" src="${product.image ? (product.image.startsWith('http') ? product.image : `https://online-eqat.onrender.com/image/${product.image}`) : ''}" class="w-32 h-32 object-cover rounded-xl border border-emerald-100 ${product.image ? '' : 'hidden'}">
                    <div id="file-name" class="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 ${product.image && !(product.image.endsWith('.jpg') || product.image.endsWith('.png') || product.image.endsWith('.jpeg')) ? '' : 'hidden'}">${product.image || ''}</div>
                </div>
                <textarea id="swal-desc" class="swal2-textarea" placeholder="ការពិពណ៌នា">${product.description || ''}</textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#059669',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const category = document.getElementById('swal-category').value;
                const price = document.getElementById('swal-price').value;
                const sizes = document.getElementById('swal-sizes').value;
                const imageFile = document.getElementById('swal-image').files[0];
                const description = document.getElementById('swal-desc').value;

                const formData = new FormData();
                formData.append('id', product.id);
                formData.append('name', name);
                formData.append('category', category);
                formData.append('price', price);
                formData.append('sizes', sizes || '[]');
                if (imageFile) {
                    formData.append('image', imageFile);
                } else {
                    formData.append('image', product.image || ""); // ផ្ញើឈ្មោះរូបចាស់ទៅវិញបើមិនបានប្តូរ
                }
                formData.append('description', description);
                return formData;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://online-eqat.onrender.com/api/update/${product.id}`, {
                    method: 'PUT',
                    body: result.value
                })
                    .then(res => res.json())
                    .then(() => {
                        Swal.fire('ជោគជ័យ!', 'ផលិតផលត្រូវបានកែប្រែ។', 'success');
                        fetchProducts();
                    })
                    .catch(err => Swal.fire('Error', 'Failed to update product', 'error'));
            }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-gray-950 uppercase tracking-tighter">Dashboard</h1>
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                                Admin: {localStorage.getItem('adminUser') || 'Unknown'}
                            </span>
                        </div>
                        <p className="text-emerald-700 font-bold uppercase text-xs tracking-widest">Store Management Overview</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleCreate}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                        >
                            + Add Product
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-rose-50 border border-rose-100 text-rose-800 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-100 transition-all shadow-sm"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white border border-emerald-100 text-emerald-800 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                        >
                            Back to Store
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Total Products', value: stats.total, icon: '📦' },
                        { label: 'Categories', value: stats.categories, icon: '🏷️' },
                        { label: 'Inventory Value', value: `$${stats.totalValue}`, icon: '💰' }
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-card bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:shadow-emerald-500/5 transition-all">
                            <div className="text-4xl mb-4">{stat.icon}</div>
                            <p className="text-emerald-800/40 font-black uppercase text-[10px] tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-950">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Products Table/List */}
                <div className="glass-card bg-white rounded-[3rem] border border-emerald-50 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-emerald-50 flex flex-col md:flex-row justify-between items-center bg-gray-50/30 gap-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Product Inventory</h2>
                        <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                            {products.length} Items Listed
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-emerald-800/40 font-black uppercase text-[10px] tracking-widest border-b border-emerald-50">
                                    <th className="px-8 py-6">Product</th>
                                    <th className="px-8 py-6">Category</th>
                                    <th className="px-8 py-6">Price</th>
                                    <th className="px-8 py-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {currentItems.map((product) => (
                                    <tr key={product.id} className="hover:bg-emerald-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-100 flex-shrink-0 relative">
                                                    <img
                                                        src={product.image ? (product.image.startsWith('http') ? product.image : `https://online-eqat.onrender.com/image/${product.image}`) : 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-all"
                                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'; }}
                                                    />
                                                    {!product.image && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm">
                                                            <span className="text-[6px] font-black uppercase text-gray-400">NA</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors uppercase text-sm">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-mono font-black text-gray-900">${product.price}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(product)}
                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="p-8 border-t border-emerald-50 flex justify-center items-center gap-2 bg-gray-50/10">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-emerald-100 text-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-50 transition-all font-black"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${currentPage === i + 1
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-110'
                                        : 'text-emerald-800 hover:bg-emerald-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-emerald-100 text-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-50 transition-all font-black"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
