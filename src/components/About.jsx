const About = () => {
    return (
        <section id="tentang" className="py-24 relative border-t border-slate-200 z-20">
            {/* Aksen Grid Kotak (Posisi Kiri Bawah) */}
<div className="absolute bottom-0 left-0 w-[500px] h-[600px] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_0%_100%,#000_60%,transparent_100%)] opacity-50 z-0 pointer-events-none"></div>
            <div className="max-w-6xl mx-auto px-6">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Technical Expertise
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-6">
                        Keahlian & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Kompetensi.</span>
                    </h2>
                    <p className="text-slate-800 text-base md:text-lg leading-relaxed">
                        Menguasai Design Graphic dan Motion Graphic untuk menghasilkan karya visual yang kreatif, komunikatif, dan sesuai dengan kebutuhan berbagai media digital maupun cetak.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] transition-all duration-300 group">
                        <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                            <img src="ASSET/design_h8dmhj.jpg" alt="Graphic Design" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-white/10"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <i className="ph-duotone ph-palette"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Desain Grafis & Branding</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Membangun karakter brand dari nol melalui perancangan logo, poster komersial, materi promosi sosial media, hingga kemasan produk yang estetik dan bernilai jual tinggi.
                            </p>
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">Social Media Ads</span>
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">Brand Identity</span>
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">Print Design</span>
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">E-Commerce Design</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] transition-all duration-300 group">
                        <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                            <img src="ASSET/MOTION_2_dzjlye.png" alt="Motion Graphics" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-white/10"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <i className="ph-duotone ph-film-slate"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Motion Graphics & Video</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Menghidupkan desain statis menjadi animasi kinetik yang menarik perhatian. Fokus pada animasi promosi produk, video explainer, transisi mulus, dan visual loop yang memukau.
                            </p>
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">Product Animation</span>
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">Seamless Looping</span>
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">Video Editing</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 rounded-[2rem] bg-white/50 backdrop-blur-lg border border-white/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h4 className="text-slate-800 font-bold text-base mb-1">Software Skills</h4>
                        <p className="text-slate-500 text-xs font-medium">Tools yang saya gunakan untuk mewujudkan ide creative.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <span className="group px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:border-orange-400 transition-colors shadow-sm cursor-default">
                            <img src="https://skillicons.dev/icons?i=ai" alt="Illustrator" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform rounded-sm" />
                            Illustrator
                        </span>
                        <span className="group px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:border-blue-400 transition-colors shadow-sm cursor-default">
                            <img src="https://skillicons.dev/icons?i=ps" alt="Photoshop" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform rounded-sm" />
                            Photoshop
                        </span>
                        <span className="group px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:border-purple-400 transition-colors shadow-sm cursor-default">
                            <img src="https://skillicons.dev/icons?i=ae" alt="After Effects" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform rounded-sm" />
                            After Effects
                        </span>
                        <span className="group px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:border-red-400 transition-colors shadow-sm cursor-default">
                            <img src="https://skillicons.dev/icons?i=pr" alt="Premiere Pro" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform rounded-sm" />
                            Premiere Pro
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;