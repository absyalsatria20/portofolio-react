import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import AdminPanel from './AdminPanel';

const ProjectCard = memo(({ item, onClick }) => {
    return (
        <div 
            onClick={() => onClick(item)} 
            className="group relative overflow-hidden rounded-3xl cursor-pointer bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:-translate-y-2 transform-gpu transition-all duration-500 w-full"
        >
            {item.type === 'image' ? (
                <img src={item.src} className="block w-full h-auto transform-gpu transition-transform duration-700 group-hover:scale-105" alt="Portfolio" />
            ) : (
                <>
                    <video src={`${item.src}#t=${item.thumbTime || '0.1'}`} preload="metadata" playsInline className="block w-full h-auto object-cover pointer-events-none transform-gpu transition-transform duration-700 group-hover:scale-105"></video>
                    <div className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-500 group-hover:scale-105 pointer-events-none transform-gpu">
                        <div className="w-[20%] min-w-[48px] max-w-[68px] aspect-square rounded-full bg-white/30 backdrop-blur-xl border border-white/50 flex items-center justify-center text-indigo-600 shadow-[0_8px_32px_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:bg-white/80 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transform-gpu">
                            <i className="ph-fill ph-play text-xl md:text-2xl ml-1 drop-shadow-sm"></i>
                        </div>
                    </div>
                </>
            )}
            <div className="overlay absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent flex flex-col justify-end p-6 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform-gpu"></div>
        </div>
    );
});

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [portfolioData, setPortfolioData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOrderChanged, setIsOrderChanged] = useState(false);

    useEffect(() => {
        fetch('https://portofolio-backend-production-98e1.up.railway.app/api/projects')
            .then(response => response.json())
            .then(data => {
                setPortfolioData(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Gagal menarik data:", error);
                setIsLoading(false);
            });
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        const pin = window.prompt("⚠️ Masukkan PIN Rahasia untuk MENGHAPUS project ini:");
        if (pin !== null && pin !== "") {
            try {
                const response = await fetch(`https://portofolio-backend-production-98e1.up.railway.app/api/projects/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ secret_pin: pin })
                });
                const result = await response.json();
                if (result.success) {
                    alert("✅ " + result.message);
                    window.location.reload();
                } else {
                    alert("❌ " + result.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Terjadi kesalahan saat menghapus data.");
            }
        }
    };

    const handleSaveOrder = async () => {
        const pin = window.prompt("⚠️ Masukkan PIN Rahasia untuk MENYIMPAN susunan layout baru:");
        if (pin !== null && pin !== "") {
            const reorderedItems = portfolioData.map((item, index) => ({
                id: item.id,
                sort_order: index + 1
            }));
            try {
                const response = await fetch('https://portofolio-backend-production-98e1.up.railway.app/api/projects/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ secret_pin: pin, items: reorderedItems })
                });
                const result = await response.json();
                if (result.success) {
                    alert("✅ " + result.message);
                    setIsOrderChanged(false); 
                    setIsEditMode(false);
                } else {
                    alert("❌ " + result.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Terjadi kesalahan saat menyimpan susunan.");
            }
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        if (!isEditMode && activeFilter !== 'all') {
            setActiveFilter('all');
        }
    };

    const filteredItems = portfolioData.filter(item => 
        activeFilter === 'all' || item.category === activeFilter
    );

    const handleCardClick = useCallback((item) => {
        setSelectedItem(item);
    }, []);

    return (
        <>
            <section id="karya" className="py-24 relative z-20 px-6 md:px-12 lg:px-16">
                
                <div className="absolute top-0 right-0 w-[500px] h-[600px] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_100%_0%,#000_60%,transparent_100%)] opacity-50 z-0 pointer-events-none transform-gpu"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[600px] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_0%_100%,#000_60%,transparent_100%)] opacity-50 z-0 pointer-events-none transform-gpu"></div>

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">Project Showcase</h2>
                        <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full mb-10 shadow-[0_0_15px_rgba(99,102,241,0.5)] transform-gpu"></div>
                        
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
                            <button onClick={() => setActiveFilter('graphic')} className={`px-6 py-3 rounded-full backdrop-blur-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border ${activeFilter === 'graphic' ? 'bg-white/80 border-white text-indigo-700 shadow-[0_8px_32px_rgba(255,255,255,0.6)]' : 'bg-white/30 border-white/50 text-slate-700 hover:bg-white/60 hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)]'}`}>Desain Grafis</button>
                            <button onClick={() => setActiveFilter('motion')} className={`px-6 py-3 rounded-full backdrop-blur-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border ${activeFilter === 'motion' ? 'bg-white/80 border-white text-indigo-700 shadow-[0_8px_32px_rgba(255,255,255,0.6)]' : 'bg-white/30 border-white/50 text-slate-700 hover:bg-white/60 hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)]'}`}>Motion Grafis</button>
                            <button onClick={() => setActiveFilter('all')} className={`px-6 py-3 rounded-full backdrop-blur-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border ${activeFilter === 'all' ? 'bg-white/80 border-white text-indigo-700 shadow-[0_8px_32px_rgba(255,255,255,0.6)]' : 'bg-white/30 border-white/50 text-slate-700 hover:bg-white/60 hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)]'}`}>Semua</button>
                            
                            <AdminPanel onProjectAdded={() => window.location.reload()} />

                            <button onClick={toggleEditMode} className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border-2 flex items-center gap-2 ml-2 ${isEditMode ? 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'border-slate-300 bg-transparent text-slate-600 hover:bg-slate-100'}`}>
                                <i className={`ph-bold ${isEditMode ? 'ph-x' : 'ph-arrows-out-cardinal'} text-lg`}></i>
                                <span>{isEditMode ? 'Tutup Edit' : 'Edit Layout'}</span>
                            </button>

                            <AnimatePresence>
                                {isOrderChanged && isEditMode && (
                                    <motion.button 
                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={handleSaveOrder} 
                                        className="px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-emerald-500 bg-emerald-500 text-white hover:bg-white hover:text-emerald-600 shadow-md shadow-emerald-500/30 flex items-center gap-2 ml-2 animate-pulse"
                                    >
                                        <i className="ph-bold ph-floppy-disk text-lg"></i>
                                        <span>Save Layout</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : isEditMode && activeFilter === 'all' ? (
                            
                            <Reorder.Group axis="y" values={portfolioData} onReorder={(newOrder) => { setPortfolioData(newOrder); setIsOrderChanged(true); }} className="flex flex-col gap-3 md:gap-4 max-w-3xl mx-auto w-full pb-10">
                                <div className="bg-amber-100 text-amber-700 px-4 py-3 rounded-xl md:rounded-2xl mb-2 text-xs md:text-sm font-bold border border-amber-200 flex items-center gap-3">
                                    <i className="ph-bold ph-info text-lg md:text-xl shrink-0"></i>
                                    <span>Tahan dan seret baris ke atas/bawah untuk mengubah urutan.</span>
                                </div>
                                {portfolioData.map((item, index) => (
                                    <Reorder.Item key={item.id} value={item} className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-lg cursor-grab active:cursor-grabbing flex items-center p-2 md:p-3 gap-2 md:gap-4 transition-colors hover:border-indigo-400 hover:bg-white transform-gpu">
                                        <div className="text-slate-400 pl-1 md:pl-2 shrink-0"><i className="ph-bold ph-dots-six-vertical text-xl md:text-3xl"></i></div>
                                        <div className="font-black text-lg md:text-2xl text-slate-300 w-5 md:w-8 text-center shrink-0">{index + 1}</div>
                                        <div className="w-16 h-12 md:w-28 md:h-20 shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-slate-900 shadow-inner transform-gpu">
                                            {item.type === 'image' ? ( <img src={item.src} className="w-full h-full object-cover opacity-90" alt="Thumb" /> ) : ( <video src={`${item.src}#t=${item.thumbTime || '0.1'}`} preload="metadata" className="w-full h-full object-cover opacity-90 pointer-events-none"></video> )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 md:py-1 rounded-md inline-block mb-1">{item.category}</span>
                                            <div className="text-slate-400 text-[10px] md:text-xs truncate w-full">{item.src}</div>
                                        </div>
                                        <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => handleDelete(e, item.id)} className="bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-colors shrink-0 border border-rose-200 hover:border-rose-500" title="Hapus Project">
                                            <i className="ph-bold ph-trash text-base md:text-xl"></i>
                                        </button>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                        ) : (

                            <div className="w-full">
                                {/* LAYOUT MOBILE */}
                                <div className="grid grid-cols-2 gap-4 lg:hidden items-start">
                                    <div className="flex flex-col gap-4">
                                        {filteredItems.filter((_, i) => i % 2 === 0).map(item => (
                                            <ProjectCard key={item.id} item={item} onClick={handleCardClick} />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {filteredItems.filter((_, i) => i % 2 !== 0).map(item => (
                                            <ProjectCard key={item.id} item={item} onClick={handleCardClick} />
                                        ))}
                                    </div>
                                </div>

                                {/* LAYOUT DESKTOP */}
                                <div className="hidden lg:grid grid-cols-3 gap-6 items-start">
                                    <div className="flex flex-col gap-6">
                                        {filteredItems.filter((_, i) => i % 3 === 0).map(item => (
                                            <ProjectCard key={item.id} item={item} onClick={handleCardClick} />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        {filteredItems.filter((_, i) => i % 3 === 1).map(item => (
                                            <ProjectCard key={item.id} item={item} onClick={handleCardClick} />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        {filteredItems.filter((_, i) => i % 3 === 2).map(item => (
                                            <ProjectCard key={item.id} item={item} onClick={handleCardClick} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                </div>
            </section>

            {/* MODAL ZOOM GAMBAR */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-xl transform-gpu" onClick={() => setSelectedItem(null)}>
                        <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white hover:bg-white/20 transition-colors z-[10000] bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2.5 shadow-lg hover:scale-110" onClick={() => setSelectedItem(null)}>
                            <i className="ph-bold ph-x text-2xl md:text-3xl"></i>
                        </button>
                        <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative max-w-full max-h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu" onClick={(e) => e.stopPropagation()}>
                            {selectedItem.type === 'image' ? (
                                <img src={selectedItem.src} alt="Zoomed Portfolio" className="max-w-full max-h-[90vh] object-contain rounded-2xl transform-gpu" />
                            ) : (
                                <video src={selectedItem.src} controls autoPlay className="max-w-full max-h-[90vh] rounded-2xl bg-black transform-gpu" />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Portfolio;