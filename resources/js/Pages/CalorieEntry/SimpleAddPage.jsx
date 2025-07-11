import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MobileLayout from '@/Layouts/MobileLayout';
import {
    PlusIcon,
    ClockIcon,
    FireIcon,
    SparklesIcon,
    CheckCircleIcon,
    ArrowLeftIcon,
    HeartIcon,
    ExclamationTriangleIcon,
    ChartBarIcon
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
                calories_per_100g: data.calories,
            });

            // Update local favorites state
            setFavorites(prev => [...prev, {
                name: data.food_name,
                calories_per_100g: data.calories
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
            calories: food.calories_per_100g ? Math.round(food.calories_per_100g).toString() : '',
            notes: `${food.brand ? food.brand + ' - ' : ''}Estimasi per 100g`,
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
                <div className="fixed top-4 left-4 right-4 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-xl z-40 animate-pulse">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">
                            Peringatan: Kamu sudah mencapai {caloriePercentage}% dari target kalori harian!
                        </span>
                    </div>
                </div>
            )}

            {/* Header with Calorie Progress */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 rounded-b-3xl shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <button
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Tambah Makanan</h1>
                        <p className="text-blue-100 text-sm">Catat kalori dengan mudah</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-blue-100">Target</p>
                        <p className="text-lg font-bold">{calorieTarget}</p>
                    </div>
                </div>

                {/* Calorie Progress Bar */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <FireIcon className="w-5 h-5 text-orange-300" />
                            <span className="text-sm font-medium text-white">{currentTodayTotal} kalori</span>
                        </div>
                        <div className="text-right">
                            <span className={`text-sm font-bold ${
                                isOverTarget ? 'text-red-300' : isNearTarget ? 'text-orange-300' : 'text-green-300'
                            }`}>
                                {caloriePercentage}%
                            </span>
                            <p className="text-xs text-blue-100">dari target</p>
                        </div>
                    </div>

                    <div className="bg-white/20 rounded-full h-4 overflow-hidden mb-2 relative">
                        <div
                            className={`h-full transition-all duration-700 ${
                                isOverTarget
                                    ? 'bg-gradient-to-r from-red-400 to-red-500'
                                    : isNearTarget
                                        ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                                        : 'bg-gradient-to-r from-green-400 to-green-500'
                            }`}
                            style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-xs text-blue-100">
                            {isOverTarget ? (
                                <span className="text-red-300 font-medium">
                                    Kelebihan: {currentTodayTotal - calorieTarget} kal
                                </span>
                            ) : (
                                <span>Tersisa: {remainingCalories} kal</span>
                            )}
                        </div>
                        <div className="text-xs text-blue-100">
                            Target: {calorieTarget} kal
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-3">
                    <div className="flex items-center space-x-2">
                        <ChartBarIcon className="w-5 h-5 text-green-300" />
                        <span className="text-sm font-medium">Quick Add</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <HeartIcon className="w-5 h-5 text-pink-300" />
                        <span className="text-sm font-medium">{favorites.length} Favorit</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6">
                {/* Quick Add Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                            <PlusIcon className="w-5 h-5 text-blue-600" />
                            <span>Tambah Cepat</span>
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Masukkan makanan dan kalori langsung</p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleQuickAdd} className="space-y-4">
                            {/* Food Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama makanan *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Nasi gudeg + ayam, Mie ayam bakso..."
                                    value={data.food_name}
                                    onChange={(e) => setData('food_name', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border-0 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                                        localErrors.food_name ? 'ring-2 ring-red-500' : ''
                                    }`}
                                    disabled={processing}
                                />
                                {localErrors.food_name && (
                                    <p className="text-red-500 text-sm mt-1">{localErrors.food_name}</p>
                                )}
                            </div>

                            {/* Calories & Notes Row */}
                            <div className="grid grid-cols-5 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kalori *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="300"
                                            value={data.calories}
                                            onChange={(e) => setData('calories', e.target.value)}
                                            className={`w-full px-4 py-3 text-lg font-semibold text-center rounded-xl border-0 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                                                localErrors.calories ? 'ring-2 ring-red-500' : ''
                                            }`}
                                            min="1"
                                            max="99999"
                                            disabled={processing}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <span className="text-sm text-gray-500">kal</span>
                                        </div>
                                    </div>
                                    {localErrors.calories && (
                                        <p className="text-red-500 text-sm mt-1">{localErrors.calories}</p>
                                    )}
                                </div>

                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catatan (opsional)
                                    </label>
                                    <textarea
                                        placeholder="Porsi, merk, tambahan..."
                                        rows="2"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-0 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        maxLength="500"
                                        disabled={processing}
                                    />
                                </div>
                            </div>

                            {/* Meal Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    <span className="flex items-center space-x-2">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>Kapan kamu makan ini?</span>
                                    </span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'breakfast', label: 'Sarapan', icon: '🌅', time: '05:00-11:00', color: 'from-amber-400 to-orange-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-700' },
                                        { value: 'lunch', label: 'Makan Siang', icon: '☀️', time: '11:00-15:00', color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700' },
                                        { value: 'dinner', label: 'Makan Malam', icon: '🌙', time: '15:00-20:00', color: 'from-indigo-400 to-purple-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-700' },
                                        { value: 'snack', label: 'Snack', icon: '🍪', time: 'Kapan saja', color: 'from-emerald-400 to-teal-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700' }
                                    ].map((meal) => (
                                        <button
                                            key={meal.value}
                                            type="button"
                                            onClick={() => setData('meal_type', meal.value)}
                                            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                                                data.meal_type === meal.value
                                                    ? `border-transparent bg-gradient-to-br ${meal.color} text-white shadow-xl`
                                                    : `${meal.borderColor} ${meal.bgColor} ${meal.textColor} hover:shadow-lg`
                                            }`}
                                            disabled={processing}
                                        >
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">{meal.icon}</div>
                                                <div className="font-bold text-sm mb-1">{meal.label}</div>
                                                <div className={`text-xs font-medium ${
                                                    data.meal_type === meal.value ? 'text-white/90' : 'opacity-60'
                                                }`}>
                                                    {meal.time}
                                                </div>
                                            </div>

                                            {/* Selected indicator */}
                                            {data.meal_type === meal.value && (
                                                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {/* Primary Action - Add to Diary */}
                                <button
                                    type="submit"
                                    disabled={processing || !data.food_name.trim() || !data.calories}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-3">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            <span>Menambahkan ke Diary...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-3">
                                            <div className="bg-white/20 rounded-full p-1">
                                                <PlusIcon className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Tambah ke Diary</div>
                                                <div className="text-sm opacity-90">{data.calories || 0} kalori • {data.meal_type ? data.meal_type.charAt(0).toUpperCase() + data.meal_type.slice(1) : 'Waktu makan'}</div>
                                            </div>
                                        </div>
                                    )}
                                </button>

                                {/* Secondary Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Add to Favorites */}
                                    <button
                                        type="button"
                                        onClick={handleAddToFavorites}
                                        disabled={addingToFavorites || !data.food_name.trim() || !data.calories}
                                        className="bg-white border-2 border-pink-200 text-pink-600 py-3 px-4 rounded-xl font-semibold text-sm hover:border-pink-300 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {addingToFavorites ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
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

                            {/* Error Message */}
                            {localErrors.submit && (
                                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                                    {localErrors.submit}
                                </div>
                            )}
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
                                            {food.calories_per_100g} kal/100g
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
        </MobileLayout>
    );
}
