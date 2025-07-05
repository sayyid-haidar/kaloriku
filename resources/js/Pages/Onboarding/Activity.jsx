import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Activity({ activityLevels }) {
    const { data, setData, post, processing, errors } = useForm({
        activity_level_id: '',
    });

    const [selectedActivity, setSelectedActivity] = useState('');

    const submit = (e) => {
        e.preventDefault();
        post(route('onboarding.activity'));
    };

    const selectActivity = (activityId) => {
        setSelectedActivity(activityId);
        setData('activity_level_id', activityId);
    };

    const getActivityIcon = (name) => {
        const icons = {
            'Sedentary': '🛋️',
            'Lightly Active': '🚶‍♂️',
            'Moderately Active': '🏃‍♂️',
            'Very Active': '🏃‍♀️',
            'Extra Active': '🏋️‍♂️'
        };
        return icons[name] || '🏃‍♂️';
    };

    const getActivityDescription = (name) => {
        const descriptions = {
            'Sedentary': 'Tidak berolahraga',
            'Lightly Active': 'Berolahraga 1-3 hari seminggu',
            'Moderately Active': 'Berolahraga 3-5 hari seminggu',
            'Very Active': 'Berolahraga 6-7 hari seminggu',
            'Extra Active': 'Berolahraga sangat intens'
        };
        return descriptions[name] || 'Aktivitas fisik';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Head title="Seberapa Aktif Kamu?" />

            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Header with back arrow */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href={route('onboarding.profile')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Seberapa Aktif Kamu?</h1>
                        <div className="w-6"></div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-4">
                            {activityLevels.map((activity) => (
                                <div
                                    key={activity.id}
                                    onClick={() => selectActivity(activity.id)}
                                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                                        selectedActivity === activity.id
                                            ? 'bg-blue-50 ring-2 ring-blue-500'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">{activity.name}</h3>
                                        <p className="text-gray-600 text-sm">{getActivityDescription(activity.name)}</p>
                                    </div>
                                    <div className="ml-4">
                                        <div className="w-16 h-16 bg-orange-200 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">{getActivityIcon(activity.name)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errors.activity_level_id && (
                            <p className="text-red-500 text-xs mt-2">{errors.activity_level_id}</p>
                        )}

                        <button
                            type="submit"
                            disabled={processing || !selectedActivity}
                            className="w-full bg-blue-300 hover:bg-blue-400 disabled:opacity-50 text-gray-800 font-semibold py-4 rounded-xl transition-colors mt-8"
                        >
                            {processing ? 'Menghitung...' : 'Hitung Kaloriku'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
