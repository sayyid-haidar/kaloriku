import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import MobileLayout from '@/Layouts/MobileLayout';
import { theme, variants } from '@/constants/theme';
import {
    ChartBarIcon,
    TrophyIcon,
    FireIcon,
    CalendarIcon,
    ClockIcon,
    ArrowLeftIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ListBulletIcon,
    EyeIcon,
    SparklesIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

export default function WeeklyStats({
    weekData,
    weeklySummary,
    weeklyFavorites,
    mealDistribution,
    calorieTarget,
    userProfile,
    recentHistory = []
}) {
    const [selectedDay, setSelectedDay] = useState(null);
    const [activeTab, setActiveTab] = useState('statistics');

    // Calculate streak
    const currentStreak = weekData.reverse().reduce((streak, day) => {
        if (day.total_calories > 0) {
            return streak + 1;
        }
        return 0;
    }, 0);

    // Reverse back for display
    weekData.reverse();

    const getStatusColor = (status) => {
        switch (status) {
            case 'good': return 'bg-green-500';
            case 'under': return 'bg-yellow-500';
            case 'over': return 'bg-red-500';
            default: return 'bg-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'good': return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
            case 'under': return <ArrowTrendingDownIcon className="w-4 h-4 text-yellow-600" />;
            case 'over': return <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />;
            default: return <ClockIcon className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const formatPercentage = (percentage) => {
        return Math.round(percentage * 100) / 100; // Round to 2 decimal places
    };

    const getMealIcon = (mealType) => {
        const icons = {
            'breakfast': '🌅',
            'lunch': '☀️',
            'dinner': '🌙',
            'snack': '🍪',
        };
        return icons[mealType] || '🍽️';
    };

    return (
        <MobileLayout>
            <Head title="Statistik & Riwayat - kaloriKu" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                {/* Clean Minimalist Header */}
                <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-green-100 p-6 rounded-b-3xl shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <button
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            onClick={() => router.visit('/home')}
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold flex items-center space-x-2">
                                <ChartBarIcon className="w-7 h-7 text-white" />
                                <span>Statistik & Riwayat</span>
                            </h1>
                            <p className="text-white/90 text-sm flex items-center space-x-1 mt-1">
                                <SparklesIcon className="w-4 h-4" />
                                <span>Data dan progress kalori</span>
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
                                <ChartBarIcon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-xs text-white/90">Statistik</p>
                        </div>
                    </div>

                    {/* Enhanced Tab Navigation */}
                    <div className="flex bg-white/10 rounded-xl p-1 mb-4">
                        <button
                            onClick={() => setActiveTab('statistics')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                                activeTab === 'statistics'
                                    ? 'bg-white text-indigo-600 shadow-lg'
                                    : 'text-white hover:bg-white/20'
                            }`}
                        >
                            <ChartBarIcon className="w-5 h-5" />
                            <span>Statistik</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                                activeTab === 'history'
                                    ? 'bg-white text-indigo-600 shadow-lg'
                                    : 'text-white hover:bg-white/20'
                            }`}
                        >
                            <ListBulletIcon className="w-5 h-5" />
                            <span>Riwayat</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 space-y-6 mt-6">
                    {/* Statistics Tab */}
                    {activeTab === 'statistics' && (
                        <>
                            {/* Enhanced Weekly Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`${variants.card.elevated} p-5`}>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <FireIcon className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">Total Kalori</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(weeklySummary.total_calories)}</p>
                                    <p className="text-xs text-gray-500">Target: {formatNumber(weeklySummary.weekly_target)}</p>
                                </div>

                                <div className={`${variants.card.elevated} p-5`}>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <TrophyIcon className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">Konsistensi</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{weeklySummary.consistency_score}%</p>
                                    <p className="text-xs text-gray-500">{weeklySummary.active_days}/7 hari aktif</p>
                                </div>
                            </div>

                            {/* Enhanced Weekly Progress Bar */}
                            <div className={`${variants.card.elevated} p-6`}>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <BoltIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-lg font-bold text-gray-900">Progress Mingguan</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600">{formatPercentage(weeklySummary.weekly_percentage)}%</span>
                                </div>
                                <div className="bg-gray-200 rounded-full h-4 overflow-hidden mb-3 shadow-inner">
                                    <div
                                        className={`h-full transition-all duration-1000 ${
                                            weeklySummary.weekly_percentage > 100
                                                ? 'bg-gradient-to-r from-red-400 to-red-600'
                                                : weeklySummary.weekly_percentage >= 90
                                                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                                                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                        }`}
                                        style={{ width: `${Math.min(weeklySummary.weekly_percentage, 100)}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 flex items-center space-x-1">
                                    {weeklySummary.weekly_percentage > 100 ? (
                                        <>
                                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                                            <span>Kelebihan {formatPercentage(weeklySummary.weekly_percentage - 100)}% dari target</span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                                            <span>{formatPercentage(100 - weeklySummary.weekly_percentage)}% lagi untuk mencapai target</span>
                                        </>
                                    )}
                                </p>
                            </div>

                        {/* Daily Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <CalendarIcon className="w-5 h-5 text-blue-600" />
                                <span>Breakdown Harian</span>
                            </h3>

                            <div className="space-y-3">
                                {weekData.map((day, index) => (
                                    <div
                                        key={day.date}
                                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                            day.is_today
                                                ? 'border-green-500 bg-green-50'
                                                : selectedDay === index
                                                    ? 'border-indigo-300 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-500 font-medium">{day.day_name}</p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {new Date(day.date).getDate()}
                                                    </p>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        {getStatusIcon(day.status)}
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {formatNumber(day.total_calories)} kal
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-300 ${getStatusColor(day.status)}`}
                                                            style={{ width: `${Math.min(day.percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">{day.percentage}%</p>
                                                <p className="text-xs text-gray-500">{day.entries_count} makanan</p>
                                            </div>
                                        </div>

                                        {/* Expanded Day Details */}
                                        {selectedDay === index && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {Object.entries(day.meals || {}).map(([mealType, calories]) => (
                                                        <div key={mealType} className="bg-gray-50 rounded-lg p-3">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className="text-lg">{getMealIcon(mealType)}</span>
                                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                                    {mealType}
                                                                </span>
                                                            </div>
                                                            <p className="text-lg font-bold text-gray-900">
                                                                {formatNumber(calories)} kal
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Meal Distribution */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <ClockIcon className="w-5 h-5 text-green-600" />
                                <span>Distribusi Makanan</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(mealDistribution).map(([mealType, data]) => (
                                    <div key={mealType} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-lg">{getMealIcon(mealType)}</span>
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {mealType}
                                            </span>
                                        </div>
                                        <p className="text-xl font-bold text-gray-900">
                                            {formatNumber(data.total_calories)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {data.percentage}% • {data.count} kali
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Favorites */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                                <span>Makanan Favorit Minggu Ini</span>
                            </h3>

                            <div className="space-y-3">
                                {weeklyFavorites.slice(0, 5).map((food, index) => (
                                    <div key={food.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">#{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{food.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {food.count} kali • {formatNumber(food.total_calories)} kal
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-green-600">
                                                {Math.round(food.avg_calories)} kal/porsi
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <>
                        {/* History Content */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <ListBulletIcon className="w-5 h-5 text-blue-600" />
                                <span>Riwayat 30 Hari Terakhir</span>
                            </h3>

                            {recentHistory && recentHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {recentHistory.map((entry, index) => (
                                        <div key={entry.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div className="p-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                            entry.meal_type === 'breakfast' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                                                            entry.meal_type === 'lunch' ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white' :
                                                            entry.meal_type === 'dinner' ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white' :
                                                            'bg-gradient-to-r from-green-400 to-blue-400 text-white'
                                                        }`}>
                                                            <FireIcon className="w-6 h-6" />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-gray-900 text-lg truncate">{entry.food_name}</h4>
                                                                <div className="mt-1 flex items-center space-x-2">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                                                        entry.meal_type === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                                                                        entry.meal_type === 'lunch' ? 'bg-orange-100 text-orange-800' :
                                                                        entry.meal_type === 'dinner' ? 'bg-green-100 text-green-800' :
                                                                        'bg-green-100 text-green-800'
                                                                    }`}>
                                                                        {entry.meal_type}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">{entry.quantity} {entry.unit}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex-shrink-0 text-right ml-4">
                                                                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-2 rounded-lg">
                                                                    <p className="font-bold text-lg leading-none">
                                                                        {Math.round(entry.calories)}
                                                                    </p>
                                                                    <p className="text-xs opacity-90">kalori</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                                            <div className="flex items-center space-x-2">
                                                                <ClockIcon className="w-4 h-4" />
                                                                <span>{entry.formatted_date}</span>
                                                                <span>•</span>
                                                                <span>{entry.formatted_time}</span>
                                                            </div>

                                                            <div>
                                                                {entry.days_ago === 0 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                                        Hari ini
                                                                    </span>
                                                                )}
                                                                {entry.days_ago === 1 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        Kemarin
                                                                    </span>
                                                                )}
                                                                {entry.days_ago > 1 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                        {entry.days_ago} hari lalu
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <EyeIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-2">Belum ada riwayat makanan</p>
                                    <p className="text-sm text-gray-400">Mulai tambahkan makanan untuk melihat riwayat</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
                </div>
            </div>
        </MobileLayout>
    );
}
