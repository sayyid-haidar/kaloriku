import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MobileLayout from '@/Layouts/MobileLayout';
import {
    PlusIcon,
    FireIcon,
    TrophyIcon,
    ChartBarIcon,
    HeartIcon,
    ClockIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartSolidIcon,
} from '@heroicons/react/24/solid';

export default function HomePage({
    user,
    calories,
    mealCalories,
    todayFoods,
    favoriteFoods,
    weeklyStreak,
    weeklyData,
    userProfile,
    showCalorieWarning,
    warningMessage
}) {
    const [showAlert, setShowAlert] = useState(showCalorieWarning);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
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

    const getMealLabel = (mealType) => {
        const labels = {
            'breakfast': 'Sarapan',
            'lunch': 'Makan Siang',
            'dinner': 'Makan Malam',
            'snack': 'Snack',
        };
        return labels[mealType] || mealType;
    };

    const getCalorieStatusColor = () => {
        if (calories.is_over_target) return 'text-red-600';
        if (calories.percentage >= 90) return 'text-orange-600';
        if (calories.percentage >= 70) return 'text-green-600';
        return 'text-blue-600';
    };

    const getProgressBarColor = () => {
        if (calories.is_over_target) return 'bg-red-500';
        if (calories.percentage >= 90) return 'bg-orange-500';
        if (calories.percentage >= 70) return 'bg-green-500';
        return 'bg-blue-500';
    };

    const quickAddFavorite = (food) => {
        const estimatedCalories = food.calories_per_100g ? Math.round(food.calories_per_100g) : 100;

        router.post(route('calorie.quick-add'), {
            food_name: food.name,
            calories: estimatedCalories,
            notes: `${food.brand ? food.brand + ' - ' : ''}Quick add dari favorit`,
            meal_type: getCurrentMealType()
        }, {
            onSuccess: () => {
                // Success message will be handled by Laravel flash message
                router.reload({ only: ['calories', 'todayFoods', 'mealCalories'] });
            },
            onError: (errors) => {
                console.error('Quick add failed:', errors);
            }
        });
    };

    const addToFavorites = async (foodName, calories) => {
        try {
            const response = await fetch('/favorites/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    food_name: foodName,
                    calories_per_100g: calories
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Makanan berhasil ditambahkan ke favorit!');
            } else {
                throw new Error(result.message || 'Gagal menambahkan ke favorit');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('Gagal menambahkan ke favorit. Silakan coba lagi.');
        }
    };

    const getCurrentMealType = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return 'breakfast';
        if (hour >= 11 && hour < 15) return 'lunch';
        if (hour >= 15 && hour < 20) return 'dinner';
        return 'snack';
    };

    useEffect(() => {
        if (showCalorieWarning) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [showCalorieWarning]);

    return (
        <MobileLayout>
            <Head title={`Dashboard - ${user.greeting}, ${user.name}!`} />

            {/* Calorie Warning Alert */}
            {showAlert && showCalorieWarning && (
                <div className="fixed top-4 left-4 right-4 z-50">
                    <div className={`${
                        calories.is_over_target ? 'bg-red-100 border-red-400 text-red-700' : 'bg-orange-100 border-orange-400 text-orange-700'
                    } border px-4 py-3 rounded-xl shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                                <span className="text-sm font-medium">{warningMessage}</span>
                            </div>
                            <button
                                onClick={() => setShowAlert(false)}
                                className="text-lg font-bold hover:opacity-75"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Header with Greeting */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 rounded-b-3xl shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">{user.greeting}!</h1>
                            <p className="text-blue-100 text-lg">{user.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-100">Streak</p>
                            <div className="flex items-center space-x-1">
                                <TrophyIcon className="w-5 h-5 text-yellow-300" />
                                <span className="text-xl font-bold">{weeklyStreak}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Calorie Progress */}
                    <div className="bg-white/10 rounded-2xl p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-blue-100 mb-1">Kalori Hari Ini</p>
                                <p className={`text-3xl font-bold ${getCalorieStatusColor()}`}>
                                    {formatNumber(calories.consumed)}
                                </p>
                                <p className="text-sm text-blue-200">
                                    dari {formatNumber(calories.target)} target
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`text-2xl font-bold ${getCalorieStatusColor()}`}>
                                    {calories.percentage}%
                                </p>
                                {calories.is_over_target ? (
                                    <p className="text-sm text-red-300">
                                        +{formatNumber(calories.consumed - calories.target)} kal
                                    </p>
                                ) : (
                                    <p className="text-sm text-blue-200">
                                        Sisa: {formatNumber(calories.remaining)} kal
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-700 ${getProgressBarColor()}`}
                                style={{ width: `${Math.min(calories.percentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Quick Statistics Link */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <TrophyIcon className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium text-white">Streak: {weeklyStreak} hari</span>
                        </div>
                        <button
                            onClick={() => router.visit('/statistics/weekly')}
                            className="text-sm text-blue-100 hover:text-white font-medium"
                        >
                            Lihat Detail →
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 space-y-6">
                    {/* Weekly Mini Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Progress 7 Hari</h3>
                            <button
                                onClick={() => router.visit('/statistics/weekly')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Lihat Detail
                            </button>
                        </div>

                        <div className="flex items-end justify-between space-x-2 h-24">
                            {weeklyData && weeklyData.length > 0 ? weeklyData.map((day, index) => (
                                <div key={day.date} className="flex-1 flex flex-col items-center">
                                    <div className="flex-1 flex items-end w-full">
                                        <div
                                            className={`w-full rounded-t transition-all duration-500 ${
                                                day.is_today
                                                    ? 'bg-gradient-to-t from-blue-500 to-blue-400'
                                                    : day.percentage > 100
                                                        ? 'bg-gradient-to-t from-red-400 to-red-300'
                                                        : day.percentage >= 70
                                                            ? 'bg-gradient-to-t from-green-400 to-green-300'
                                                            : day.calories > 0
                                                                ? 'bg-gradient-to-t from-yellow-400 to-yellow-300'
                                                                : 'bg-gradient-to-t from-gray-300 to-gray-200'
                                            }`}
                                            style={{
                                                height: `${Math.max(Math.min(day.percentage, 100), day.calories > 0 ? 8 : 4)}%`,
                                                minHeight: day.calories > 0 ? '8px' : '4px'
                                            }}
                                            title={`${day.day}: ${Math.round(day.calories)} kal (${Math.round(day.percentage)}%)`}
                                        />
                                    </div>
                                    <p className={`text-xs mt-2 font-medium ${
                                        day.is_today ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                        {day.day}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {Math.round(day.calories)}
                                    </p>
                                </div>
                            )) : (
                                <div className="flex items-center justify-center w-full h-16 text-gray-400">
                                    <span className="text-sm">Data tidak tersedia</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meal Breakdown */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Kalori per Waktu Makan</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(mealCalories).map(([mealType, calories]) => (
                                <div key={mealType} className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-lg">{getMealIcon(mealType)}</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {getMealLabel(mealType)}
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">
                                        {formatNumber(calories)}
                                    </p>
                                    <p className="text-xs text-gray-500">kalori</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Favorite Foods Quick Add */}
                    {favoriteFoods.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                                    <HeartSolidIcon className="w-5 h-5 text-pink-500" />
                                    <span>Quick Add Favorit</span>
                                </h3>
                                <button
                                    onClick={() => router.visit('/favorites')}
                                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                                >
                                    Lihat Semua
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {favoriteFoods.slice(0, 4).map((food) => (
                                    <button
                                        key={food.id}
                                        onClick={() => quickAddFavorite(food)}
                                        className="text-left p-3 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors border border-pink-100 group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-gray-900 group-hover:text-pink-600 text-sm leading-tight flex-1">
                                                {food.name}
                                            </h4>
                                            <PlusIcon className="w-4 h-4 text-pink-400 flex-shrink-0 ml-1" />
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            <p className="font-semibold text-pink-600">
                                                {food.calories_per_100g} kal/100g
                                            </p>
                                            {food.brand && (
                                                <p className="opacity-75">{food.brand}</p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Entries */}
                    {todayFoods.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                                    <ClockIcon className="w-5 h-5 text-gray-500" />
                                    <span>Makanan Hari Ini</span>
                                </h3>
                                <span className="text-sm text-gray-500">{todayFoods.length} item</span>
                            </div>

                            <div className="space-y-3">
                                {todayFoods.slice(0, 5).map((food) => (
                                    <div key={food.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="text-lg">
                                                {getMealIcon(food.meal_type)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{food.name}</p>
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <span>{food.time}</span>
                                                    <span>•</span>
                                                    <span>{getMealLabel(food.meal_type)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => addToFavorites(food.name, food.calories)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg"
                                                title="Tambah ke favorit"
                                            >
                                                <HeartIcon className="w-4 h-4" />
                                            </button>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{formatNumber(food.calories)}</p>
                                                <p className="text-xs text-gray-500">kalori</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {todayFoods.length > 5 && (
                                    <button
                                        onClick={() => router.visit('/history')}
                                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
                                    >
                                        Lihat semua ({todayFoods.length} makanan)
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {todayFoods.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FireIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Belum ada makanan hari ini
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Mulai mencatat kalori makanan yang kamu konsumsi hari ini.
                            </p>
                            <button
                                onClick={() => router.visit('/add-food')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Tambah Makanan</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    );
}
