import { Head, Link, useForm } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import {
    ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function EditProfilePage({ auth, userProfile, activityLevels }) {
    const [selectedGender, setSelectedGender] = useState(userProfile?.gender || 'male');
    const [selectedActivity, setSelectedActivity] = useState(userProfile?.activity_level_id || 1);

    const { data, setData, put, processing, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        gender: userProfile?.gender || 'male',
        age: userProfile?.age || '',
        weight: userProfile?.weight || '',
        height: userProfile?.height || '',
        activity_level_id: userProfile?.activity_level_id || 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('profile.update'));
    };

    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
        setData('gender', gender);
    };

    const handleActivityChange = (activityId, activityName) => {
        setSelectedActivity(activityId);
        setData('activity_level_id', activityId);
    };

    return (
        <MobileLayout showAddButton={false}>
            <Head title="Edit Profil" />

            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Link href="/profile" className="p-2 -ml-2">
                        <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">Edit Profil</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen pb-20">
                <form onSubmit={handleSubmit} className="p-4 space-y-6">

                    {/* Basic Info */}
                    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Gender Selection */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Jenis Kelamin</h3>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => handleGenderChange('male')}
                                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                                    selectedGender === 'male'
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                }`}
                            >
                                Pria
                            </button>
                            <button
                                type="button"
                                onClick={() => handleGenderChange('female')}
                                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                                    selectedGender === 'female'
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                }`}
                            >
                                Wanita
                            </button>
                        </div>
                    </div>

                    {/* Physical Info */}
                    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Usia
                            </label>
                            <input
                                type="number"
                                value={data.age}
                                onChange={e => setData('age', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Masukkan usia"
                                min="1"
                                max="120"
                            />
                            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Berat Badan (kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={data.weight}
                                onChange={e => setData('weight', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Masukkan berat badan"
                                min="1"
                                max="500"
                            />
                            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tinggi Badan (cm)
                            </label>
                            <input
                                type="number"
                                value={data.height}
                                onChange={e => setData('height', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Masukkan tinggi badan"
                                min="50"
                                max="300"
                            />
                            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                        </div>
                    </div>

                    {/* Activity Level */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tingkat Aktivitas</h3>
                        <div className="space-y-3">
                            {activityLevels?.map((level) => (
                                <button
                                    key={level.id}
                                    type="button"
                                    onClick={() => handleActivityChange(level.id, level.name)}
                                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                                        selectedActivity === level.id
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                                                <span className="text-orange-600 text-xs">👤</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500">
                                                    {level.id === 1 ? 'Tidak Aktif' :
                                                     level.id === 2 ? 'Ringan' :
                                                     level.id === 3 ? 'Sedang' :
                                                     level.id === 4 ? 'Aktif' : 'Sangat Aktif'}
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-gray-900">{level.name}</h4>
                                            <p className="text-sm text-gray-600">{level.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </MobileLayout>
    );
}
