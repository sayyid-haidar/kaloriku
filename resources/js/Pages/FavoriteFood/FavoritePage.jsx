import { Head, router } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import { ChevronLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function FavoriteFood({ favoriteFoods }) {
    const handleEdit = (foodId) => {
        // Navigate to add food page with this food pre-selected
        router.get(route('calorie.create'), { food_id: foodId });
    };

    const handleRemove = (foodId) => {
        if (confirm('Hapus dari favorit?')) {
            router.delete(route('favorites.destroy', foodId));
        }
    };

    return (
        <MobileLayout showAddButton={false}>
            <Head title="Makanan Favorit" />

            <div className="px-6 py-6">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 text-gray-600 hover:text-gray-900 mr-3"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Makanan Favorit</h1>
                </div>

                {/* Favorite Foods List */}
                {favoriteFoods.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada makanan favorit</h3>
                        <p className="text-gray-500 mb-6">Tambahkan makanan ke favorit saat menambah kalori</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {favoriteFoods.map((food) => (
                            <div key={food.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                        {food.image ? (
                                            <img
                                                src={food.image}
                                                alt={food.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">
                                                    {food.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{food.name}</h4>
                                        <p className="text-sm text-blue-600 font-medium">{food.calories} kalori</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleEdit(food.id)}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Tabs Navigation - handled by MobileLayout */}
                <div className="mt-8 flex justify-center">
                    <div className="flex space-x-8">
                        <button className="flex flex-col items-center space-y-1 text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            <span className="text-xs">Beranda</span>
                        </button>
                        <button className="flex flex-col items-center space-y-1 text-blue-600">
                            <div className="w-8 h-8 rounded-full bg-blue-600"></div>
                            <span className="text-xs font-medium">Makanan</span>
                        </button>
                        <button className="flex flex-col items-center space-y-1 text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            <span className="text-xs">Laporan</span>
                        </button>
                        <button className="flex flex-col items-center space-y-1 text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            <span className="text-xs">Profil</span>
                        </button>
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
