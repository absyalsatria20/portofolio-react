import { useState, useEffect, useLayoutEffect, useRef, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { createPortal } from 'react-dom';
import AdminPanel from './AdminPanel';
import { trackEvent } from '../lib/analytics.js';
import { isAdminUser, supabase } from '../lib/supabase.js';
import { ADMIN_EMAIL } from '../lib/adminAuth.js';

// ========================================================
// KOMPONEN KARTU — dipisah dari Portfolio + dibungkus memo()
// memo(): kartu lain tidak ikut render ulang saat modal atau filter berubah.
// ========================================================
const PortfolioCard = memo(function PortfolioCard({ item, onSelect }) {
    const [failedMediaKey, setFailedMediaKey] = useState('');
    const mediaKey = `${item.type}:${item.src}`;
    const hasMediaError = failedMediaKey === mediaKey;

    useLayoutEffect(() => {
        setFailedMediaKey('');
    }, [mediaKey]);

    const handleMediaError = () => setFailedMediaKey(mediaKey);

    return (
        <div
            onClick={() => {
                trackEvent('project_open', {
                    project_type: item.type,
                    project_category: item.category,
                });
                onSelect(item);
            }}
            // ⚡ OPTIMASI CSS HOVER: transition-all diganti transition-transform, hapus animasi shadow yang berat
            className="group relative overflow-hidden rounded-3xl cursor-pointer bg-slate-50/95 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2 transform-gpu transition-transform duration-300 w-full hover:ring-2 hover:ring-indigo-400/50"
        >
            {hasMediaError ? (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400" role="img" aria-label="Media proyek gagal dimuat">
                    <i className="ph-bold ph-image-broken text-3xl"></i>
                    <span className="text-xs font-semibold">Media tidak dapat dimuat</span>
                </div>
            ) : item.type === 'image' ? (
                <img
                    src={item.src}
                    decoding="async"
                    onError={handleMediaError}
                    className="block w-full h-auto transform-gpu transition-transform duration-500 group-hover:scale-105"
                    alt="Portfolio"
                />
            ) : (
                <>
                    <video
                        src={`${item.src}#t=${item.thumbTime || '0.1'}`}
                        preload="metadata"
                        muted
                        playsInline
                        onError={handleMediaError}
                        className="block w-full h-auto object-cover pointer-events-none transform-gpu transition-transform duration-500 group-hover:scale-105"
                    ></video>
                    <div className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-300 group-hover:scale-105 pointer-events-none transform-gpu">
                        {/* ⚡ Tombol Play disederhanakan animasinya */}
                        <div className="w-[20%] min-w-[48px] max-w-[68px] aspect-square rounded-full bg-white/70 backdrop-blur-sm border border-white/50 flex items-center justify-center text-indigo-600 shadow-md transition-transform duration-300 group-hover:scale-110 transform-gpu">
                            <i className="ph-fill ph-play text-xl md:text-2xl ml-1 drop-shadow-sm"></i>
                        </div>
                    </div>
                </>
            )}
            <div className="overlay absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent flex flex-col justify-end p-6 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform-gpu"></div>
        </div>
    );
});

// ========================================================
// KOMPONEN KARTU MODE EDIT (SortableEditItem)
// ========================================================
const SortableEditItem = ({ item, index, onDelete }) => {
    const controls = useDragControls();

    return (
        <Reorder.Item 
            value={item} 
            dragListener={false} 
            dragControls={controls} 
            // Tambahkan select-none di parent
            className="select-none group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm flex items-center p-2 md:p-3 gap-2 md:gap-4 transition-colors hover:border-indigo-400 hover:bg-white"
        >
            {/* Area Pemicu Drag */}
            <div 
                className="text-slate-400 pl-1 md:pl-2 shrink-0 cursor-grab active:cursor-grabbing p-2 hover:text-indigo-500 transition-colors"
                onPointerDown={(e) => controls.start(e)}
                style={{ touchAction: "none" }}
            >
                <i className="ph-bold ph-dots-six-vertical text-xl md:text-3xl pointer-events-none"></i>
            </div>
            
            {/* ⚡ Tambahkan select-none pada angka */}
            <div className="select-none font-black text-lg md:text-2xl text-slate-300 w-5 md:w-8 text-center shrink-0">
                {index + 1}
            </div>
            
            <div className="select-none w-16 h-12 md:w-28 md:h-20 shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                {item.type === 'image' ? ( 
                    // ⚡ Tambahkan draggable={false} agar gambar tidak bisa diseret bawaan browser
                    <img src={item.src} draggable={false} className="select-none w-full h-full object-cover opacity-90 pointer-events-none" alt="Thumb" /> 
                ) : ( 
                    <video src={`${item.src}#t=${item.thumbTime || '0.1'}`} preload="metadata" muted playsInline className="select-none w-full h-full object-cover opacity-90 pointer-events-none"></video> 
                )}
            </div>
            
            {/* ⚡ Tambahkan select-none pada area teks */}
            <div className="select-none flex-1 min-w-0 pointer-events-none">
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 md:py-1 rounded-md inline-block mb-1">{item.category}</span>
                <div className="text-slate-400 text-[10px] md:text-xs truncate w-full">{item.src}</div>
            </div>
            
            <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => onDelete(e, item.id)} className="bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-colors shrink-0 border border-rose-200 hover:border-rose-500" title="Hapus Project">
                <i className="ph-bold ph-trash text-base md:text-xl"></i>
            </button>
        </Reorder.Item>
    );
};

