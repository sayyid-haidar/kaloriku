import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import MobileLayout from '@/Layouts/MobileLayout';
import { XMarkIcon, MagnifyingGlassIcon, PlusIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function AddFood({ foods, favoriteFoods }) {
    const [activeTab, setActiveTab] = useState('baru');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [portion, setPortion] = useState('100');
    const [isFavorite, setIsFavorite] = useState(false);

    const { data, setData, post, processing } = useForm({
        food_id: '',
        portion: 100,
        entry_date: new Date().toISOString().slice(0, 10),
    });

    const favoriteForm = useForm();

    // Filter foods based on search term
    const filteredFoods = foods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayFoods = activeTab === 'baru' ? filteredFoods : favoriteFoods;

    const handleFoodSelect = (food) => {
        setSelectedFood(food);
        setData('food_id', food.id);
        setIsFavorite(favoriteFoods.some(fav => fav.id === food.id));
    };

    const handleServingSizeChange = (value) => {
        setServingSize(value);
        setData('serving_size', parseInt(value));
    };

    const calculateCalories = () => {
        if (!selectedFood || !servingSize) return 0;
        return Math.round((selectedFood.calories * parseInt(servingSize)) / 100);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('calorie.store'));
    };

    const toggleFavorite = () => {
        if (isFavorite) {
            favoriteForm.delete(route('calorie.remove-favorite'), {
                data: { food_id: selectedFood.id },
                onSuccess: () => setIsFavorite(false)
            });
        } else {
            favoriteForm.post(route('calorie.add-favorite'), {
                food_id: selectedFood.id
            }, {
                onSuccess: () => setIsFavorite(true)
            });
        }
    };

    return (
        <MobileLayout>
            <Head title="Tambah Makanan" />

            <div className="px-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Makanan</h1>
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 text-gray-600 hover:text-gray-900"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-6">
                    <button
                        onClick={() => setActiveTab('baru')}
                        className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg ${
                            activeTab === 'baru'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Baru
                    </button>
                    <button
                        onClick={() => setActiveTab('favorit')}
                        className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg ${
                            activeTab === 'favorit'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Favorit
                    </button>
                </div>

                {/* Search Input - only show for "baru" tab */}
                {activeTab === 'baru' && (
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Nama Makanan"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                )}

                {/* Serving Size Input */}
                {selectedFood && (
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">{selectedFood.name}</h3>
                            <button
                                onClick={toggleFavorite}
                                className={`p-2 rounded-full ${
                                    isFavorite ? 'text-red-500' : 'text-gray-400'
                                }`}
                            >
                                {isFavorite ? (
                                    <HeartSolid className="h-5 w-5" />
                                ) : (
                                    <HeartIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jumlah Kalori (gram)
                            </label>
                            <input
                                type="number"
                                value={servingSize}
                                onChange={(e) => handleServingSizeChange(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                                min="1"
                            />
                        </div>

                        <div className="mb-4">
                            <p className="text-lg font-semibold text-blue-600">
                                {calculateCalories()} kalori
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Simpan ke Favorit
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isFavorite}
                                    onChange={toggleFavorite}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Tandai sebagai favorit
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Menambahkan...' : 'Tambah'}
                        </button>
                    </div>
                )}

                {/* Food List */}
                <div className="space-y-3">
                    {displayFoods.map((food) => (
                        <div
                            key={food.id}
                            onClick={() => handleFoodSelect(food)}
                            className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer transition-colors ${
                                selectedFood?.id === food.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{food.name}</h4>
                                <p className="text-sm text-gray-600">{food.calories} kalori</p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-blue-600">
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {displayFoods.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            {activeTab === 'baru'
                                ? 'Tidak ada makanan yang ditemukan'
                                : 'Belum ada makanan favorit'
                            }
                        </p>
                    </div>
                )}
            </div>
        </MobileLayout>
    );
}
