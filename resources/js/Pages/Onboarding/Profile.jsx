import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Profile() {
    const { data, setData, post, processing, errors } = useForm({
        gender: '',
        age: '',
        weight: '',
        height: '',
    });

    const [selectedGender, setSelectedGender] = useState('');

    const submit = (e) => {
        e.preventDefault();
        post(route('onboarding.profile'));
    };

    const selectGender = (gender) => {
        setSelectedGender(gender);
        setData('gender', gender);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Head title="Sedikit tentang Kamu" />

            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Header with back arrow */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href={route('register')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Sedikit tentang Kamu</h1>
                        <div className="w-6"></div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Gender Selection */}
                        <div>
                            <div className="space-y-4">
                                {/* Male Option */}
                                <div
                                    onClick={() => selectGender('male')}
                                    className={`bg-orange-200 rounded-2xl p-6 cursor-pointer transition-all ${
                                        selectedGender === 'male' ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="w-32 h-40 bg-orange-300 rounded-lg flex items-center justify-center">
                                            <span className="text-6xl">🧍‍♂️</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pria</h3>
                                    <p className="text-gray-600 text-sm">Saya seorang pria</p>
                                </div>

                                {/* Female Option */}
                                <div
                                    onClick={() => selectGender('female')}
                                    className={`bg-orange-200 rounded-2xl p-6 cursor-pointer transition-all ${
                                        selectedGender === 'female' ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="w-32 h-40 bg-orange-300 rounded-lg flex items-center justify-center">
                                            <span className="text-6xl">🧍‍♀️</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Wanita</h3>
                                    <p className="text-gray-600 text-sm">Saya seorang wanita</p>
                                </div>
                            </div>
                            {errors.gender && (
                                <p className="text-red-500 text-xs mt-2">{errors.gender}</p>
                            )}
                        </div>

                        {/* Age Input */}
                        <div>
                            <label className="block text-lg font-bold text-gray-900 mb-2">Usia</label>
                            <input
                                type="number"
                                value={data.age}
                                onChange={e => setData('age', e.target.value)}
                                placeholder="Masukkan usia"
                                className="w-full px-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                            />
                            {errors.age && (
                                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                            )}
                        </div>

                        {/* Weight Input */}
                        <div>
                            <label className="block text-lg font-bold text-gray-900 mb-2">Berat Badan (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={data.weight}
                                onChange={e => setData('weight', e.target.value)}
                                placeholder="Masukkan berat badan"
                                className="w-full px-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                            />
                            {errors.weight && (
                                <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                            )}
                        </div>

                        {/* Height Input */}
                        <div>
                            <label className="block text-lg font-bold text-gray-900 mb-2">Tinggi Badan (cm)</label>
                            <input
                                type="number"
                                value={data.height}
                                onChange={e => setData('height', e.target.value)}
                                placeholder="Masukkan tinggi badan"
                                className="w-full px-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                            />
                            {errors.height && (
                                <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
                        >
                            {processing ? 'Memproses...' : 'Lanjut'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