const PROJECTS_CACHE_KEY = 'portfolio-projects-cache';

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [confirmation, setConfirmation] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const confirmationDialogRef = useRef(null);
    const confirmationTriggerRef = useRef(null);
    const editLayoutButtonRef = useRef(null);

    useEffect(() => {
        if (!confirmation) {
            const trigger = confirmationTriggerRef.current;
            confirmationTriggerRef.current = null;
            if (trigger?.isConnected) trigger.focus();
            else editLayoutButtonRef.current?.focus();
            return undefined;
        }

        const dialog = confirmationDialogRef.current;
        const initialFocus = dialog?.querySelector('button:not(:disabled)') || dialog;
        initialFocus?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !isConfirming) {
                setConfirmation(null);
                return;
            }
            if (event.key !== 'Tab' || !dialog) return;
            const focusable = dialog.querySelectorAll('button:not(:disabled)');
            if (!focusable.length) {
                event.preventDefault();
                dialog.focus();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const focusOutsideDialog = !dialog.contains(document.activeElement);
            if (focusOutsideDialog) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [confirmation, isConfirming]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loginOpen, setLoginOpen] = useState(false);
    const [loginEmail, setLoginEmail] = useState(ADMIN_EMAIL);
    const [loginPassword, setLoginPassword] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    // Wadah data
    const [portfolioData, setPortfolioData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState('');
    const [projectsNotice, setProjectsNotice] = useState('');
    const [loadAttempt, setLoadAttempt] = useState(0);
    
    // STATE: Mode Edit & Deteksi Perubahan Layout
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOrderChanged, setIsOrderChanged] = useState(false);

    useEffect(() => {
        if (!supabase) {
            setAuthLoading(false);
            return undefined;
        }
        let isMounted = true;
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) console.error('Gagal memeriksa sesi admin:', error);
            if (isMounted) setAdminUser(isAdminUser(data?.session?.user) ? data.session.user : null);
        }).finally(() => {
            if (isMounted) setAuthLoading(false);
        });
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setAdminUser(isAdminUser(session?.user) ? session.user : null);
        });
        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        let hasCachedData = false;

        try {
            const cachedProjects = window.localStorage.getItem(PROJECTS_CACHE_KEY);
            if (cachedProjects) {
                const parsedProjects = JSON.parse(cachedProjects);
                if (Array.isArray(parsedProjects)) {
                    setPortfolioData(parsedProjects);
                    setIsLoading(false);
                    hasCachedData = true;
                }
            }
        } catch (error) {
            console.error('Gagal membaca cache project:', error);
            try {
                window.localStorage.removeItem(PROJECTS_CACHE_KEY);
            } catch (removeError) {
                console.error('Gagal menghapus cache project rusak:', removeError);
            }
        }

        if (!hasCachedData) setIsLoading(true);
        setProjectsError('');
        setProjectsNotice('');

        if (!supabase) {
            const message = 'Supabase belum dikonfigurasi. Data yang tampil berasal dari cache lokal.';
            console.error(message);
            if (hasCachedData) {
                setProjectsNotice(message);
            } else {
                setProjectsError(message);
                setIsLoading(false);
            }
            return () => { isMounted = false; };
        }

        supabase
            .from('projects')
            .select('*')
            .order('sort_order', { ascending: true })
            .then(({ data, error }) => {
                if (error) throw error;
                if (!Array.isArray(data)) throw new Error('Format data project tidak valid');
                if (!isMounted) return;
                setPortfolioData(data);
                try {
                    window.localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(data));
                } catch (cacheError) {
                    console.error('Data portofolio berhasil dimuat, tetapi cache gagal disimpan:', cacheError);
                }
                setProjectsError('');
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Gagal menarik data dari Supabase:', error);
                if (!isMounted) return;
                const message = 'Pembaruan data portofolio gagal. Periksa koneksi, lalu coba lagi.';
                if (hasCachedData) setProjectsNotice(message);
                else setProjectsError(message);
                setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [loadAttempt]);

    const refreshProjects = useCallback(async () => {
        if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
        const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        if (!Array.isArray(data)) throw new Error('Format data project tidak valid');
        setPortfolioData(data);
        try {
            window.localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(data));
        } catch (cacheError) {
            console.error('Daftar project berhasil dimuat, tetapi cache lokal gagal diperbarui:', cacheError);
        }
    }, []);

    const handleAdminLogin = async (event) => {
        event.preventDefault();
        if (!supabase) {
            setAuthMessage('Supabase belum dikonfigurasi.');
            return;
        }
        setIsLoggingIn(true);
        setAuthMessage('');
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail.trim(),
                password: loginPassword,
            });
            if (error) throw error;
            if (!isAdminUser(data.user)) {
                await supabase.auth.signOut();
                throw new Error('Akun ini tidak memiliki akses admin.');
            }
            setAdminUser(data.user);
            setLoginPassword('');
            setLoginOpen(false);
        } catch (error) {
            setAuthMessage(error.message || 'Login admin gagal.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleAdminLogout = async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) setAuthMessage(error.message);
        else {
            setAdminUser(null);
            setIsEditMode(false);
            setIsOrderChanged(false);
        }
    };

    const handleDelete = (event, id) => {
        event.stopPropagation();
        if (!isAdminUser(adminUser) || !supabase) {
            setAuthMessage('Login sebagai admin untuk menghapus proyek.');
            return;
        }
        confirmationTriggerRef.current = event.currentTarget;
        setConfirmation({ type: 'delete', projectId: id });
    };

    const handleSaveOrder = (event) => {
        confirmationTriggerRef.current = event.currentTarget;
        setConfirmation({ type: 'save-order' });
    };

    const handleConfirmAction = async () => {
        if (!confirmation || isConfirming) return;
        if (!isAdminUser(adminUser) || !supabase) {
            setAuthMessage('Login sebagai admin untuk melakukan tindakan ini.');
            setConfirmation(null);
            return;
        }

        if (confirmation.type !== 'delete' && confirmation.type !== 'save-order') {
            setConfirmation(null);
            return;
        }

        setIsConfirming(true);
        try {
            if (confirmation.type === 'delete') {
                const { error } = await supabase.from('projects').delete().eq('id', confirmation.projectId);
                if (error) throw error;
                const updated = portfolioData.filter((item) => item.id !== confirmation.projectId);
                setPortfolioData(updated);
                let cacheWarning = '';
                try {
                    window.localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(updated));
                } catch (cacheError) {
                    console.error('Proyek terhapus, tetapi cache lokal gagal diperbarui:', cacheError);
                    try {
                        window.localStorage.removeItem(PROJECTS_CACHE_KEY);
                    } catch (removeError) {
                        console.error('Cache project lama tidak dapat dibersihkan:', removeError);
                    }
                    cacheWarning = ' Cache lokal gagal diperbarui; muat ulang halaman.';
                }
                setAuthMessage(`Proyek berhasil dihapus. File media di Cloudinary tidak ikut dihapus.${cacheWarning}`);
            } else {
                const { error } = await supabase.rpc('reorder_projects', {
                    project_order: portfolioData.map((item, index) => ({ id: item.id, sort_order: index + 1 })),
                });
                if (error) throw error;
                setIsOrderChanged(false);
                setIsEditMode(false);
                setAuthMessage('Urutan proyek berhasil disimpan.');
                setConfirmation(null);
                try {
                    await refreshProjects();
                } catch (refreshError) {
                    console.error('Urutan tersimpan, tetapi daftar gagal dimuat ulang:', refreshError);
                    setAuthMessage('Urutan berhasil disimpan, tetapi daftar gagal dimuat ulang. Segarkan halaman.');
                }
            }
            setConfirmation(null);
        } catch (error) {
            console.error('Gagal menjalankan tindakan admin:', error);
            setConfirmation((current) => current ? { ...current, error: error.message } : current);
        } finally {
            setIsConfirming(false);
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        if (!isEditMode && activeFilter !== 'all') {
            setActiveFilter('all');
        }
    };

    const filteredItems = useMemo(
        () => portfolioData.filter(item => activeFilter === 'all' || item.category === activeFilter),
        [portfolioData, activeFilter]
    );

    return (
        <>
            <section id="karya" className="py-24 relative z-20 px-6 md:px-12 lg:px-16">
                
                {/* --- BACKGROUND GARIS KOTAK-KOTAK DIKEMBALIKAN --- */}
                <div className="absolute top-0 right-0 w-[500px] h-[600px] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_100%_0%,#000_60%,transparent_100%)] opacity-50 z-0 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[600px] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_0%_100%,#000_60%,transparent_100%)] opacity-50 z-0 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">Project Showcase</h2>
                        <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full mb-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                        
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
                            <button onClick={() => { setActiveFilter('graphic'); trackEvent('project_filter', { filter_name: 'graphic' }); }} className={`px-6 py-3 rounded-full backdrop-blur-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border ${activeFilter === 'graphic' ? 'bg-white/80 border-white text-indigo-700 shadow-[0_8px_32px_rgba(255,255,255,0.6)]' : 'bg-white/30 border-white/50 text-slate-700 hover:bg-white/60 hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)]'}`}>Desain Grafis</button>
                            <button onClick={() => { setActiveFilter('motion'); trackEvent('project_filter', { filter_name: 'motion' }); }} className={`px-6 py-3 rounded-full backdrop-blur-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border ${activeFilter === 'motion' ? 'bg-white/80 border-white text-indigo-700 shadow-[0_8px_32px_rgba(255,255,255,0.6)]' : 'bg-white/30 border-white/50 text-slate-700 hover:bg-white/60 hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)]'}`}>Motion Grafis</button>
                            <button onClick={() => { setActiveFilter('all'); trackEvent('project_filter', { filter_name: 'all' }); }} className={`px-6 py-3 rounded-full backdrop-blur-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border ${activeFilter === 'all' ? 'bg-white/80 border-white text-indigo-700 shadow-[0_8px_32px_rgba(255,255,255,0.6)]' : 'bg-white/30 border-white/50 text-slate-700 hover:bg-white/60 hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)]'}`}>Semua</button>
                            
                            {adminUser ? (
                                <>
                                    <AdminPanel user={adminUser} onProjectAdded={refreshProjects} />
                                    <button
                                        type="button"
                                        onClick={handleAdminLogout}
                                        className="group inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-5 py-3 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-rose-200 hover:bg-rose-50/90 hover:text-rose-600 hover:shadow-[0_0_22px_rgba(244,63,94,0.28)] active:scale-95"
                                    >
                                        <i className="ph-bold ph-sign-out text-lg transition-transform duration-300 group-hover:translate-x-0.5"></i>
                                        <span>Logout</span>
                                    </button>
                                    <button
                                        ref={editLayoutButtonRef}
                                        type="button"
                                        onClick={toggleEditMode}
                                        className={`group inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 ${isEditMode
                                                                                    ? 'border-amber-300 bg-amber-100/90 text-amber-700 shadow-[0_8px_24px_rgba(245,158,11,0.14)] hover:bg-amber-200/90 hover:shadow-[0_4px_20px_rgba(245,158,11,0.4)]'
                                            : 'border-white/60 bg-white/45 text-slate-600 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/90 hover:text-indigo-700 hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)]'}`}
                                    >
                                        <i className={`ph-bold ${isEditMode ? 'ph-x' : 'ph-arrows-out-cardinal'} text-lg transition-transform duration-300 group-hover:scale-105`}></i>
                                        <span>{isEditMode ? 'Tutup Edit' : 'Edit Layout'}</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => { setAuthMessage(''); setLoginOpen(true); }}
                                    disabled={authLoading}
                                    className="relative z-50 cursor-pointer px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-indigo-600 bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 shadow-md hover:shadow-[0_8px_25px_rgba(99,102,241,0.3)] flex items-center gap-2 ml-2 disabled:opacity-60 disabled:hover:scale-100"
                                >
                                    <i className="ph-bold ph-lock-key text-lg"></i>
                                    <span>{authLoading ? 'Memeriksa...' : 'Admin Login'}</span>
                                </button>
                            )}

                            <AnimatePresence>
                                {adminUser && isOrderChanged && isEditMode && (
                                    <motion.button 
                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={(event) => {
                                            confirmationTriggerRef.current = event.currentTarget;
                                            handleSaveOrder(event);
                                        }}
                                        className="px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-emerald-500 bg-emerald-500 text-white hover:bg-white hover:text-emerald-600 shadow-md shadow-emerald-500/30 flex items-center gap-2 ml-2 animate-pulse"
                                    >
                                        <i className="ph-bold ph-floppy-disk text-lg"></i>
                                        <span>Save Layout</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {projectsNotice && portfolioData.length > 0 && (
                            <div role="status" className="mb-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-left text-sm text-amber-800 sm:flex-row">
                                <span>{projectsNotice}</span>
                                <button
                                    type="button"
                                    onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                                    className="min-h-10 shrink-0 rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        )}
                        {isLoading ? (
                            <div aria-label="Memuat proyek portofolio" aria-busy="true" className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6 items-start">
                                {[0, 1, 2].map((column) => (
                                    <div key={column} className={`flex flex-col gap-4 lg:gap-6 ${column === 2 ? 'hidden lg:flex' : ''}`}>
                                        {[0, 1, 2].map((card) => (
                                            <div key={card} className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                                                <div className={`animate-pulse bg-slate-200/70 ${card % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}`} />
                                                <div className="space-y-2 p-4">
                                                    <div className="h-3 w-2/5 animate-pulse rounded-full bg-slate-200/80" />
                                                    <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-200/60" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : projectsError && portfolioData.length === 0 ? (
                            <div role="alert" className="mx-auto max-w-lg rounded-3xl border border-rose-100 bg-white/85 p-8 text-center shadow-lg backdrop-blur-sm">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                                    <i className="ph-bold ph-wifi-x text-2xl"></i>
                                </div>
                                <h3 className="mb-2 text-lg font-black text-slate-800">Portofolio belum bisa dimuat</h3>
                                <p className="mb-5 text-sm leading-relaxed text-slate-500">{projectsError}</p>
                                <button
                                    type="button"
                                    onClick={() => { if (portfolioData.length === 0) setIsLoading(true); setLoadAttempt((attempt) => attempt + 1); }}
                                    className="min-h-11 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        ) : isEditMode && activeFilter === 'all' ? (
                            
                            <Reorder.Group axis="y" values={portfolioData} onReorder={(newOrder) => { setPortfolioData(newOrder); setIsOrderChanged(true); }} className="flex flex-col gap-3 md:gap-4 max-w-3xl mx-auto w-full pb-10">
                                <div className="bg-amber-100 text-amber-700 px-4 py-3 rounded-xl md:rounded-2xl mb-2 text-xs md:text-sm font-bold border border-amber-200 flex items-center gap-3">
                                    <i className="ph-bold ph-info text-lg md:text-xl shrink-0"></i>
                                    <span>Tahan dan seret baris ke atas/bawah untuk mengubah urutan.</span>
                                </div>
                                {portfolioData.map((item, index) => (
                                    <SortableEditItem 
                                        key={item.id} 
                                        item={item} 
                                        index={index} 
                                        onDelete={handleDelete} 
                                    />
                                ))}
                            </Reorder.Group>

                        ) : (

                            // ========================================================
                            // TAMPILAN NORMAL: HYBRID GRID + MASONRY (Anti-Bug)
                            // ========================================================
                            <div className="w-full">
                                {/* LAYOUT MOBILE: Grid 2 Kolom berisi Flex vertikal */}
                                <div className="grid grid-cols-2 gap-4 lg:hidden items-start">
                                    <div className="flex flex-col gap-4">
                                        {filteredItems.filter((_, i) => i % 2 === 0).map(item => (
                                            <PortfolioCard key={item.id} item={item} onSelect={setSelectedItem} />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {filteredItems.filter((_, i) => i % 2 !== 0).map(item => (
                                            <PortfolioCard key={item.id} item={item} onSelect={setSelectedItem} />
                                        ))}
                                    </div>
                                </div>

                                {/* LAYOUT DESKTOP: Grid 3 Kolom berisi Flex vertikal */}
                                <div className="hidden lg:grid grid-cols-3 gap-6 items-start">
                                    <div className="flex flex-col gap-6">
                                        {filteredItems.filter((_, i) => i % 3 === 0).map(item => (
                                            <PortfolioCard key={item.id} item={item} onSelect={setSelectedItem} />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        {filteredItems.filter((_, i) => i % 3 === 1).map(item => (
                                            <PortfolioCard key={item.id} item={item} onSelect={setSelectedItem} />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        {filteredItems.filter((_, i) => i % 3 === 2).map(item => (
                                            <PortfolioCard key={item.id} item={item} onSelect={setSelectedItem} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                </div>
            </section>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {confirmation && (
                        <motion.div
                            key="admin-confirmation-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[1000001] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => !isConfirming && setConfirmation(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.92, opacity: 0, y: 18 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.92, opacity: 0, y: 18 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                ref={confirmationDialogRef}
                                tabIndex={-1}
                                role={confirmation.type === 'delete' ? 'alertdialog' : 'dialog'}
                                aria-modal="true"
                                aria-labelledby="admin-confirmation-title"
                                aria-describedby="admin-confirmation-description"
                                onClick={(event) => event.stopPropagation()}
                                className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                            >
                                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${confirmation.type === 'delete' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    <i className={`ph-bold ${confirmation.type === 'delete' ? 'ph-trash' : 'ph-floppy-disk'} text-2xl`}></i>
                                </div>
                                <h3 id="admin-confirmation-title" className="mb-2 text-lg font-black text-slate-800">
                                    {confirmation.type === 'delete' ? 'Hapus proyek ini?' : 'Simpan perubahan layout?'}
                                </h3>
                                <p id="admin-confirmation-description" className="mb-6 text-sm leading-relaxed text-slate-500">
                                    {confirmation.type === 'delete'
                                        ? 'Data proyek akan dihapus dari portofolio. File media di Cloudinary tidak ikut dihapus.'
                                        : 'Urutan proyek akan diperbarui dan langsung terlihat oleh pengunjung.'}
                                </p>
                                {confirmation.error && (
                                    <p role="alert" className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600">
                                        Gagal: {confirmation.error}
                                    </p>
                                )}
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        disabled={isConfirming}
                                        onClick={() => setConfirmation(null)}
                                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isConfirming}
                                        onClick={handleConfirmAction}
                                        className={`min-h-11 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 ${confirmation.type === 'delete' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                                    >
                                        {isConfirming ? 'Memproses...' : confirmation.type === 'delete' ? 'Ya, Hapus' : 'Ya, Simpan'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {loginOpen && (
                        <motion.div
                            key="admin-login-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setLoginOpen(false)}
                        >
                            <motion.div
                                key="admin-login-modal"
                                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 30 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                onClick={(event) => event.stopPropagation()}
                                className="bg-white rounded-3xl p-5 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative"
                            >
                                <button type="button" onClick={() => setLoginOpen(false)} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors z-10" aria-label="Tutup login">
                                    <i className="ph-bold ph-x text-sm"></i>
                                </button>
                                <h3 className="text-lg font-black text-slate-800 mb-1 flex items-center gap-2">
                                    <i className="ph-fill ph-user-circle text-indigo-600"></i> Admin Login
                                </h3>
                                <p className="text-xs text-slate-500 mb-5">Masuk untuk mengelola proyek portofolio.</p>
                                <form onSubmit={handleAdminLogin} className="space-y-3">
                                    <div>
                                        <label htmlFor="admin-login-email" className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                                        <input id="admin-login-email" type="email" autoComplete="username" required value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} className="w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="admin-login-password" className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Password</label>
                                        <input id="admin-login-password" type="password" autoComplete="current-password" required value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} className="w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500" />
                                    </div>
                                    {authMessage && <p role="alert" className="text-xs font-bold text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{authMessage}</p>}
                                    <button type="submit" disabled={isLoggingIn} className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:bg-slate-400">
                                        {isLoggingIn ? <><i className="ph-bold ph-spinner animate-spin"></i> Memeriksa...</> : <><i className="ph-bold ph-sign-in"></i> Masuk</>}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* MODAL ZOOM GAMBAR NORMAL */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-xl" onClick={() => setSelectedItem(null)}>
                        <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white hover:bg-white/20 transition-colors z-[10000] bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2.5 shadow-lg hover:scale-110" onClick={() => setSelectedItem(null)}>
                            <i className="ph-bold ph-x text-2xl md:text-3xl"></i>
                        </button>
                        <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative max-w-full max-h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
                            {selectedItem.type === 'image' ? (
                                <img src={selectedItem.src} alt="Zoomed Portfolio" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
                            ) : (
                                <video src={selectedItem.src} controls autoPlay playsInline className="max-w-full max-h-[90vh] rounded-2xl bg-black" />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Portfolio;