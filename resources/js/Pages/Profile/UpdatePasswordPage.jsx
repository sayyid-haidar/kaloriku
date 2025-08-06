import { Head, Link, useForm } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import {
    ChevronLeftIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function UpdatePasswordPage({ status }) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('profile.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <MobileLayout showAddButton={false}>
            <Head title="Ubah Password" />

            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Link href="/profile" className="p-2 -ml-2">
                        <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">Ubah Password</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Success Message */}
                {status && (
                    <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">{status}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="p-4 space-y-6">

                    {/* Current Password */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password Saat Ini
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={data.current_password}
                                        onChange={e => setData('current_password', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Masukkan password saat ini"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.current_password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Masukkan password baru"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Konfirmasi Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Konfirmasi password baru"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Persyaratan Password</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span>Minimal 8 karakter</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span>Kombinasi huruf besar dan kecil</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span>Minimal 1 angka</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span>Minimal 1 karakter khusus</span>
                            </li>
                        </ul>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Ubah Password'}
                        </button>
                    </div>
                </form>
            </div>
        </MobileLayout>
    );
}
