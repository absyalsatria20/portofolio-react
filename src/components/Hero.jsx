import { useState } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const [isActive, setIsActive] = useState(false);

    const handleCardClick = (e) => {
        if (e.target.closest('a')) return;
        e.preventDefault(); 
        setIsActive(!isActive);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        // Padding Kiri-Kanan diselaraskan di sini: px-6 md:px-12 lg:px-16
        <section id="beranda" className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-6 md:px-12 lg:px-16 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 z-0"></div>

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
                
                {/* ================= TEKS UTAMA (Kiri / Atas di HP) ================= */}
                {/* Diubah menjadi order-1 agar muncul paling atas saat di layar HP */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-7 order-1 flex flex-col justify-center text-center lg:text-left"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.02)] w-fit mx-auto lg:mx-0 mb-6 font-bold text-xs text-indigo-600 uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                        MY WEBSITE PORTFOLIO
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-800 tracking-tight leading-[1.05] mb-6">
                        Halo, Saya{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                            Absyal.
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-slate-700 text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                        Seorang <span className="text-slate-800 font-bold">Graphic Designer dan Motion Designer.</span><br/> yang berfokus pada visual kreatif, efektif, dan komunikatif. Portofolio ini menampilkan karya terbaik sebagai representasi kemampuan dan pengalaman saya.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 w-full px-2 sm:px-0">
                        <a href="#karya" className="group flex-1 sm:flex-none justify-center px-4 py-3 md:px-8 md:py-4 bg-slate-900 text-white text-xs md:text-sm font-bold rounded-full transition-all duration-300 hover:bg-indigo-600 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:-translate-y-1 flex items-center gap-2 text-center whitespace-nowrap">
                            Lihat Project
                            <i className="ph-bold ph-arrow-down text-sm md:text-base group-hover:translate-y-1 transition-transform"></i>
                        </a>
                        <a href="#kontak" className="flex-1 sm:flex-none justify-center px-4 py-3 md:px-8 md:py-4 bg-white/60 backdrop-blur-md border border-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-full transition-all duration-300 hover:bg-white hover:shadow-md hover:border-slate-300 hover:-translate-y-1 text-center whitespace-nowrap">
                            Hubungi Saya
                        </a>
                    </motion.div>
                </motion.div>

                {/* ================= KARTU FOTO CV (Kanan / Bawah di HP) ================= */}
                {/* Diubah menjadi order-2 agar posisinya turun ke bawah teks saat di layar HP */}
                <div className="lg:col-span-5 order-2 flex justify-center lg:justify-end w-full">
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.8, type: "spring", delay: 0.3 }}
                        className="w-full max-w-[380px] lg:max-w-[400px]"
                    >
                        <div onClick={handleCardClick} className={`relative flex justify-center group cursor-pointer select-none ${isActive ? 'is-active' : ''}`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-30 z-0 pointer-events-none transform-gpu md:group-hover:opacity-60 group-[.is-active]:opacity-60 transition-opacity duration-700"></div>
                            
                            <div className="relative z-10 w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#050505]">
                                
                                <div className="absolute inset-0 bg-black">
                                    <img src="https://res.cloudinary.com/vkyl7elo/image/upload/f_auto,q_auto/v1783665391/2_4x6_hitmhv.jpg" alt="Foto Absyal" className="w-full h-full object-cover object-top opacity-90 md:group-hover:opacity-40 group-[.is-active]:opacity-40 md:group-hover:scale-110 group-[.is-active]:scale-110 transition-all duration-700 ease-in-out pointer-events-none" />
                                </div>

                                <div className="absolute top-5 right-5 bg-[#050505]/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-white flex items-center gap-3 transform -translate-y-4 opacity-0 md:group-hover:translate-y-0 group-[.is-active]:translate-y-0 md:group-hover:opacity-100 group-[.is-active]:opacity-100 transition-all duration-500 delay-100 z-20 shadow-xl pointer-events-none">
                                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400 text-2xl md:text-3xl leading-none">5+</span>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-400 leading-tight">Tahun<br/>Pengalaman</span>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-70 md:group-hover:opacity-100 group-[.is-active]:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                                
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-28 md:group-hover:translate-y-0 group-[.is-active]:translate-y-0 transition-transform duration-500 ease-out">
                                    <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 rounded-full transform scale-x-0 md:group-hover:scale-x-100 group-[.is-active]:scale-x-100 transition-transform duration-500 delay-100 origin-left"></div>
                                    
                                    <div className="relative mb-2">
                                        <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-1.5 opacity-100 md:group-hover:opacity-0 group-[.is-active]:opacity-0 transition-all duration-300 absolute top-6 left-0 pointer-events-none">
                                            <i className="ph-bold ph-cursor-click text-sm animate-bounce"></i>
                                            <span>Click for more!</span>
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-white tracking-tight opacity-0 md:group-hover:opacity-100 group-[.is-active]:opacity-100 transition-all duration-500 transform translate-y-4 md:group-hover:translate-y-0 group-[.is-active]:translate-y-0 drop-shadow-md">
                                            Absyal Satria
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-300 text-sm leading-relaxed mb-6 opacity-0 md:group-hover:opacity-100 group-[.is-active]:opacity-100 transition-opacity duration-500 delay-200 pointer-events-none">
                                        <span className="font-semibold">Explore pengalaman saya lebih lanjut.</span><br/>
                                        <span className="italic">Klik di bawah untuk melihat resume lengkap dan perjalanan karier saya.</span>
                                    </p>
                                    
                                    <a href="https://res.cloudinary.com/vkyl7elo/image/upload/v1783665392/Absyal_Ayang_satria-resume_xgcl2c.pdf " target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white hover:text-[#050505] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 opacity-0 md:group-hover:opacity-100 group-[.is-active]:opacity-100 delay-300">
                                        Lihat CV / Resume
                                        <i className="ph-bold ph-file-text text-lg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default Hero;