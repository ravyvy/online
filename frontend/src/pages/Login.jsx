import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://online-eqat.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'បាទ! ជោគជ័យ',
                    text: 'អ្នកបានចូលប្រើប្រាស់ដោយជោគជ័យ។',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('adminUser', credentials.username);
                    navigate('/dashboard');
                });
            } else {
                throw new Error(data.message || 'ការចូលប្រើប្រាស់មិនត្រឹមត្រូវ');
            }
        } catch (error) {
            Swal.fire({
                title: 'កំហុស!',
                text: error.message,
                icon: 'error',
                confirmButtonColor: '#059669',
                confirmButtonText: 'យល់ព្រម'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50/50">
            <div className="w-full max-w-md">
                <div className="glass-card bg-white p-8 md:p-12 rounded-[3rem] border border-emerald-50 shadow-2xl shadow-emerald-500/5 transition-all">
                    <div className="text-center space-y-4 mb-10">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-950 uppercase tracking-tighter">Admin Login</h1>
                        <p className="text-emerald-700 font-bold uppercase text-[10px] tracking-widest">Store Management Access</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-emerald-800/40 ml-4 tracking-widest">Username</label>
                            <input
                                type="text"
                                name="username"
                                required
                                value={credentials.username}
                                onChange={handleChange}
                                placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
                                className="w-full bg-gray-50 border border-emerald-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-emerald-800/40 ml-4 tracking-widest">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="បញ្ចូលលេខសម្ងាត់"
                                className="w-full bg-gray-50 border border-emerald-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 text-xs ${isLoading
                                ? 'bg-emerald-100 text-emerald-300 cursor-not-allowed'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                                }`}
                        >
                            {isLoading ? 'កំពុងបញ្ជូន...' : 'ចូលប្រើប្រាស់'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-emerald-800/40 hover:text-emerald-600 transition-colors uppercase font-black text-[9px] tracking-widest"
                        >
                            ត្រឡប់ទៅហាងវិញ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
