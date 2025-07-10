import { Head, Link, useForm } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import {
    ChevronLeftIcon,
    PencilIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function ProfilePage({ auth, userProfile, activityLevel, status }) {
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <MobileLayout showAddButton={false}>
            <Head title="Profil" />

            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Link href="/home" className="p-2 -ml-2">
                        <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">Profil</h1>
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
                {/* User Info Section */}
                <div className="bg-white px-4 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{auth.user.name}</h2>
                            <p className="text-gray-500 text-sm">{auth.user.email}</p>
                        </div>
                        <Link
                            href="/profile/edit"
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Target Section */}
                <div className="bg-white mt-6 mx-4 rounded-lg shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900">Target Saya</h3>
                    </div>

                    <Link
                        href="/profile/edit"
                        className="flex items-center justify-between px-4 py-4 hover:bg-gray-50"
                    >
                        <div>
                            <p className="text-gray-900 font-medium">Target Kalori Harian</p>
                            <p className="text-gray-500 text-sm">
                                {userProfile?.daily_calorie_target || 2000} kkal
                            </p>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </Link>
                </div>

                {/* Food Management Section */}
                <div className="bg-white mt-6 mx-4 rounded-lg shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900">Manajemen Makanan</h3>
                    </div>

                    <Link
                        href="/favorites"
                        className="flex items-center justify-between px-4 py-4 hover:bg-gray-50"
                    >
                        <p className="text-gray-900">Daftar Makanan Favorit Saya</p>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </Link>
                </div>

                {/* Security Section */}
                <div className="bg-white mt-6 mx-4 rounded-lg shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900">Keamanan</h3>
                    </div>

                    <Link
                        href="/profile/password"
                        className="flex items-center justify-between px-4 py-4 hover:bg-gray-50"
                    >
                        <p className="text-gray-900">Ubah Password</p>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </Link>
                </div>

                {/* Profile Details (if available) */}
                {userProfile && (
                    <div className="bg-white mt-6 mx-4 rounded-lg shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900">Detail Profil</h3>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Jenis Kelamin</span>
                                <span className="text-gray-900">
                                    {userProfile.gender === 'male' ? 'Pria' :
                                     userProfile.gender === 'female' ? 'Wanita' : 'Lainnya'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Usia</span>
                                <span className="text-gray-900">{userProfile.age} tahun</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Berat Badan</span>
                                <span className="text-gray-900">{userProfile.weight} kg</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tinggi Badan</span>
                                <span className="text-gray-900">{userProfile.height} cm</span>
                            </div>
                            {userProfile.bmi && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">BMI</span>
                                    <span className="text-gray-900">{userProfile.bmi.toFixed(1)}</span>
                                </div>
                            )}
                            {activityLevel && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tingkat Aktivitas</span>
                                    <span className="text-gray-900">{activityLevel.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Logout Button */}
                <div className="mx-4 mt-8">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        Keluar
                    </button>
                </div>
            </div>
        </MobileLayout>
    );
}
