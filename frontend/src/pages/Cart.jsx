import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import Swal from 'sweetalert2';
import html2pdf from "html2pdf.js";

const Cart = () => {
    const {
        isEmpty,
        totalUniqueItems,
        items,
        updateItemQuantity,
        removeItem,
        cartTotal,
        emptyCart,
    } = useCart();
    const navigate = useNavigate();

    const escapeHTML = (text) => {
        if (!text) return '';
        return text.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    const sendOrderToTelegram = async (customerInfo) => {
        const BOT_TOKEN = '8437800535:AAGP9cGKciWPp2uNjZjSv6xz1JqX8tI3ECo';
        const CHAT_ID = '1698102973';

        const orderDetails = items.map(item =>
            `▫️ ${escapeHTML(item.name)} (${escapeHTML(item.selectedSize)}) x${item.quantity} - $${item.price * item.quantity}`
        ).join('\n');

        const message = `
<b>🚀 ការបញ្ជាទិញថ្មី (New Order)</b>
---------------------------
<b>👤 អតិថិជន:</b> ${escapeHTML(customerInfo.name)}
<b>📞 លេខទូរស័ព្ទ:</b> <a href="https://t.me/+${customerInfo.phone}">${escapeHTML(customerInfo.phone)}</a>
<b>📍 ទីតាំង:</b> <a href="${customerInfo.location}">ចុចទីនេះដើម្បីមើលផែនទី</a>

<b>📦 មុខទំនិញ:</b>
${orderDetails}

---------------------------
<b>💰 សរុបរួម: $${cartTotal}</b>
        `;

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Telegram API Error:', data);
                throw new Error(data.description || 'Telegram API Error');
            }
            return true;
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            return { error: error.message };
        }
    };

    const showInvoice = (customerInfo, orderId) => {
        const date = new Date().toLocaleString('km-KH');
        const orderItemsHtml = items.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="flex: 1; text-align: left;">
                    <p style="font-weight: 900; color: #111827; margin: 0; font-size: 14px; text-transform: uppercase;">${item.name}</p>
                    <p style="font-size: 10px; color: #059669; font-weight: 700; margin: 4px 0 0 0; text-transform: uppercase;">ទំហំ: ${item.selectedSize} | ចំនួន: ${item.quantity}</p>
                </div>
                <p style="font-weight: 900; color: #030712; margin: 0; font-size: 14px;">$${item.price * item.quantity}</p>
            </div>
        `).join('');

        Swal.fire({
            html: `
                <style>
                    .invoice-container { font-family: 'Kantumruy Pro', sans-serif; background: white; color: #111827; }
                    @media print {
                        body * { visibility: hidden; }
                        #invoice, #invoice * { visibility: visible; }
                        #invoice { position: absolute; left: 0; top: 0; width: 100%; }
                    }
                </style>
                <div id="invoice" class="invoice-container" style="text-align: left; padding: 20px; background-color: white; border-radius: 20px;">
                    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 30px; border-bottom: 2px dashed #e5e7eb;">
                        <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.05em; color: #030712; margin: 0;">MALY <span style="color: #10b981;">ONLINE</span></h1>
                        <p style="font-size: 10px; font-weight: 700; color: #000000ff; text-transform: uppercase;  margin-top: 8px;">វិក្កយបត្របញ្ជាទិញ / INVOICE</p>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; font-size: 11px;">
                        <div>
                            <p style="color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">ព័ត៌មានអតិថិជន</p>
                            <p style="font-weight: 900; color: #111827; margin: 0; font-size: 14px; text-transform: uppercase;">${customerInfo.name}</p>
                            <p style="font-weight: 700; color: #047857; margin-top: 4px; margin-bottom: 0;">${customerInfo.phone}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">ព័ត៌មានការកម្មង់</p>
                            <p style="font-weight: 900; color: #111827; margin: 0;">#${orderId}</p>
                            <p style="font-weight: 700; color: #6b7280; margin-top: 4px; margin-bottom: 0;">${date}</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <p style="color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; font-size: 11px;">មុខទំនិញ</p>
                        ${orderItemsHtml}
                    </div>

                    <div style="margin-bottom: 30px; background-color: rgba(236, 253, 245, 0.5); padding: 24px; border-radius: 16px; border: 1px solid #d1fae5;">
                        <div style="display: flex; justify-content: space-between; color: #4b5563; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; margin-bottom: 8px;">
                            <span>សរុបចន្លោះ</span>
                            <span>$${cartTotal}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; color: #4b5563; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; margin-bottom: 8px;">
                            <span>សេវាដឹកជញ្ជូន</span>
                            <span>តាមទីតាំង</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #d1fae5; padding-top: 12px; margin-top: 8px;">
                            <span style="font-size: 14px; font-weight: 900; color: #111827; text-transform: uppercase;">សរុបរួម</span>
                            <span style="font-size: 30px; font-weight: 900; color: #059669;">$${cartTotal}</span>
                        </div>
                    </div>

                    <div style="text-align: center; padding-top: 16px;">
                        <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">សូមទូទាត់ប្រាក់មកកាន់លេខ</p>
                        <p style="font-size: 20px; font-weight: 900; color: #022c22; letter-spacing: -0.05em; margin: 0;">093 581 926</p>
                        <p style="font-size: 9px; color: #9ca3af; font-style: italic; margin-top: 16px;">សូមអរគុណសម្រាប់ការគាំទ្រ MALY ONLINE!</p>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'រក្សាទុកវិក្កយបត្រ',
            cancelButtonText: 'ត្រឡប់ទៅដើមវិញ',
            confirmButtonColor: '#059669',
            cancelButtonColor: '#10b981',
            reverseButtons: true,
            width: '450px',
            allowOutsideClick: false,
            customClass: {
                popup: 'rounded-[3rem]'
            },
            preConfirm: () => {
                const element = Swal.getHtmlContainer().querySelector('#invoice');
                if (!element) return;

                const opt = {
                    margin: 0.5,
                    filename: `invoice-${orderId}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        // This ensures we capture it while it's in the DOM
                    },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                };

                // html2pdf can take a element or a "worker" chain
                return html2pdf().set(opt).from(element).toPdf().get('pdf').save();
            }
        }).then(() => {
            emptyCart();
            navigate('/');
        });
    };

    const handleCheckout = () => {
        const orderItemsHtml = items.map(item => `
            <div class="flex justify-between items-center py-2 border-b border-emerald-50 text-[12px]">
                <span class="text-gray-600 font-medium">${item.name} <span class="text-[10px] text-emerald-500">(${item.selectedSize})</span> x${item.quantity}</span>
                <span class="font-black text-emerald-950">$${item.price * item.quantity}</span>
            </div>
        `).join('');

        Swal.fire({
            title: 'បញ្ជាក់ការបញ្ជាទិញ',
            html: `
                <div class="space-y-6 text-left p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <!-- Order Preview -->
                    <div class="bg-gray-50 rounded-2xl p-4 border border-emerald-50">
                        <h4 class="text-[15px] font-black uppercase text-black mb-3 tracking-widest">ទំនិញដែលអ្នកបានទិញ</h4>
                        ${orderItemsHtml}
                        <div class="flex justify-between items-center pt-3 mt-1">
                            <span class="text-sm font-black uppercase text-gray-900">សរុបរួម</span>
                            <span class="text-lg font-black text-emerald-600">$${cartTotal}</span>
                        </div>
                    </div>

                    <!-- Customer Info -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-emerald-800/40 mb-1">ឈ្មោះអ្នកទទួល</label>
                            <input id="swal-input-name" class="w-full bg-white border border-emerald-100 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-sm" placeholder="បញ្ចូលឈ្មោះរបស់អ្នក">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-emerald-800/40 mb-1">លេខទូរស័ព្ទ</label>
                            <input id="swal-input-phone" class="w-full bg-white border border-emerald-100 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-sm" placeholder="០XX XXX XXX">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-emerald-800/40 mb-1">ទីតាំងដឹកជញ្ជូន</label>
                            <div class="flex gap-2">
                                <input id="swal-input-location" class="flex-1 bg-white border border-emerald-100 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-sm" placeholder="https://goo.gl/maps/...">
                                <button id="get-location-btn" class="bg-emerald-100 text-emerald-700 px-4 rounded-xl hover:bg-emerald-200 transition-colors flex items-center justify-center" title="យកទីតាំងបច្ចុប្បន្ន">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            didOpen: () => {
                const getLocBtn = document.getElementById('get-location-btn');
                const locInput = document.getElementById('swal-input-location');

                getLocBtn.addEventListener('click', () => {
                    getLocBtn.classList.add('animate-pulse', 'text-emerald-500');
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords;
                                locInput.value = `https://www.google.com/maps?q=${latitude},${longitude}`;
                                getLocBtn.classList.remove('animate-pulse', 'text-emerald-500');
                                getLocBtn.classList.add('bg-emerald-500', 'text-white');
                            },
                            (error) => {
                                console.error('Geolocation error:', error);
                                Swal.showValidationMessage('មិនអាចទទួលបានទីតាំងទេ។ សូមបញ្ចូលដោយដៃ។');
                                getLocBtn.classList.remove('animate-pulse', 'text-emerald-500');
                            }
                        );
                    } else {
                        Swal.showValidationMessage('កម្មវិធីរុករករបស់អ្នកមិនគាំទ្រការកំណត់ទីតាំងទេ។');
                    }
                });
            },
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'បញ្ជូនការបញ្ជាទិញ',
            cancelButtonText: 'ត្រឡប់ក្រោយ',
            confirmButtonColor: '#059669',
            preConfirm: () => {
                const name = document.getElementById('swal-input-name').value;
                const phone = document.getElementById('swal-input-phone').value;
                const location = document.getElementById('swal-input-location').value;
                if (!name || !phone || !location) {
                    Swal.showValidationMessage('សូមបំពេញព័ត៌មានឲ្យបានគ្រប់គ្រាន់');
                    return false;
                }
                return { name, phone, location };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'កំពុងបញ្ជូន...',
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false
                });

                const response = await sendOrderToTelegram(result.value);

                if (response === true) {
                    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
                    showInvoice(result.value, orderId);
                } else {
                    Swal.fire({
                        title: 'មានបញ្ហា!',
                        text: `ការបញ្ជូនបានបរាជ័យ: ${response.error || 'សូមព្យាយាមម្តងទៀត'}`,
                        icon: 'error',
                        confirmButtonColor: '#059669'
                    });
                }
            }
        });
    };

    if (isEmpty) {
        return (
            <div className="flex flex-col items-center justify-center py-32 p-6 text-center">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase text-emerald-900 tracking-tighter">កន្ត្រករបស់អ្នកទំនេរ</h2>
                <p className="text-emerald-800/60 mb-8 max-w-md mx-auto font-light">ហាក់ដូចជាអ្នកមិនទាន់បានបន្ថែមអ្វីទៅក្នុងកន្ត្រករបស់អ្នកនៅឡើយទេ។ ស្វែងរកការប្រមូលទំនិញដែលបានជ្រើសរើសរបស់យើង ដើម្បីស្វែងរករបស់ដែលអ្នកចូលចិត្ត។</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-emerald-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                    ស្វែងរករទេះទំនិញ
                </button>
            </div>
        );
    }

    return (
        <div className="text-gray-900 p-6 md:p-20">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-end mb-16">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-950">កន្ត្រកទំនិញ</h1>
                        <p className="text-emerald-700 font-bold uppercase  text-[15px] mt-3">មានទំនិញចំនួន {totalUniqueItems} មុខក្នុងកន្ត្រក</p>
                    </div>
                    <button
                        onClick={() => emptyCart()}
                        className="text-rose-600 hover:text-rose-800 transition-colors uppercase font-black  text-[10px] border-b-2 border-rose-100 pb-1"
                    >
                        លុបទំនិញទាំងអស់
                    </button>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-8">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.selectedSize}`} className="flex gap-8 group glass-card p-6 rounded-[2rem] border border-emerald-50 bg-gray-50/30">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden border border-emerald-100 flex-shrink-0 relative group-hover:shadow-2xl transition-all duration-500 bg-emerald-50/30">
                                    <img
                                        src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/image/${item.image}`) : 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'; }}
                                    />
                                    {!item.image && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm">
                                            <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400 text-center">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="text-[15px] font-black uppercase text-emerald-600 tracking-widest">{item.category}</span>
                                            <h3 className="text-1xl font-black uppercase text-gray-900 mt-1">{item.name}</h3>
                                            <p className="text-[20px] text-emerald-600 font-bold uppercase mt-1">ទំហំ: {item.selectedSize}</p>
                                        </div>
                                        <span className="text-xl font-black text-emerald-600">${item.price}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-4">
                                        <div className="flex items-center gap-4 bg-white border border-emerald-100 rounded-xl p-1 px-4 shadow-sm">
                                            <button
                                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                className="text-emerald-800 hover:text-emerald-500 font-black text-xl"
                                            >
                                                -
                                            </button>
                                            <span className="font-black text-sm w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                className="text-emerald-800 hover:text-emerald-500 font-black text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-rose-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="glass-card p-10 rounded-[2.5rem] sticky top-20 border border-emerald-100 bg-white shadow-2xl shadow-emerald-500/5">
                            <h2 className="text-2xl font-black uppercase mb-8 border-b border-emerald-50 pb-6">សេចក្តីសង្ខេប</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-black font-medium">
                                    <span className='text-2xl'>តម្លៃសរុប</span>
                                    <span>${cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-black font-medium">
                                    <span className='text-2xl'>សេវាដឹកជញ្ជូន</span>
                                    <span className="text-emerald-600 font-bold">តាមទីតាំង</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-10 pt-6 border-t border-emerald-50">
                                <span className="text-lg font-bold uppercase">សរុបរួម</span>
                                <span className="text-4xl font-black text-emerald-950">${cartTotal}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black uppercase shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 text-2xl"
                            >
                                ទូទាត់ឥឡូវនេះ
                            </button>
                            <p className="text-center mt-6 text-[15px] font-bold text-black uppercase tracking-widest">សូមទូទាត់ប្រាក់បានតាមរយះលេខ <br /> 093 581 926</p>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};

export default Cart;
