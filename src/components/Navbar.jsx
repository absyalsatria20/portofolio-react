import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
    { id: 'beranda', label: 'Home' },
    { id: 'karya', label: 'Project' },
    { id: 'tentang', label: 'Skill' },
    { id: 'kontak', label: 'Contact' }
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('beranda');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            const scrollPosition = window.scrollY + 200; 

            for (const item of navItems) {
                const element = document.getElementById(item.id);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(item.id);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); 
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed w-full top-0 left-0 flex justify-center p-2 md:p-4 z-50 pointer-events-none"
        >
            <nav className={`flex items-center justify-between px-3 md:px-6 py-2 md:py-3 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 pointer-events-auto transition-all duration-500 w-full ${
                isScrolled 
                    ? 'max-w-4xl shadow-[0_10px_40px_rgba(99,102,241,0.1)]' 
                    : 'max-w-5xl shadow-sm'
            }`}>
                
                <a href="#beranda" className="text-sm sm:text-lg md:text-xl font-black tracking-tighter text-slate-800 hover:scale-105 transition-transform ml-1 md:ml-2 shrink-0">
                    PORTOFOLIO<span className="text-indigo-600">.</span>
                </a>
                
                {/* 
                    PERBAIKAN ADA DI BARIS INI:
                    Ditambahkan py-4 -my-4 px-2 -mx-2 (Ruang napas untuk bayangan)
                    Ditambahkan md:overflow-visible (Mematikan batas potong di layar laptop)
                */}
                <div 
                    className="flex items-center gap-1 md:gap-2 relative overflow-x-auto md:overflow-visible py-4 -my-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden" 
                    style={{ scrollbarWidth: 'none' }}
                >
                    {navItems.map((item) => (
                        <a 
                            key={item.id}
                            href={`#${item.id}`}
                            className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center border hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 ${
                                activeSection === item.id 
                                ? 'text-white border-transparent' 
                                : 'text-slate-600 border-transparent hover:text-indigo-700 hover:bg-white/50 hover:border-white/80 hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)]'
                            }`}
                        >
                            {activeSection === item.id && (
                                <motion.div
                                    layoutId="active-nav-pill"
                                    className="absolute inset-0 bg-indigo-600 rounded-full shadow-[0_4px_15px_rgba(99,102,241,0.4)] z-0"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{item.label}</span>
                        </a>
                    ))}
                </div>
            </nav>
        </motion.div>
    );
};

export default Navbar;