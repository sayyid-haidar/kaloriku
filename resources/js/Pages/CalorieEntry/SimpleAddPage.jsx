import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MobileLayout from '@/Layouts/MobileLayout';
import { theme, variants } from '@/constants/theme';
import {
    PlusIcon,
    ClockIcon,
    FireIcon,
    SparklesIcon,
    CheckCircleIcon,
    ArrowLeftIcon,
    HeartIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartSolidIcon,
} from '@heroicons/react/24/solid';

export default function SimpleAddPage({
    recentFoods,
    verifiedFoods,
    favoriteFoods,
    maxDate,
    minDate,
    error: serverError,
    todayTotal = 0,
    calorieTarget = 2000,
    userProfile
}) {
    // Use Inertia form for CSRF handling
    const { data, setData, post, processing, errors, reset } = useForm({
        food_name: '',
        calories: '',
        notes: '',
        meal_type: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showCalorieAlert, setShowCalorieAlert] = useState(false);
    const [currentTodayTotal, setCurrentTodayTotal] = useState(todayTotal);
    const [localErrors, setLocalErrors] = useState({});
    const [favorites, setFavorites] = useState(favoriteFoods || []);
    const [addingToFavorites, setAddingToFavorites] = useState(false);
    const [showFavoriteSuccess, setShowFavoriteSuccess] = useState(false);

    // Calculate calorie metrics
    const caloriePercentage = calorieTarget ? Math.round((currentTodayTotal / calorieTarget) * 100) : 0;
    const isOverTarget = caloriePercentage > 100;
    const isNearTarget = caloriePercentage >= 90 && caloriePercentage < 100;
    const remainingCalories = Math.max(0, calorieTarget - currentTodayTotal);

    // Handle adding food to favorites
    const handleAddToFavorites = async () => {
        if (!data.food_name.trim() || !data.calories) {
            setLocalErrors({
                food_name: !data.food_name.trim() ? 'Nama makanan harus diisi' : null,
                calories: !data.calories ? 'Kalori harus diisi' : null
            });
            return;
        }

        setAddingToFavorites(true);

        try {
            const response = await axios.post('/favorites/add', {
                food_name: data.food_name,
                calories: data.calories,
            });

            // Update local favorites state
            setFavorites(prev => [...prev, {
                name: data.food_name,
                calories: data.calories
            }]);

            // Show success message
            setShowFavoriteSuccess(true);
            setTimeout(() => setShowFavoriteSuccess(false), 3000);
        } catch (error) {
            console.error('Error adding to favorites:', error);
            setShowFavoriteSuccess(false);
            // Show error in a more user-friendly way
            setLocalErrors({
                favorites: 'Gagal menambahkan ke favorit. Silakan coba lagi.'
            });
        } finally {
            setAddingToFavorites(false);
        }
    };

    // Handle quick add form submission
    const handleQuickAdd = (e) => {
        e.preventDefault();

        console.log('Form submission started with data:', data);

        // Validation
        if (!data.food_name.trim() || !data.calories) {
            console.log('Validation failed');
            setLocalErrors({
                food_name: !data.food_name.trim() ? 'Nama makanan harus diisi' : null,
                calories: !data.calories ? 'Kalori harus diisi' : null
            });
            return;
        }

        // Check calorie warning
        const newTotal = currentTodayTotal + parseFloat(data.calories);
        if (newTotal > calorieTarget && !showCalorieAlert) {
            setShowCalorieAlert(true);
            setTimeout(() => setShowCalorieAlert(false), 4000);
        }

        console.log('Validation passed, calling post...');
        setLocalErrors({});

        post(route('calorie.quick-add'), {
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Success!', page);

                // Update today's total
                const addedCalories = parseFloat(data.calories);
                setCurrentTodayTotal(prev => prev + addedCalories);

                // Reset form
                reset();

                // Show success animation
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);

                // Refresh recent foods data
                router.reload({ only: ['recentFoods'] });
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
                setLocalErrors({
                    submit: errors.food_name || errors.calories || 'Terjadi kesalahan saat menyimpan data'
                });
            }
        });
    };

    // Handle recent food click
    const handleRecentFoodClick = (food) => {
        setData({
            food_name: food.name,
            calories: food.calories.toString(),
            notes: food.notes || '',
            meal_type: data.meal_type
        });
    };

    // Handle favorite food click
    const handleFavoriteClick = (food) => {
        setData({
            food_name: food.name,
            calories: food.calories ? Math.round(food.calories).toString() : '',
            notes: `${food.brand ? food.brand + ' - ' : ''}Dari favorit`,
            meal_type: data.meal_type || getCurrentMealType()
        });
    };

    // Add/remove from favorites
    const toggleFavorite = async (food) => {
        try {
            const isFavorite = favorites.some(fav => fav.id === food.id);

            if (isFavorite) {
                await router.delete('/api/favorites/remove', {
                    data: { food_id: food.id },
                    preserveState: true,
                    onSuccess: () => {
                        setFavorites(prev => prev.filter(fav => fav.id !== food.id));
                    }
                });
            } else {
                await router.post('/api/favorites/add', {
                    food_id: food.id
                }, {
                    preserveState: true,
                    onSuccess: () => {
                        setFavorites(prev => [...prev, food]);
                    }
                });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Get current time-based meal suggestion
    const getCurrentMealType = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return 'breakfast';
        if (hour >= 11 && hour < 15) return 'lunch';
        if (hour >= 15 && hour < 20) return 'dinner';
        return 'snack';
    };

    // Auto-set meal type on mount
    useEffect(() => {
        if (!data.meal_type) {
            setData('meal_type', getCurrentMealType());
        }
    }, []);

    return (
        <MobileLayout showAddButton={false}>
            <Head title="Tambah Makanan - kaloriKu" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">

            {/* Success Animation */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 mx-4 text-center max-w-sm animate-bounce">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
                        <p className="text-gray-600 mb-2">Makanan telah ditambahkan ke diary kamu</p>
                        <p className="text-sm text-gray-500">Total hari ini: {currentTodayTotal} kalori</p>
                    </div>
                </div>
            )}

            {/* Favorite Success Animation */}
            {showFavoriteSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 mx-4 text-center max-w-sm animate-pulse">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HeartSolidIcon className="h-10 w-10 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Ditambahkan ke Favorit!</h3>
                        <p className="text-gray-600 mb-2">"{data.food_name}" sekarang ada di daftar favorit kamu</p>
                        <p className="text-sm text-gray-500">Akses cepat untuk next time</p>
                    </div>
                </div>
            )}

            {/* Calorie Alert */}
            {showCalorieAlert && (
                <div className="fixed top-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl z-40 animate-pulse">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">
                            Peringatan: Kamu sudah mencapai {caloriePercentage}% dari target kalori harian!
                        </span>
                    </div>
                </div>
            )}

            {/* Clean Minimalist Header */}
            <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white p-6 rounded-b-3xl shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                    <button
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold flex items-center space-x-2">
                            <PlusIcon className="w-7 h-7 text-white" />
                            <span>Tambah Makanan</span>
                        </h1>
                        <p className="text-white/80 text-sm flex items-center space-x-1 mt-1">
                            <SparklesIcon className="w-4 h-4" />
                            <span>Catat kalori dengan mudah</span>
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
                            <FireIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-xs text-white/70">{calorieTarget}</p>
                    </div>
                </div>

                {/* Enhanced Calorie Progress Card */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100/20 rounded-lg">
                                <FireIcon className="w-5 h-5 text-green-200" />
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Kalori Hari Ini</p>
                                <p className="text-xl font-bold text-white">{currentTodayTotal}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-2xl font-bold ${
                                isOverTarget ? 'text-red-300' : isNearTarget ? 'text-yellow-300' : 'text-green-300'
                            }`}>
                                {caloriePercentage}%
                            </p>
                            <p className="text-xs text-white/60">dari target</p>
                        </div>
                    </div>

                    {/* Clean Progress Bar */}
                    <div className="bg-white/20 rounded-full h-3 mb-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                                isOverTarget
                                    ? 'bg-gradient-to-r from-red-400 to-red-500'
                                    : isNearTarget
                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                        : 'bg-gradient-to-r from-green-400 to-emerald-500'
                            }`}
                            style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-xs text-white/70">
                            {isOverTarget ? (
                                <span className="text-red-200 font-medium">
                                    Kelebihan: {currentTodayTotal - calorieTarget} kal
                                </span>
                            ) : (
                                <span>Tersisa: {remainingCalories} kal</span>
                            )}
                        </div>
                        <div className="text-xs text-white/70">
                            Target: {calorieTarget} kal
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-3">
                    <div className="flex items-center space-x-2">
                        <ChartBarIcon className="w-5 h-5 text-white/70" />
                        <span className="text-sm font-medium text-white">Quick Add</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <HeartIcon className="w-5 h-5 text-white/70" />
                        <span className="text-sm font-medium text-white">{favorites.length} Favorit</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6">
                {/* Enhanced Quick Add Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-green-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                            <PlusIcon className="w-5 h-5 text-slate-600" />
                            <span>Tambah Cepat</span>
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Masukkan makanan dan kalori langsung</p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleQuickAdd} className="space-y-6">
                            {/* Enhanced Food Name Input */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Nama makanan</span>
                                    <span className="text-yellow-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Mie ayam bakso, Nasi gudeg + ayam, Gado-gado..."
                                        value={data.food_name}
                                        onChange={(e) => setData('food_name', e.target.value)}
                                        className={`w-full px-4 py-4 rounded-xl border-2 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all duration-200 ${
                                            localErrors.food_name ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-100' : 'border-gray-200'
                                        }`}
                                        disabled={processing}
                                    />
                                    {data.food_name && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <CheckCircleIcon className="w-5 h-5 text-slate-500" />
                                        </div>
                                    )}
                                </div>
                                {localErrors.food_name && (
                                    <p className="text-yellow-600 text-sm flex items-center space-x-1">
                                        <ExclamationTriangleIcon className="w-4 h-4" />
                                        <span>{localErrors.food_name}</span>
                                    </p>
                                )}
                            </div>

                            {/* Enhanced Calories & Notes Row */}
                            <div className="grid grid-cols-5 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                        <span>Kalori</span>
                                        <span className="text-yellow-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="300"
                                            value={data.calories}
                                            onChange={(e) => setData('calories', e.target.value)}
                                            className={`w-full px-4 py-4 text-lg font-bold text-center rounded-xl border-2 bg-gradient-to-br from-green-50 to-emerald-50 text-gray-900 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100 transition-all duration-200 ${
                                                localErrors.calories ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-100' : 'border-orange-200'
                                            }`}
                                            min="1"
                                            max="99999"
                                            disabled={processing}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <span className="text-sm font-medium text-yellow-600">kcal</span>
                                        </div>
                                        {data.calories && (
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <FireIcon className="w-4 h-4 text-yellow-500" />
                                            </div>
                                        )}
                                    </div>
                                    {localErrors.calories && (
                                        <p className="text-yellow-600 text-sm flex items-center space-x-1">
                                            <ExclamationTriangleIcon className="w-4 h-4" />
                                            <span>{localErrors.calories}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-3 space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                        <span>Catatan</span>
                                        <span className="text-gray-400 text-xs">(opsional)</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            placeholder="Porsi besar, merk Indomie, pakai telor..."
                                            rows="2"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="w-full px-4 py-4 rounded-xl border-2 bg-purple-50 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all duration-200 border-purple-200 resize-none"
                                            maxLength="500"
                                            disabled={processing}
                                        />
                                        {data.notes && (
                                            <div className="absolute bottom-2 right-3">
                                                <span className="text-xs text-gray-400">{data.notes.length}/500</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Meal Type Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2">
                                    <ClockIcon className="w-4 h-4 text-blue-600" />
                                    <span>Kapan kamu makan ini?</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        {
                                            value: 'breakfast',
                                            label: 'Sarapan',
                                            icon: '🌅',
                                            time: '05:00-11:00',
                                            gradient: 'from-yellow-400 via-orange-400 to-red-400',
                                            bg: 'from-yellow-50 to-orange-50',
                                            border: 'border-yellow-200',
                                            text: 'text-orange-700'
                                        },
                                        {
                                            value: 'lunch',
                                            label: 'Makan Siang',
                                            icon: '☀️',
                                            time: '11:00-15:00',
                                            gradient: 'from-blue-400 via-cyan-400 to-green-400',
                                            bg: 'from-blue-50 to-green-50',
                                            border: 'border-blue-200',
                                            text: 'text-blue-700'
                                        },
                                        {
                                            value: 'dinner',
                                            label: 'Makan Malam',
                                            icon: '🌙',
                                            time: '15:00-20:00',
                                            gradient: 'from-purple-400 via-pink-400 to-red-400',
                                            bg: 'from-purple-50 to-pink-50',
                                            border: 'border-purple-200',
                                            text: 'text-purple-700'
                                        },
                                        {
                                            value: 'snack',
                                            label: 'Snack',
                                            icon: '🍪',
                                            time: 'Kapan saja',
                                            gradient: 'from-green-400 via-emerald-400 to-teal-400',
                                            bg: 'from-green-50 to-emerald-50',
                                            border: 'border-green-200',
                                            text: 'text-green-700'
                                        }
                                    ].map((meal) => (
                                        <button
                                            key={meal.value}
                                            type="button"
                                            onClick={() => setData('meal_type', meal.value)}
                                            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                                                data.meal_type === meal.value
                                                    ? `border-transparent bg-gradient-to-br ${meal.gradient} text-white shadow-xl ring-2 ring-offset-2 ring-green-500`
                                                    : `${meal.border} bg-gradient-to-br ${meal.bg} ${meal.text} hover:shadow-md`
                                            }`}
                                            disabled={processing}
                                        >
                                            {/* Enhanced Selection Indicator */}
                                            {data.meal_type === meal.value && (
                                                <div className="absolute -top-2 -right-2">
                                                    <div className="bg-white rounded-full p-1 shadow-lg">
                                                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="text-center">
                                                <div className="text-2xl mb-2 transform transition-transform duration-200 hover:scale-110">{meal.icon}</div>
                                                <div className="font-bold text-sm mb-1">{meal.label}</div>
                                                <div className={`text-xs font-medium ${
                                                    data.meal_type === meal.value ? 'text-white/90' : 'opacity-60'
                                                }`}>
                                                    {meal.time}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Action Buttons */}
                            <div className="space-y-4 pt-2">
                                {/* Primary Action - Add to Diary */}
                                <button
                                    type="submit"
                                    disabled={processing || !data.food_name.trim() || !data.calories}
                                    className="w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-green-300"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-3">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            <span className="font-semibold">Menambahkan ke Diary...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-3">
                                            <div className="bg-white/20 rounded-full p-2">
                                                <PlusIcon className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Tambah ke Diary</div>
                                                <div className="text-sm opacity-90">
                                                    {data.calories || 0} kalori • {data.meal_type ? (data.meal_type.charAt(0).toUpperCase() + data.meal_type.slice(1)) : 'Pilih waktu makan'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </button>

                                {/* Enhanced Secondary Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Add to Favorites */}
                                    <button
                                        type="button"
                                        onClick={handleAddToFavorites}
                                        disabled={addingToFavorites || !data.food_name.trim() || !data.calories}
                                        className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 text-pink-700 py-3 px-4 rounded-xl font-semibold text-sm hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                                    >
                                        {addingToFavorites ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                                                <span>Saving...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <HeartSolidIcon className="w-4 h-4" />
                                                <span>Favorit</span>
                                            </div>
                                        )}
                                    </button>

                                    {/* Quick Add Another */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Reset form for quick add another
                                            setData({
                                                food_name: '',
                                                calories: '',
                                                notes: '',
                                                meal_type: data.meal_type // Keep meal type
                                            });
                                            setLocalErrors({});
                                        }}
                                        className="bg-white border-2 border-gray-200 text-gray-600 py-3 px-4 rounded-xl font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <SparklesIcon className="w-4 h-4" />
                                            <span>Reset</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Favorites - Quick Access */}
                {favorites && favorites.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <HeartSolidIcon className="w-5 h-5 text-pink-500" />
                                <h3 className="font-semibold text-gray-900">Makanan Favorit</h3>
                            </div>
                            <span className="text-sm text-gray-500">{favorites.length} item</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {favorites.slice(0, 6).map((food, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleFavoriteClick(food)}
                                    className="text-left p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors group border border-pink-100"
                                    disabled={processing}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-900 group-hover:text-pink-600 text-sm leading-tight">
                                            {food.name}
                                        </h4>
                                        <HeartSolidIcon className="w-4 h-4 text-pink-400 flex-shrink-0 ml-1" />
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <p className="font-semibold text-pink-600">
                                            {food.calories} kal/porsi
                                        </p>
                                        {food.brand && (
                                            <p className="opacity-75">{food.brand}</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        {favorites.length > 6 && (
                            <button
                                onClick={() => router.visit('/favorites')}
                                className="w-full mt-3 text-sm text-pink-600 hover:text-pink-700 font-medium"
                            >
                                Lihat semua favorit ({favorites.length - 6} lainnya)
                            </button>
                        )}
                    </div>
                )}

                {/* Recent Foods - Quick Access */}
                {recentFoods && recentFoods.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <ClockIcon className="w-5 h-5 text-gray-500" />
                            <h3 className="font-semibold text-gray-900">Makanan Terakhir</h3>
                        </div>
                        <div className="space-y-2">
                            {recentFoods.slice(0, 5).map((food, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRecentFoodClick(food)}
                                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                                    disabled={processing}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {food.name}
                                            </p>
                                            {food.notes && (
                                                <p className="text-sm text-gray-500 mt-1">{food.notes}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600">
                                                {food.calories} kal
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Klik untuk tambah
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </div>
        </MobileLayout>
    );
}
