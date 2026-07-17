import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  // Mendeteksi persentase scroll dari paling atas (0) ke paling bawah (1)
  const { scrollYProgress } = useScroll();
  
  // Efek Parallax: Menggeser background sejauh 20vh ke bawah secara mulus
  const yBg = useTransform(scrollYProgress, [0, 1], ['0vh', '20vh']);

  return (
    // Memakai overflow-x-hidden agar layar HP tidak memotong elemen ke samping
    <div className="relative min-h-screen text-slate-800 font-sans selection:bg-indigo-200 bg-slate-50 overflow-x-hidden">
      
      {/* --- BACKGROUND PARALLAX (Ikut Turun) --- */}
      <motion.div 
        className="fixed left-0 w-full z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          height: '120vh',     // Sengaja dibuat lebih tinggi dari layar
          top: '-20vh',        // Sisa tingginya disembunyikan di atas
          backgroundImage: `url('https://res.cloudinary.com/vkyl7elo/image/upload/v1784278402/bg-abstract5_k45bqz.jpg')`,
          // filter blur raksasa dihapus agar GPU HP tidak ngos-ngosan
          y: yBg               // Didorong turun perlahan oleh Framer Motion saat di-scroll
        }}
      >
        {/* Lapisan frosting tipis agar warna pastelnya menyatu dan teks tetap terbaca */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
      </motion.div>

      {/* --- KONTEN WEBSITE --- */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Portfolio />
        <About />
        <Contact />
        <Footer />
        <ScrollToTop />
      </div>

    </div>
  );
}

export default App;