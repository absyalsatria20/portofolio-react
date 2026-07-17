import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = ({ onProjectAdded }) => {
    // ==========================================
    // KONFIGURASI CLOUDINARY
    // ==========================================
    const CLOUD_NAME = "vkyl7elo"; 
    const UPLOAD_PRESET = "portofolio-cloudinary"; 

    const [isOpen, setIsOpen] = useState(false);
    const [uploadMode, setUploadMode] = useState('file'); 
    
    // State untuk Form & File
    const [formData, setFormData] = useState({
        type: 'image',
        category: 'graphic',
        src: '',
        thumbTime: '',
        secret_pin: '' 
    });
    
    // State untuk Drag & Drop
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // State Loading & Notifikasi
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // ==========================================
    // FUNGSI DRAG & DROP & PILIH FILE
    // ==========================================
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const processFile = (selectedFile) => {
        if (!selectedFile) return;
        
        // Deteksi Tipe (Image / Video) secara otomatis
        const isVideo = selectedFile.type.startsWith('video');
        setFormData({ ...formData, type: isVideo ? 'video' : 'image' });
        
        setFile(selectedFile);
        
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        processFile(droppedFile);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        processFile(selectedFile);
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    // ==========================================
    // FUNGSI SUBMIT (Upload & Simpan)
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        let finalSrc = formData.src;

        try {
            if (uploadMode === 'file') {
                if (!file) {
                    setMessage('❌ Harap pilih file terlebih dahulu!');
                    setIsSubmitting(false);
                    return;
                }

                setMessage('⏳ Sedang mengunggah file ke Cloudinary...');
                const uploadData = new FormData();
                uploadData.append('file', file);
                uploadData.append('upload_preset', UPLOAD_PRESET);

                const resourceType = formData.type === 'video' ? 'video' : 'image';
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

                const cloudRes = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: uploadData
                });

                const cloudResult = await cloudRes.json();

                if (!cloudRes.ok) {
                    throw new Error(cloudResult.error?.message || 'Gagal upload ke Cloudinary');
                }

                finalSrc = cloudResult.secure_url;
            }

            setMessage('⏳ Sedang menyimpan data proyek...');
            
            // Menentukan tipe data berdasarkan kategori untuk URL manual
            const payloadType = (uploadMode === 'file' && file) 
                ? formData.type 
                : (formData.category === 'motion' ? 'video' : 'image');

            const payload = { ...formData, type: payloadType, src: finalSrc };

            const response = await fetch('https://portofolio-backend-production-98e1.up.railway.app/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                setMessage('🎉 ' + result.message);
                
                setFormData({ type: 'image', category: 'graphic', src: '', thumbTime: '', secret_pin: '' });
                setFile(null);
                setPreview(null);
                
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
            setMessage(`❌ Terjadi kesalahan: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button 
                type="button"
                onClick={() => setIsOpen(true)} 
                className="relative z-50 cursor-pointer px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-indigo-600 bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 shadow-md hover:shadow-[0_8px_25px_rgba(99,102,241,0.3)] flex items-center gap-2 ml-2"
            >
                <i className="ph-bold ph-plus text-lg"></i> 
                <span>Add Project</span>
            </button>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            key="modal-overlay"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        >
                            {/* Ganti bagian motion.div ini di file AdminPanel.jsx kamu */}
                    <motion.div 
                        key="modal-content"
                        initial={{ scale: 0.8, opacity: 0, y: 30 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.8, opacity: 0, y: 30 }} 
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        // UBAH max-w-md menjadi max-w-sm agar lebih kecil
                        className="bg-white rounded-3xl p-5 md:p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
                    >
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors z-10">
                            <i className="ph-bold ph-x text-sm"></i>
                        </button>

                        <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
                            <i className="ph-fill ph-plus-circle text-indigo-600"></i> New Project
                        </h3>

                                {/* TAB PILIHAN MODE */}
                                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                                    <button type="button" onClick={() => setUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${uploadMode === 'file' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Upload File</button>
                                    <button type="button" onClick={() => setUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${uploadMode === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Manual URL</button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 relative">
                                    
                                    {/* MODE UPLOAD FILE (DRAG & DROP) */}
                                    {uploadMode === 'file' && (
                                        <div 
                                            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                            onClick={() => !file && fileInputRef.current.click()}
                                            className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300'} ${!file ? 'cursor-pointer min-h-[160px]' : ''}`}
                                        >
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
                                            
                                            {!file ? (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-500 mb-3">
                                                        <i className="ph-bold ph-cloud-arrow-up text-2xl"></i>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-600 text-center">Klik atau Tarik file ke sini</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 text-center">Mendukung JPG, PNG, GIF, MP4</p>
                                                </>
                                            ) : (
                                                <div className="w-full relative rounded-xl overflow-hidden group">
                                                    {formData.type === 'image' ? (
                                                        <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
                                                    ) : (
                                                        <video src={preview} className="w-full h-32 object-cover bg-black" controls></video>
                                                    )}
                                                    
                                                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                        <button type="button" onClick={removeFile} className="bg-rose-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-rose-600 flex items-center gap-2 transition-transform hover:scale-105">
                                                            <i className="ph-bold ph-trash"></i> Ganti File
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Kategori - Ditambahkan text-slate-800 agar tulisan terlihat hitam jelas */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori Project</label>
                                        <select 
                                            value={formData.category} 
                                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                                            className="w-full px-3 py-2 text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500"
                                        >
                                            <option value="graphic">Desain Grafis</option>
                                            <option value="motion">Motion Grafis</option>
                                        </select>
                                    </div>

                                    {/* MODE MANUAL URL - Pilihan File Type dihapus */}
                                    {uploadMode === 'url' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cloudinary URL</label>
                                            <input 
                                                type="text" 
                                                required={uploadMode === 'url'} 
                                                placeholder="https://res.cloudinary.com/..." 
                                                value={formData.src} 
                                                onChange={(e) => setFormData({...formData, src: e.target.value})} 
                                                className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500"
                                            />
                                        </div>
                                    )}

                                    {/* Thumbnail Time - Sekarang muncul otomatis JIKA kategori "motion" dipilih */}
                                    {formData.category === 'motion' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thumbnail Time (Sec)</label>
                                            <input 
                                                type="text" 
                                                placeholder="Contoh: 1.5 (Tampil detik ke 1.5)" 
                                                value={formData.thumbTime} 
                                                onChange={(e) => setFormData({...formData, thumbTime: e.target.value})} 
                                                className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500"
                                            />
                                        </motion.div>
                                    )}

                                    {/* INPUT PIN RAHASIA - Ditambahkan text-slate-800 */}
                                    <div>
                                        <label className="block text-xs font-bold text-rose-500 uppercase mb-1 flex items-center gap-1">
                                            <i className="ph-bold ph-key"></i> PIN Akses
                                        </label>
                                        <input 
                                            type="password" 
                                            required 
                                            placeholder="Masukkan PIN Rahasia" 
                                            value={formData.secret_pin} 
                                            onChange={(e) => setFormData({...formData, secret_pin: e.target.value})} 
                                            className="w-full px-3 py-2 text-sm text-slate-800 bg-rose-50 border border-rose-200 rounded-xl focus:outline-rose-500"
                                        />
                                    </div>

                                    {/* Tombol Submit */}
                                    <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex justify-center items-center gap-2 disabled:bg-slate-400">
                                        {isSubmitting ? (
                                            <><i className="ph-bold ph-spinner animate-spin text-lg"></i> Memproses...</>
                                        ) : (
                                            <><i className="ph-bold ph-upload-simple text-lg"></i> Simpan Project</>
                                        )}
                                    </button>

                                    {/* Notifikasi */}
                                    {message && (
                                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-center text-sm font-bold mt-3 px-4 py-2 rounded-lg ${message.includes('❌') ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {message}
                                        </motion.p>
                                    )}
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default AdminPanel;