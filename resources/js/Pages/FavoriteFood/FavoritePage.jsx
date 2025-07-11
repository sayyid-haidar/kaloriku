import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import MobileLayout from '@/Layouts/MobileLayout';
import {
    ArrowLeftIcon,
    HeartIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function FavoriteFood({ favoriteFoods }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFoods = favoriteFoods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleQuickAdd = (food) => {
        const estimatedCalories = food.calories_per_100g || food.calories || 100;

        router.post(route('calorie.quick-add'), {
            food_name: food.name,
            calories: estimatedCalories,
            notes: `Quick add dari favorit`,
            meal_type: getCurrentMealType()
        }, {
            onSuccess: () => {
                // Show success message or redirect
                router.visit('/home');
            },
            onError: (errors) => {
                console.error('Quick add failed:', errors);
            }
        });
    };

    const getCurrentMealType = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return 'breakfast';
        if (hour >= 11 && hour < 15) return 'lunch';
        if (hour >= 15 && hour < 20) return 'dinner';
        return 'snack';
    };

    const handleRemove = (foodId) => {
        if (confirm('Hapus dari favorit?')) {
            router.delete(route('favorites.destroy', foodId));
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <MobileLayout>
            <Head title="Makanan Favorit - kaloriKu" />

            {/* Header */}
            <div className="bg-gradient-to-br from-pink-500 via-red-500 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                    <button
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        onClick={() => router.visit('/home')}
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Makanan Favorit</h1>
                        <p className="text-pink-100 text-sm">{favoriteFoods.length} makanan tersimpan</p>
                    </div>
                    <div className="text-right">
                        <HeartSolid className="w-8 h-8 mx-auto mb-1 text-pink-200" />
                        <p className="text-xs">Favorit</p>
                    </div>
                </div>

                {/* Search Bar */}
                {favoriteFoods.length > 0 && (
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-200" />
                        <input
                            type="text"
                            placeholder="Cari makanan favorit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-200 focus:outline-none focus:bg-white/20"
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {/* Empty State */}
                {favoriteFoods.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HeartIcon className="w-10 h-10 text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada makanan favorit</h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                            Tambahkan makanan ke favorit saat menambah kalori untuk akses cepat
                        </p>
                        <button
                            onClick={() => router.visit('/add-food')}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Tambah Makanan</span>
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Results count */}
                        {searchTerm && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    {filteredFoods.length} dari {favoriteFoods.length} makanan
                                </p>
                            </div>
                        )}

                        {/* Favorite Foods List */}
                        <div className="space-y-3">
                            {filteredFoods.map((food) => (
                                <div key={food.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {food.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{food.name}</h4>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <span>{formatNumber(food.calories_per_100g || food.calories || 0)} kal</span>
                                                    {food.brand && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{food.brand}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleQuickAdd(food)}
                                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                                                title="Quick Add"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(food.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                                                title="Hapus dari favorit"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No results */}
                        {searchTerm && filteredFoods.length === 0 && (
                            <div className="text-center py-8">
                                <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">Tidak ada makanan yang cocok dengan "{searchTerm}"</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MobileLayout>
    );
}
