import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import MobileLayout from '@/Layouts/MobileLayout';
import { theme, variants } from '@/constants/theme';
import {
    ArrowLeftIcon,
    HeartIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    SparklesIcon,
    FireIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function FavoriteFood({ favoriteFoods }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFoods = favoriteFoods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleQuickAdd = (food) => {
        const estimatedCalories = food.calories || 100;

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

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                {/* Clean Minimalist Header */}
                <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white p-6 rounded-b-3xl shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <button
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            onClick={() => router.visit('/home')}
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold flex items-center space-x-2">
                                <HeartSolid className="w-7 h-7 text-rose-300" />
                                <span>Makanan Favorit</span>
                            </h1>
                            <p className="text-white/80 text-sm flex items-center space-x-1 mt-1">
                                <SparklesIcon className="w-4 h-4" />
                                <span>{favoriteFoods.length} makanan tersimpan</span>
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
                                <HeartIcon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-xs text-white/90">Favorit</p>
                        </div>
                    </div>

                    {/* Clean Search Bar */}
                    {favoriteFoods.length > 0 && (
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                            <input
                                type="text"
                                placeholder="Cari makanan favorit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="px-4 py-6">
                    {/* Empty State */}
                    {favoriteFoods.length === 0 ? (
                        <div className={`${variants.card.elevated} text-center py-12 px-6`}>
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <HeartIcon className="w-10 h-10 text-pink-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada makanan favorit</h3>
                            <p className="text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
                                Tambahkan makanan ke favorit saat menambah kalori untuk akses cepat berikutnya
                            </p>
                            <button
                                onClick={() => router.visit('/add-food')}
                                className={`${variants.button.primary} inline-flex items-center space-x-2`}
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Tambah Makanan</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Results count */}
                            {searchTerm && (
                                <div className="mb-4 px-2">
                                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                                        <MagnifyingGlassIcon className="w-4 h-4" />
                                        <span>{filteredFoods.length} dari {favoriteFoods.length} makanan ditemukan</span>
                                    </p>
                                </div>
                            )}

                            {/* Enhanced Favorite Foods List */}
                            <div className="space-y-4">
                                {filteredFoods.map((food) => (
                                    <div key={food.id} className={`${variants.card.elevated} p-4 hover:shadow-lg transition-all duration-200 group`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                                                    <span className="text-white font-bold text-xl">
                                                        {food.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-pink-600 transition-colors">
                                                        {food.name}
                                                    </h4>
                                                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                                                        <div className="flex items-center space-x-1">
                                                            <FireIcon className="w-4 h-4 text-orange-500" />
                                                            <span className="font-semibold text-orange-600">
                                                                {formatNumber(food.calories || 0)} kal/porsi
                                                            </span>
                                                        </div>
                                                        {food.brand && (
                                                            <div className="flex items-center space-x-1">
                                                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                                <span className="text-gray-500">{food.brand}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuickAdd(food)}
                                                    className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-xl transition-all hover:scale-105 shadow-md"
                                                    title="Quick Add ke Kalori Hari Ini"
                                                >
                                                    <PlusIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(food.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-all hover:scale-105 shadow-md"
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
                                <div className={`${variants.card.base} text-center py-12`}>
                                    <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ditemukan</h3>
                                    <p className="text-gray-500">
                                        Tidak ada makanan yang cocok dengan "<span className="font-medium text-pink-600">{searchTerm}</span>"
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MobileLayout>
    );
}
