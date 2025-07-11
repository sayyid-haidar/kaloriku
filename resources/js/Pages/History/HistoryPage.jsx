import { Head, router } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import { theme, variants } from '@/constants/theme';
import {
    ChevronLeftIcon,
    ClockIcon,
    FireIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    TrophyIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function History({ weeklyData, dailySummaries, totalCalories }) {
    const maxCalories = Math.max(...weeklyData.map(day => day.calories));

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const getDayColor = (calories, maxCalories) => {
        if (calories === 0) return 'from-gray-300 to-gray-400';
        const percentage = (calories / maxCalories) * 100;
        if (percentage >= 80) return 'from-green-400 to-green-600';
        if (percentage >= 60) return 'from-yellow-400 to-yellow-600';
        if (percentage >= 40) return 'from-orange-400 to-orange-600';
        return 'from-red-400 to-red-600';
    };

    return (
        <MobileLayout>
            <Head title="Riwayat Kalori" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                {/* Clean Minimalist Header */}
                <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white p-6 rounded-b-3xl shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <button
                            onClick={() => router.visit('/home')}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold flex items-center space-x-2">
                                <ClockIcon className="w-7 h-7 text-green-100" />
                                <span>Riwayat Kalori</span>
                            </h1>
                            <p className="text-green-100 text-sm flex items-center space-x-1 mt-1">
                                <CalendarDaysIcon className="w-4 h-4" />
                                <span>Perjalanan kesehatan Anda</span>
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
                                <ChartBarIcon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-xs text-slate-200">Riwayat</p>
                        </div>
                    </div>

                    {/* Clean Total Calories Card */}
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <TrophyIcon className="w-5 h-5 text-amber-300" />
                                    <h2 className="text-sm text-slate-200">Total Kalori</h2>
                                </div>
                                <p className="text-4xl font-bold text-white mb-1">
                                    {formatNumber(totalCalories)}
                                </p>
                                <p className="text-sm text-slate-300 flex items-center space-x-1">
                                    <SparklesIcon className="w-4 h-4" />
                                    <span>7 Hari Terakhir</span>
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                    <FireIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-6 space-y-6">
                    {/* Enhanced Weekly Chart */}
                    <div className={`${variants.card.elevated} p-6`}>
                        <div className="flex items-center space-x-2 mb-6">
                            <ChartBarIcon className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900">Grafik Mingguan</h3>
                        </div>

                        <div className="flex items-end justify-between h-48 mb-4 bg-gray-50 rounded-xl p-4">
                            {weeklyData.map((day, index) => {
                                const height = maxCalories > 0 ? (day.calories / maxCalories) * 100 : 0;
                                return (
                                    <div key={index} className="flex flex-col items-center flex-1">
                                        <div className="flex items-end h-32 w-full justify-center">
                                            <div
                                                className={`w-8 bg-gradient-to-t ${getDayColor(day.calories, maxCalories)} rounded-t-lg shadow-sm transition-all duration-500 hover:scale-105`}
                                                style={{
                                                    height: `${Math.max(height, day.calories > 0 ? 8 : 4)}%`,
                                                    minHeight: day.calories > 0 ? '8px' : '4px'
                                                }}
                                                title={`${day.day}: ${formatNumber(day.calories)} kalori`}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium mt-2 text-center">
                                            {day.day}
                                        </span>
                                        <span className="text-xs text-gray-400 text-center">
                                            {formatNumber(day.calories)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Enhanced Daily Summary */}
                    <div className={`${variants.card.elevated} p-6`}>
                        <div className="flex items-center space-x-2 mb-6">
                            <CalendarDaysIcon className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-900">Ringkasan Harian</h3>
                        </div>

                        {dailySummaries.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClockIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Belum ada data</h4>
                                <p className="text-gray-500">Mulai catat kalori untuk melihat riwayat</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dailySummaries.map((summary, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 hover:shadow-md transition-all group">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                                                <CalendarDaysIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                    {summary.day_name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {summary.formatted_date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-2">
                                                <FireIcon className="w-5 h-5 text-orange-500" />
                                                <div>
                                                    <p className="font-bold text-lg text-gray-900">
                                                        {formatNumber(summary.calories)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">kalori</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
