import { Head } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function History({ weeklyData, dailySummaries, totalCalories }) {
    const maxCalories = Math.max(...weeklyData.map(day => day.calories));

    return (
        <MobileLayout>
            <Head title="Riwayat Kalori" />

            <div className="px-6 py-6">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 text-gray-600 hover:text-gray-900 mr-3"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat</h1>
                </div>

                {/* Total Calories */}
                <div className="mb-6">
                    <h2 className="text-sm text-gray-600 mb-1">Total Kalori</h2>
                    <p className="text-4xl font-bold text-gray-900">{totalCalories.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">7 Hari Terakhir</p>
                </div>

                {/* Weekly Chart */}
                <div className="mb-8">
                    <div className="flex items-end justify-between h-40 mb-4">
                        {weeklyData.map((day, index) => {
                            const height = maxCalories > 0 ? (day.calories / maxCalories) * 100 : 0;
                            return (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <div
                                        className="w-8 bg-blue-600 rounded-t-md mb-2 transition-all duration-300"
                                        style={{ height: `${Math.max(height, 4)}%` }}
                                    ></div>
                                    <span className="text-xs text-gray-600 font-medium">
                                        {day.day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Daily Summary */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan</h3>

                    {dailySummaries.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Belum ada data kalori</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {dailySummaries.map((summary, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {summary.day_name}, {summary.formatted_date}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {summary.calories.toLocaleString()} kalori
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-sm">
                                                {Math.round(summary.calories / 100)}
                                            </span>
                                        </div>
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
