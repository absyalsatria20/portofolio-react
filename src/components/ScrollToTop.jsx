import { useState, useEffect } from 'react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
    onClick={scrollToTop}
    className={`fixed bottom-8 right-8
    w-14 h-14
    flex items-center justify-center
    rounded-2xl

    bg-gradient-to-br
    from-cyan-400
    via-sky-500
    to-indigo-500

    text-white

    shadow-[0_10px_25px_rgba(56,189,248,.35)]

    hover:from-cyan-300
    hover:via-sky-400
    hover:to-indigo-400

    hover:shadow-[0_0_35px_rgba(34,211,238,.45)]
    hover:scale-110
    hover:-translate-y-1

    active:scale-95
    transition-all duration-300
    z-40

    ${
        isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
    }`}
>
    <i className="ph-bold ph-caret-up text-xl"></i>
</button>
    );
};

export default ScrollToTop;
// AKHIR DARI FILE ScrollToTop.jsx