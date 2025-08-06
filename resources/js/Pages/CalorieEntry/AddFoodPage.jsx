import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import MobileLayout from '@/Layouts/MobileLayout';
import {
    XMarkIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    HeartIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    CalendarIcon,
    ScaleIcon,
    FireIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function AddFood({ foods, favoriteFoods, maxDate, minDate, error: serverError }) {
    const [activeTab, setActiveTab] = useState('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [portion, setPortion] = useState('');
    const [showPortionInput, setShowPortionInput] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        food_id: '',
        portion: '',
        entry_date: new Date().toISOString().slice(0, 10),
    });

    const favoriteForm = useForm({});

    // Filter foods based on search query
    const filteredFoods = (foods || []).filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if food is in favorites
    const isFavorite = (foodId) => {
        return (favoriteFoods || []).some(fav => fav.id === foodId);
    };

    const handleFoodSelect = (food) => {
        setSelectedFood(food);
        setData('food_id', food.id);
        setShowPortionInput(true);
        clearErrors('food_id');
        if (localErrors.food_id) {
            setLocalErrors(prev => ({ ...prev, food_id: null }));
        }
    };

    const handlePortionChange = (value) => {
        const stringValue = value.toString();
        setPortion(stringValue);
        setData('portion', parseFloat(stringValue) || 0);
        clearErrors('portion');
        if (localErrors.portion) {
            setLocalErrors(prev => ({ ...prev, portion: null }));
        }
    };

    const handleToggleFavorite = async (food) => {
        const isCurrentlyFavorite = isFavorite(food.id);

        if (isCurrentlyFavorite) {
            favoriteForm.delete(route('calorie.remove-favorite'), {
                data: { food_id: food.id },
                onError: (errors) => console.error('Error removing from favorites:', errors)
            });
        } else {
            favoriteForm.post(route('calorie.add-favorite'), {
                food_id: food.id
            }, {
                onError: (errors) => console.error('Error adding to favorites:', errors)
            });
        }
    };

    const calculateCalories = () => {
        if (!selectedFood || !portion) return 0;
        const portionNum = parseFloat(portion) || 0;
        return Math.round((selectedFood.calorie_per_100g * portionNum) / 100);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedFood) {
            setLocalErrors({ food_id: 'Silakan pilih makanan terlebih dahulu' });
            return;
        }

        const portionNum = parseFloat(portion);
        if (!portionNum || portionNum <= 0) {
            setLocalErrors({ portion: 'Porsi harus berupa angka positif' });
            return;
        }

        post(route('calorie.store'), {
            onSuccess: () => {
                setShowSuccessAnimation(true);
                setTimeout(() => {
                    window.location.href = route('calorie.index');
                }, 2000);
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            }
        });
    };

    return (
        <MobileLayout showAddButton={false}>
            <Head title="Tambah Makanan" />

            {/* Success Animation Overlay */}
            {showSuccessAnimation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 mx-4 text-center animate-pulse">
                        <CheckCircleSolid className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Berhasil!</h3>
                        <p className="text-gray-600">Makanan telah ditambahkan ke diary Anda</p>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-green-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => window.history.back()}
                                    className="p-2 -ml-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Tambah Makanan</h1>
                                    <p className="text-sm text-gray-500">Pilih makanan dan tentukan porsi</p>
                                </div>
                            </div>
                            {selectedFood && (
                                <button
                                    onClick={() => {
                                        setSelectedFood(null);
                                        setShowPortionInput(false);
                                        setPortion('');
                                        setData('food_id', '');
                                        setData('portion', '');
                                        clearErrors();
                                        setLocalErrors({});
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="bg-white border-b">
                    <div className="px-6 py-3">
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-2 ${selectedFood ? 'text-green-600' : 'text-blue-600'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                    selectedFood ? 'bg-green-100 text-green-600' : 'bg-green-100 text-green-600'
                                }`}>
                                    {selectedFood ? <CheckCircleIcon className="w-4 h-4" /> : '1'}
                                </div>
                                <span className="text-sm font-medium">Pilih Makanan</span>
                            </div>
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <div className={`flex items-center space-x-2 ${showPortionInput ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                    showPortionInput ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    2
                                </div>
                                <span className="text-sm font-medium">Tentukan Porsi</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                {/* Error Alerts */}
                {serverError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
                            <p className="text-sm text-red-600 mt-1">{serverError}</p>
                        </div>
                    </div>
                )}

                {/* Form Errors */}
                {(errors.error || Object.keys(errors).length > 0) && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800">Harap perbaiki kesalahan berikut:</h3>
                                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                                    {errors.error && <li>{errors.error}</li>}
                                    {errors.food_id && <li>{errors.food_id}</li>}
                                    {errors.portion && <li>{errors.portion}</li>}
                                    {errors.entry_date && <li>{errors.entry_date}</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm p-1">
                    <div className="grid grid-cols-2 gap-1">
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`py-3 px-4 text-center font-medium rounded-lg transition-all duration-200 ${
                                activeTab === 'search'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <MagnifyingGlassIcon className="w-4 h-4" />
                                <span>Cari Makanan</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`py-3 px-4 text-center font-medium rounded-lg transition-all duration-200 relative ${
                                activeTab === 'favorites'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <HeartIcon className="w-4 h-4" />
                                <span>Favorit</span>
                                {(favoriteFoods || []).length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {(favoriteFoods || []).length}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {/* Search Tab */}
                    {activeTab === 'search' && (
                        <div className="space-y-6">
                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ketik nama makanan atau barcode..."
                                    className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>

                            {/* Food List */}
                            <div className="space-y-3">
                                {searchQuery ? (
                                    filteredFoods.length > 0 ? (
                                        filteredFoods.map((food) => (
                                            <div
                                                key={food.id}
                                                onClick={() => handleFoodSelect(food)}
                                                className={`relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer group hover:shadow-md ${
                                                    selectedFood?.id === food.id
                                                        ? 'border-green-500 bg-green-50 shadow-md'
                                                        : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                            >
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 truncate">{food.name}</h3>
                                                            <div className="flex items-center space-x-3 mt-2">
                                                                <div className="flex items-center space-x-1">
                                                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {food.calorie_per_100g} kal
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">per 100g</span>
                                                                </div>
                                                                {food.brands && (
                                                                    <span className="text-sm text-gray-500 truncate">{food.brands}</span>
                                                                )}
                                                            </div>
                                                            {food.tags && food.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-3">
                                                                    {food.tags.slice(0, 3).map((tag, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md"
                                                                        >
                                                                            {tag.name}
                                                                        </span>
                                                                    ))}
                                                                    {food.tags.length > 3 && (
                                                                        <span className="text-xs text-gray-400">
                                                                            +{food.tags.length - 3} lainnya
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleFavorite(food);
                                                            }}
                                                            className={`ml-3 p-2 rounded-full transition-all duration-200 ${
                                                                isFavorite(food.id)
                                                                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                            }`}
                                                        >
                                                            <HeartIcon className={`h-5 w-5 ${isFavorite(food.id) ? 'fill-current' : ''}`} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {selectedFood?.id === food.id && (
                                                    <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500 ring-opacity-50 pointer-events-none"></div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-300" />
                                            <h3 className="mt-4 text-sm font-medium text-gray-700">Makanan tidak ditemukan</h3>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Coba gunakan kata kunci yang berbeda atau periksa ejaan.
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="mt-4 text-sm font-medium text-gray-700">Mulai mencari makanan</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Ketik nama makanan di kotak pencarian di atas.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <div className="space-y-6">
                            {(favoriteFoods || []).length > 0 ? (
                                <div className="space-y-3">
                                    {(favoriteFoods || []).map((food) => (
                                        <div
                                            key={food.id}
                                            onClick={() => handleFoodSelect(food)}
                                            className={`relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer group hover:shadow-md ${
                                                selectedFood?.id === food.id
                                                    ? 'border-green-500 bg-green-50 shadow-md'
                                                    : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <HeartIcon className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
                                                            <h3 className="font-semibold text-gray-900 truncate">{food.name}</h3>
                                                        </div>
                                                        <div className="flex items-center space-x-3 mt-2">
                                                            <div className="flex items-center space-x-1">
                                                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {food.calorie_per_100g} kal
                                                                </span>
                                                                <span className="text-sm text-gray-500">per 100g</span>
                                                            </div>
                                                            {food.brands && (
                                                                <span className="text-sm text-gray-500 truncate">{food.brands}</span>
                                                            )}
                                                        </div>
                                                        {food.tags && food.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-3">
                                                                {food.tags.slice(0, 3).map((tag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md"
                                                                    >
                                                                        {tag.name}
                                                                    </span>
                                                                ))}
                                                                {food.tags.length > 3 && (
                                                                    <span className="text-xs text-gray-400">
                                                                        +{food.tags.length - 3} lainnya
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleFavorite(food);
                                                        }}
                                                        className="ml-3 p-2 rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-200"
                                                    >
                                                        <HeartIcon className="h-5 w-5 fill-current" />
                                                    </button>
                                                </div>
                                            </div>
                                            {selectedFood?.id === food.id && (
                                                <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500 ring-opacity-50 pointer-events-none"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="mx-auto h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
                                        <HeartIcon className="h-6 w-6 text-red-400" />
                                    </div>
                                    <h3 className="mt-4 text-sm font-medium text-gray-700">Belum ada makanan favorit</h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Tandai makanan dengan ❤️ untuk menambahkannya ke favorit.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Portion Input Section */}
                {selectedFood && showPortionInput && (
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <CheckCircleIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">{selectedFood.name}</h3>
                                    <p className="text-blue-100 text-sm">
                                        {selectedFood.calorie_per_100g} kalori per 100g
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Portion Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Berapa banyak yang kamu makan?
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={portion}
                                        onChange={handlePortionChange}
                                        className={`w-full text-2xl font-bold text-center py-4 px-6 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${
                                            (errors.portion || localErrors.portion) ? 'ring-2 ring-red-500' : ''
                                        }`}
                                        min="0.1"
                                        max="9999.99"
                                        step="0.1"
                                        placeholder="0"
                                        autoFocus
                                    />
                                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                                        <span className="text-xl font-medium text-gray-500">gram</span>
                                    </div>
                                </div>
                                {(errors.portion || localErrors.portion) && (
                                    <p className="mt-2 text-sm text-red-600 text-center">
                                        {errors.portion || localErrors.portion}
                                    </p>
                                )}
                                <p className="mt-2 text-sm text-gray-500 text-center">
                                    Masukkan berat makanan dalam gram
                                </p>
                            </div>

                            {/* Quick Portion Buttons */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">Pilihan cepat:</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[50, 100, 150, 200].map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => handlePortionChange(amount.toString())}
                                            className="py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            {amount}g
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Calorie Display */}
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600 mb-1">
                                        {calculateCalories()}
                                    </div>
                                    <div className="text-sm font-medium text-orange-800">Kalori</div>
                                    <div className="text-xs text-orange-600 mt-1">
                                        Dari {portion}g {selectedFood.name}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || !selectedFood || portion <= 0}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Menambahkan...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <PlusIcon className="w-5 h-5" />
                                        <span>Tambah ke Diary</span>
                                    </div>
                                )}
                            </button>

                            {/* Back Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFood(null);
                                    setShowPortionInput(false);
                                    setPortion('');
                                }}
                                className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                                ← Pilih makanan lain
                            </button>
                        </form>
                    </div>
                )}

                {/* Success Animation */}
                {showSuccessAnimation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleIcon className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Berhasil!</h3>
                            <p className="text-gray-600">
                                {calculateCalories()} kalori telah ditambahkan ke diary kamu.
                            </p>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </MobileLayout>
    );
}
