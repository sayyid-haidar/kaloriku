import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    ClockIcon,
    UserIcon,
    HeartIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeSolid,
    ClockIcon as ClockSolid,
    UserIcon as UserSolid,
    HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';

export default function MobileLayout({ children, showAddButton = true }) {
    const { url } = usePage();

    const navigation = [
        {
            name: 'Hari Ini',
            href: '/home',
            icon: HomeIcon,
            activeIcon: HomeSolid,
            current: url === '/home' || url === '/dashboard'
        },
        {
            name: 'Riwayat',
            href: '/history',
            icon: ClockIcon,
            activeIcon: ClockSolid,
            current: url === '/history'
        },
        {
            name: 'Makanan',
            href: '/favorites',
            icon: HeartIcon,
            activeIcon: HeartSolid,
            current: url === '/favorites'
        },
        {
            name: 'Profil',
            href: '/profile',
            icon: UserIcon,
            activeIcon: UserSolid,
            current: url === '/profile' || url.startsWith('/profile/')
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            {/* Mobile Container */}
            <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-xl">
                {/* Main Content */}
                <main className="pb-20">
                    {children}
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
                    <div className="flex justify-around items-center">
                        {navigation.map((item) => {
                            const Icon = item.current ? item.activeIcon : item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                                        item.current
                                            ? 'text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Floating Add Button */}
                {showAddButton && (
                    <Link
                        href="/add-food"
                        className="absolute bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors z-10"
                    >
                        <PlusIcon className="h-6 w-6" />
                    </Link>
                )}
            </div>
        </div>
    );
}
