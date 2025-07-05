import { Head, Link } from '@inertiajs/react';

export default function Result({ profile }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Head title="Target Kalori Harian" />

            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Header with back arrow */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href={route('onboarding.activity')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">KaloriKu</h1>
                        <div className="w-6"></div>
                    </div>

                    <div className="text-center space-y-8">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900">
                            Target Kalori Harian
                        </h2>

                        {/* Calorie Display */}
                        <div className="py-8">
                            <div className="text-5xl font-bold text-gray-900 mb-4">
                                {profile.daily_calorie_target} kkal
                            </div>
                            <p className="text-gray-600">
                                BMI: {profile.bmi}
                            </p>
                        </div>

                        {/* Continue Button */}
                        <Link
                            href={route('dashboard')}
                            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-colors"
                        >
                            Lanjut ke Dashboard!
                        </Link>

                        {/* Additional Info */}
                        <div className="text-sm text-gray-500 space-y-2">
                            <p>Target kalori ini dihitung berdasarkan:</p>
                            <ul className="text-xs space-y-1">
                                <li>• Jenis kelamin: {profile.gender === 'male' ? 'Pria' : 'Wanita'}</li>
                                <li>• Usia: {profile.age} tahun</li>
                                <li>• Berat: {profile.weight} kg</li>
                                <li>• Tinggi: {profile.height} cm</li>
                                <li>• Aktivitas: {profile.activity_level?.name}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
