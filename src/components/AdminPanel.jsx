import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = ({ onProjectAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'image',
        category: 'graphic',
        src: '',
        thumbTime: '',
        secret_pin: '' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('https://portofolio-backend-production-98e1.up.railway.app/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setMessage('🎉 ' + result.message);
                setFormData({ type: 'image', category: 'graphic', src: '', thumbTime: '', secret_pin: '' });
                setTimeout(() => {
                    setIsOpen(false);
                    setMessage('');
                    if (onProjectAdded) onProjectAdded();
                }, 1500); 
            } else {
                setMessage('❌ ' + (result.message || 'Gagal menyimpan proyek.'));
            }
        } catch (error) {
            console.error(error);
            setMessage('❌ Terjadi kesalahan server.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Tombol Add Project */}
            <button 
                onClick={() => setIsOpen(true)} 
                className="px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-indigo-600 bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 shadow-md hover:shadow-[0_8px_25px_rgba(99,102,241,0.3)] flex items-center gap-2 ml-2"
            >
                <i className="ph-bold ph-plus text-lg"></i> 
                <span>Add Project</span>
            </button>

            {/* AnimatePresence memungkinkan animasi berjalan sebelum komponen benar-benar hilang dari layar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        {/* Animasi memantul (spring) untuk kotak form */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 30 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.8, opacity: 0, y: 30 }} 
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
                        >
                            
                            {/* Tombol Close (X) */}
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors"
                            >
                                <i className="ph-bold ph-x text-lg"></i>
                            </button>

                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <i className="ph-fill ph-plus-circle text-indigo-600"></i> Secured Upload
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">File Type</label>
                                        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500">
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500">
                                            <option value="graphic">Grafis</option>
                                            <option value="motion">Motion</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cloudinary URL</label>
                                    <input type="text" required placeholder="https://res.cloudinary.com/..." value={formData.src} onChange={(e) => setFormData({...formData, src: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500"/>
                                </div>

                                {formData.type === 'video' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thumbnail Time (Sec)</label>
                                        <input type="text" placeholder="Contoh: 1.5" value={formData.thumbTime} onChange={(e) => setFormData({...formData, thumbTime: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500"/>
                                    </div>
                                )}

                                {/* INPUT PIN RAHASIA */}
                                <div>
                                    <label className="block text-xs font-bold text-rose-500 uppercase mb-1 flex items-center gap-1">
                                        <i className="ph-bold ph-key"></i> PIN Akses
                                    </label>
                                    <input type="password" required placeholder="Masukkan PIN Rahasia" value={formData.secret_pin} onChange={(e) => setFormData({...formData, secret_pin: e.target.value})} className="w-full px-3 py-2 text-sm bg-rose-50 border border-rose-200 rounded-xl focus:outline-rose-500"/>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer">
                                    {isSubmitting ? 'Memverifikasi...' : 'Upload Project'}
                                </button>

                                {message && <p className={`text-center text-sm font-bold mt-3 ${message.includes('🎉') ? 'text-green-600' : 'text-rose-600'} animate-pulse`}>{message}</p>}
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminPanel;