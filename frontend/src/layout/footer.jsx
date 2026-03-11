import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-emerald-950 text-white mt-20 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-black tracking-tighter">
                            MALY <span className="text-emerald-400">ONLINE</span>
                        </h1>
                        <p className="text-emerald-100/60 text-sm leading-relaxed max-w-xs">
                            យើងមាន អាវ, ខោ, ឆុត, និងសម្លៀកបំពាក់ទាន់សម័យ ច្រើនជ្រើសរើស សម្រាប់អ្នកដែលចង់ បង្ហាញស្ទីលផ្ទាល់ខ្លួន និង ទាន់ពេលវេលា។ គ្រប់ប្រភេទសម្លៀកបំពាក់របស់យើង ត្រូវបានជ្រើសរើសយ៉ាងប្រុងប្រយ័ត្ន ដើម្បីផ្ដល់ គុណភាពខ្ពស់ និង សិរីល្អលើកម្លៃ។
                        </p>
                        <div className="flex gap-4">
                            {[
                                { id: 'fb', url: 'https://www.facebook.com/rgx0o16q9e' },
                                { id: 'Tk', url: '#' },
                                { id: 'TG', url: 'https://t.me/c/2613477324/1/560' }
                            ].map((social) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-emerald-800 flex items-center justify-center hover:bg-emerald-800 hover:text-emerald-400 transition-all cursor-pointer font-black text-[10px] uppercase"
                                >
                                    {social.id}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-emerald-400 text-xs">ស្វែងយល់បន្ថែម</h4>
                        <ul className="space-y-4 text-emerald-100/60 text-sm">
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">ទំព័រដើម</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">អំពីយើង</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">ផលិតផលទាំងអស់</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">បច្ចេកវិទ្យា</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">
                                <a href="/login">Dashboard</a>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-emerald-400 text-xs">ជំនួយ</h4>
                        <ul className="space-y-4 text-emerald-100/60 text-sm">
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">ការដឹកជញ្ជូន</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">សំណួរ និងចម្លើយ</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">សេវាកម្មអតិថិជន</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer capitalize">គោលការណ៍ឯកជនភាព</li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-emerald-400 text-xs">ព្រឹត្តិបត្រព័ត៌មាន</h4>
                        <p className="text-emerald-100/60 text-sm leading-relaxed">
                            ចុះឈ្មោះដើម្បីទទួលបានព័ត៌មានថ្មីៗ និងការបញ្ចុះតម្លៃពិសេស។
                        </p>
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="អាសយដ្ឋានអ៊ីមែល"
                                className="bg-emerald-900/50 border border-emerald-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                            />
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all active:scale-95">
                                ចុះឈ្មោះឥឡូវនេះ
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-emerald-900  justify-between items-center ">
                    <p className="text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                        &copy; ២០២៦  &bull; រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ maly online
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
