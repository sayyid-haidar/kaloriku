import { Head } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import { CogIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ user, calories, todayFoods }) {
    const progressPercentage = Math.min((calories.consumed / calories.target) * 100, 100);

    return (
        <MobileLayout>
            <Head title="KaloriKu - Home" />

            <div className="px-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">KaloriKu</h1>
                    <button className="p-2 text-gray-600 hover:text-gray-900">
                        <CogIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Greeting */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {user.greeting}, {user.name.split(' ')[0]}!
                    </h2>
                </div>

                {/* Calorie Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-medium text-gray-900">
                            {calories.consumed} / {calories.target} kkal
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Today's Food Section */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Food</h3>

                    {todayFoods.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Belum ada makanan yang dicatat hari ini</p>
                            <p className="text-sm text-gray-400">Tambahkan makanan pertama Anda!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {todayFoods.map((food, index) => (
                                <div key={`${food.id}-${index}`} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
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
                                        <p className="text-blue-600 font-medium">{food.calories} kkal</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">{food.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    );
}
