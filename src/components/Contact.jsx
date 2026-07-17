const Contact = () => {
    return (
        <section id="kontak" className="py-24 relative overflow-hidden z-20">
            {/* Aksen Grid Kotak (Posisi Tengah Menyeber) */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)] opacity-50 z-0 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                
                <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-3xl flex items-center justify-center text-emerald-500 text-4xl mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-bounce">
                    <i className="ph-fill ph-whatsapp-logo"></i>
                </div>

                <h2 className="text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-6">
                    Terbuka Untuk Peluang <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                        Berkarya Bersama
                    </span>
                </h2>
                <p className="text-slate-800 text-base md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                    Terima kasih telah melihat portofolio saya. Jika Anda memiliki peluang karier atau ingin berdiskusi lebih lanjut, saya siap dihubungi melalui WhatsApp.
                </p>

                <a href="https://wa.me/6285923451479" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="inline-flex items-center justify-center gap-3.5 px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-[0_8px_25px_rgba(16,185,129,0.3)] cursor-pointer">
                    <i className="ph-fill ph-whatsapp-logo text-2xl"></i>
                    <span>Chat via WhatsApp Sekarang</span>
                    <i className="ph-bold ph-arrow-up-right text-xl"></i>
                </a>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-800 font-medium">
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=absyalsatria20@gmail.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-indigo-600 underline underline-offset-4 transition-colors cursor-pointer">
                            Atau kirim lewat Email: absyalsatria20@gmail.com
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contact;