import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Head title="Masuk" />

            {/* Mobile-first container that stays mobile width even on desktop */}
            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Logo/Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href={route('welcome')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">KaloriKu</h1>
                        <div className="w-6"></div> {/* Spacer for centering */}
                    </div>

                    {status && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                                placeholder="Email"
                                className="w-full px-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                                autoFocus
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
                                className="w-full px-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors mt-6"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Belum punya akun? <Link href={route('register')} className="text-blue-500 hover:underline">daftar disini.</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
