import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="KaloriKu - Aplikasi Pencatat Kalori Terpilih di Indonesia" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-8">
                    <div className="flex items-center space-x-3">
                        {/* App Logo - Text Only */}
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">KaloriKu</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-green-600 hover:text-green-800 px-4 py-2 font-medium transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                                >
                                    Daftar Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative px-6 pt-20 pb-32 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    Hidup Sehat Jadi{' '}
                                    <span className="text-green-600">Lebih Mudah</span>
                                </h1>
                                <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                                    Aplikasi pencatat kalori pertama di Indonesia yang{' '}
                                    <strong>benar-benar sederhana</strong>. Tidak ribet, tidak bingung,
                                    fokus pada hasil nyata untuk hidup yang lebih sehat.
                                </p>

                                {/* New Launch Badge & Value Props */}
                                <div className="mt-8">
                                    <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                        🎉 Baru Diluncurkan - Join Early Adopters!
                                    </div>
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">30 detik</div>
                                            <div className="text-sm text-gray-500">Pencatatan Makanan</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">100%</div>
                                            <div className="text-sm text-gray-500">Gratis Selamanya</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">🇮🇩</div>
                                            <div className="text-sm text-gray-500">Made in Indonesia</div>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href={route('register')}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        Mulai Hidup Sehat Sekarang
                                    </Link>
                                    <Link
                                        href="#how-it-works"
                                        className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                                    >
                                        Lihat Cara Kerja
                                    </Link>
                                </div>

                                {/* Trust Indicators */}
                                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                                        100% Gratis
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                                        Tanpa Iklan
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                                        Data Aman
                                    </span>
                                </div>
                            </div>

                            {/* Right Content - Hero Image */}
                            <div className="relative">
                                <div className="relative mx-auto w-72 h-[580px] lg:w-80 lg:h-[640px]">
                                    {/* Phone Mockup */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 rounded-[3rem] shadow-2xl p-2">
                                        {/* Phone Screen Bezel */}
                                        <div className="w-full h-full bg-black rounded-[2.5rem] p-1">
                                            {/* Notch */}
                                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10"></div>

                                            {/* Screen Content */}
                                            <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                                                {/* Status Bar */}
                                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-12 flex items-center justify-between px-6 pt-2">
                                                    <div className="text-white text-xs font-medium">9:41</div>
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-4 h-2 bg-white rounded-sm opacity-80"></div>
                                                        <div className="w-1 h-3 bg-white rounded-sm opacity-60"></div>
                                                    </div>
                                                </div>

                                                {/* App Content */}
                                                <div className="flex-1 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 px-4 py-4">
                                                    {/* Header */}
                                                    <div className="text-white mb-4">
                                                        <h3 className="text-lg font-bold">Selamat Siang!</h3>
                                                        <p className="text-slate-200 text-sm">Haidar</p>
                                                    </div>

                                                    {/* Calorie Progress Card */}
                                                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
                                                        <div className="text-white text-center">
                                                            <p className="text-xs text-slate-200 mb-1">Kalori Hari Ini</p>
                                                            <p className="text-2xl font-bold">1,420</p>
                                                            <p className="text-xs text-slate-300">dari 2,000 target</p>

                                                            {/* Progress Bar */}
                                                            <div className="bg-white/20 rounded-full h-2 mt-3 overflow-hidden">
                                                                <div className="bg-green-400 h-full rounded-full" style={{width: '71%'}}></div>
                                                            </div>
                                                            <p className="text-xs text-slate-300 mt-1">71% • Sisa 580 kal</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content Area */}
                                                <div className="flex-1 bg-gray-50 px-4 py-3 space-y-3">
                                                    {/* Recent Foods */}
                                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                                        <div className="text-xs font-medium text-gray-700 mb-2">Makanan Hari Ini</div>

                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-sm">🌅</span>
                                                                    <div>
                                                                        <div className="text-xs font-medium">Nasi Uduk</div>
                                                                        <div className="text-xs text-gray-500">08:30</div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs font-bold text-orange-600">350 kal</div>
                                                            </div>

                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-sm">☀️</span>
                                                                    <div>
                                                                        <div className="text-xs font-medium">Ayam Geprek</div>
                                                                        <div className="text-xs text-gray-500">12:15</div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs font-bold text-orange-600">520 kal</div>
                                                            </div>

                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-sm">🍪</span>
                                                                    <div>
                                                                        <div className="text-xs font-medium">Kopi & Biskuit</div>
                                                                        <div className="text-xs text-gray-500">15:30</div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs font-bold text-orange-600">180 kal</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Weekly Progress */}
                                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                                        <div className="text-xs font-medium text-gray-700 mb-2">Progress 7 Hari</div>
                                                        <div className="flex justify-between items-end h-8 space-x-1">
                                                            {[40, 65, 80, 90, 75, 71, 45].map((height, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`flex-1 rounded-t transition-all ${
                                                                        i === 5 ? 'bg-blue-500' :
                                                                        height >= 70 ? 'bg-green-400' :
                                                                        height >= 40 ? 'bg-yellow-400' : 'bg-gray-300'
                                                                    }`}
                                                                    style={{height: `${height}%`, minHeight: '4px'}}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                            {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
                                                                <div key={i} className={i === 5 ? 'text-blue-600 font-medium' : ''}>{day}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Navigation */}
                                                <div className="bg-white border-t border-gray-100 px-2 py-3">
                                                    <div className="flex justify-around items-center">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs">🏠</div>
                                                            <div className="text-xs text-orange-500 font-medium mt-1">Beranda</div>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-gray-600 text-xs">📊</div>
                                                            <div className="text-xs text-gray-400 mt-1">Statistik</div>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">+</div>
                                                            <div className="text-xs text-orange-500 font-medium mt-1">Tambah</div>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-gray-600 text-xs">❤️</div>
                                                            <div className="text-xs text-gray-400 mt-1">Favorit</div>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-gray-600 text-xs">👤</div>
                                                            <div className="text-xs text-gray-400 mt-1">Profil</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Elements */}
                                    <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 animate-bounce">
                                        <div className="text-2xl">🎯</div>
                                    </div>
                                    <div className="absolute top-32 -left-6 bg-white rounded-xl shadow-xl p-3 animate-pulse">
                                        <div className="text-2xl">💪</div>
                                    </div>
                                    <div className="absolute bottom-20 -right-6 bg-white rounded-xl shadow-xl p-3 animate-bounce delay-500">
                                        <div className="text-2xl">📱</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decorations */}
                    <div className="absolute top-20 right-10 w-20 h-20 bg-green-200 rounded-full opacity-60 animate-pulse"></div>
                    <div className="absolute bottom-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-60 animate-pulse delay-1000"></div>
                </section>

                {/* Problem Section */}
                <section className="py-20 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Mengapa 8 dari 10 Orang Gagal Diet?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Studi menunjukkan bahwa tingkat obesitas di Indonesia terus meningkat.
                                Masalahnya bukan pada niat, tapi pada <strong>tool yang terlalu rumit</strong>.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border">
                                <div className="text-4xl mb-4">😵‍💫</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Aplikasi Terlalu Rumit</h3>
                                <p className="text-gray-600">
                                    Input data berlebihan, fitur membingungkan, dan interface yang tidak intuitif
                                    membuat pengguna cepat menyerah.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border">
                                <div className="text-4xl mb-4">⏰</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Proses Pencatatan Lama</h3>
                                <p className="text-gray-600">
                                    Butuh 5-10 menit hanya untuk mencatat satu makanan.
                                    Siapa yang punya waktu sebanyak itu setiap hari?
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border">
                                <div className="text-4xl mb-4">🔄</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Tidak Ada Motivasi</h3>
                                <p className="text-gray-600">
                                    Tanpa feedback yang jelas dan motivasi berkelanjutan,
                                    kebiasaan sehat tidak terbentuk.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution Section */}
                <section id="how-it-works" className="py-20 bg-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                KaloriKu: Solusi yang <span className="text-green-600">Benar-benar Simple</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Kami percaya hidup sehat itu sederhana. Fokus pada yang penting,
                                buang yang tidak perlu.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-12">
                            <div className="text-center">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">📝</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Catat Cepat</h3>
                                <p className="text-gray-600 text-lg">
                                    Hanya perlu 30 detik untuk mencatat makanan.
                                    Ketik nama makanan, masukkan kalori, selesai!
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Lihat Progress</h3>
                                <p className="text-gray-600 text-lg">
                                    Dashboard sederhana menampilkan target vs pencapaian kalori harian.
                                    Visual yang jelas, motivasi yang nyata.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">🎯</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Capai Target</h3>
                                <p className="text-gray-600 text-lg">
                                    Dengan konsistensi pencatatan yang mudah,
                                    target berat badan ideal jadi lebih mudah dicapai.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-green-50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Kenapa Pilih KaloriKu?
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="text-3xl mb-4">⚡</div>
                                <h3 className="font-bold text-gray-900 mb-2">Super Cepat</h3>
                                <p className="text-gray-600 text-sm">Pencatatan makanan hanya butuh 30 detik</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm relative">
                                <div className="text-3xl mb-4">🇮🇩</div>
                                <h3 className="font-bold text-gray-900 mb-2">Makanan Lokal</h3>
                                <p className="text-gray-600 text-sm">Database makanan Indonesia yang lengkap</p>
                                {/* Coming Soon Badge */}
                                <div className="absolute -top-2 -right-2">
                                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        Soon
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="text-3xl mb-4">💯</div>
                                <h3 className="font-bold text-gray-900 mb-2">100% Gratis</h3>
                                <p className="text-gray-600 text-sm">Tidak ada biaya tersembunyi atau premium</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="text-3xl mb-4">🔒</div>
                                <h3 className="font-bold text-gray-900 mb-2">Data Aman</h3>
                                <p className="text-gray-600 text-sm">Privasi dan keamanan data terjamin</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Siap Memulai Hidup Sehat?
                        </h2>
                        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                            Jadilah bagian dari early adopters yang memulai perjalanan hidup sehat dengan aplikasi buatan Indonesia yang simple dan efektif.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-block bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Daftar Gratis Sekarang
                        </Link>
                        <p className="text-green-200 text-sm mt-4">
                            Tidak perlu kartu kredit • Setup 2 menit • Langsung bisa digunakan
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-2">
                                <div className="text-2xl font-bold text-green-400 mb-4">KaloriKu</div>
                                <p className="text-gray-300 mb-4 max-w-md">
                                    Aplikasi pencatat kalori pertama di Indonesia yang benar-benar sederhana.
                                    Dibuat untuk membantu Anda hidup lebih sehat.
                                </p>
                                <div className="text-sm text-gray-400">
                                    © 2025 KaloriKu. Semua hak dilindungi.
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Produk</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li><a href="#" className="hover:text-white transition-colors">Fitur</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Cara Kerja</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Perusahaan</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Privasi</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
