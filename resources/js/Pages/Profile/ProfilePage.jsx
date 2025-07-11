import { Head, Link, useForm } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import { theme, variants } from '@/constants/theme';
import {
    ChevronLeftIcon,
    PencilIcon,
    ChevronRightIcon,
    UserIcon,
    HeartIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    ScaleIcon,
    CalendarDaysIcon,
    FireIcon
} from '@heroicons/react/24/outline';

export default function ProfilePage({ auth, userProfile, activityLevel, status }) {
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <MobileLayout showAddButton={false}>
            <Head title="Profil" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                {/* Enhanced Header */}
                <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-200">
                    <div className="flex items-center justify-between px-4 py-4">
                        <Link href="/home" className="p-2 -ml-2 hover:bg-green-50 rounded-lg transition-colors">
                            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                        </Link>
                        <h1 className="text-lg font-semibold text-gray-900">Profil Saya</h1>
                        <div className="w-10"></div>
                    </div>
                </div>

                <div className="px-4 pb-20 space-y-6">
                    {/* Success Message */}
                    {status && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-green-800 text-sm font-medium flex items-center">
                                <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
                                {status}
                            </p>
                        </div>
                    )}

                    {/* Enhanced User Info Section */}
                    <div className={`${variants.card.elevated} p-6 mt-6`}>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                <UserIcon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900">{auth.user.name}</h2>
                                <p className="text-gray-600 text-sm">{auth.user.email}</p>
                                <div className="flex items-center mt-2 space-x-2">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                                    <span className="text-sm text-slate-600 font-medium">Member Aktif</span>
                                </div>
                            </div>
                            <Link
                                href="/profile/edit"
                                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <PencilIcon className="h-5 w-5 text-slate-600" />
                            </Link>
                        </div>
                    </div>

                    {/* Enhanced Target Section */}
                    <div className={`${variants.card.elevated} overflow-hidden`}>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <FireIcon className="w-5 h-5 text-white" />
                                <h3 className="text-lg font-bold text-white">Target Saya</h3>
                            </div>
                        </div>

                        <Link
                            href="/profile/edit"
                            className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <FireIcon className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-semibold">Target Kalori Harian</p>
                                    <p className="text-2xl font-bold text-slate-600">
                                        {userProfile?.daily_calorie_target || 2000} <span className="text-sm text-gray-500">kkal</span>
                                    </p>
                                </div>
                            </div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-slate-500 transition-colors" />
                        </Link>
                    </div>

                    {/* Enhanced Food Management Section */}
                    <div className={`${variants.card.elevated} overflow-hidden`}>
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <HeartIcon className="w-5 h-5 text-white" />
                                <h3 className="text-lg font-bold text-white">Manajemen Makanan</h3>
                            </div>
                        </div>

                        <Link
                            href="/favorites"
                            className="flex items-center justify-between p-6 hover:bg-pink-50 transition-colors group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                    <HeartIcon className="w-6 h-6 text-pink-500" />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-semibold">Makanan Favorit</p>
                                    <p className="text-sm text-gray-600">Kelola daftar makanan favorit</p>
                                </div>
                            </div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                        </Link>
                    </div>

                    {/* Enhanced Security Section */}
                    <div className={`${variants.card.elevated} overflow-hidden`}>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <ShieldCheckIcon className="w-5 h-5 text-white" />
                                <h3 className="text-lg font-bold text-white">Keamanan</h3>
                            </div>
                        </div>

                        <Link
                            href="/profile/password"
                            className="flex items-center justify-between p-6 hover:bg-blue-50 transition-colors group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <ShieldCheckIcon className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-semibold">Ubah Password</p>
                                    <p className="text-sm text-gray-600">Perbarui kata sandi akun</p>
                                </div>
                            </div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </Link>
                    </div>

                    {/* Enhanced Profile Details */}
                    {userProfile && (
                        <div className={`${variants.card.elevated} overflow-hidden`}>
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <UserIcon className="w-5 h-5 text-white" />
                                    <h3 className="text-lg font-bold text-white">Detail Profil</h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                                        <UserIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Jenis Kelamin</p>
                                        <p className="font-bold text-gray-900">
                                            {userProfile.gender === 'male' ? 'Pria' :
                                             userProfile.gender === 'female' ? 'Wanita' : 'Lainnya'}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                                        <CalendarDaysIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Usia</p>
                                        <p className="font-bold text-gray-900">{userProfile.age} tahun</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-green-50 rounded-xl">
                                        <ScaleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Berat Badan</p>
                                        <p className="font-bold text-gray-900">{userProfile.weight} kg</p>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                                        <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">H</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Tinggi Badan</p>
                                        <p className="font-bold text-gray-900">{userProfile.height} cm</p>
                                    </div>
                                </div>

                                {userProfile.bmi && (
                                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                                        <div className="w-12 h-12 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                            <span className="text-white font-bold">BMI</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Body Mass Index</p>
                                        <p className="text-2xl font-bold text-gray-900">{userProfile.bmi.toFixed(1)}</p>
                                    </div>
                                )}

                                {activityLevel && (
                                    <div className="text-center p-4 bg-emerald-50 rounded-xl">
                                        <FireIcon className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Tingkat Aktivitas</p>
                                        <p className="font-bold text-gray-900">{activityLevel.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Enhanced Logout Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            <span>Keluar</span>
                        </button>
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
