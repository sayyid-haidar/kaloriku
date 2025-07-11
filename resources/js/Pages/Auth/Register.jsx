import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4">
            <Head title="Daftar" />

            {/* Mobile-first container that stays mobile width even on desktop */}
            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
                    {/* Header with back arrow */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href={route('welcome')}
                            className="text-green-600 hover:text-green-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Buat Akun</h1>
                        <div className="w-6"></div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                placeholder="Nama Lengkap"
                                className="w-full px-4 py-4 bg-green-50 border border-green-200 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                                placeholder="Email"
                                className="w-full px-4 py-4 bg-green-50 border border-green-200 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                                placeholder="Password"
                                className="w-full px-4 py-4 bg-green-50 border border-green-200 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all mt-6 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            {processing ? 'Memproses...' : 'Daftar'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Sudah punya akun? <Link href={route('login')} className="text-green-600 hover:text-green-800 font-medium hover:underline">masuk disini.</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
