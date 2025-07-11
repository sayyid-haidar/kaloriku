import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    ChartBarIcon,
    UserIcon,
    HeartIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeSolid,
    ChartBarIcon as ChartBarSolid,
    UserIcon as UserSolid,
    HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';

export default function MobileLayout({ children }) {
    const { url } = usePage();

    const navigation = [
        {
            name: 'Beranda',
            href: '/home',
            icon: HomeIcon,
            activeIcon: HomeSolid,
            current: url === '/home' || url === '/dashboard'
        },
        {
            name: 'Statistik',
            href: '/statistics/weekly',
            icon: ChartBarIcon,
            activeIcon: ChartBarSolid,
            current: url.startsWith('/statistics') || url === '/history'
        },
        {
            name: 'Tambah',
            href: '/add-food',
            icon: PlusIcon,
            activeIcon: PlusIcon,
            current: url === '/add-food',
            isAdd: true
        },
        {
            name: 'Favorit',
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
                <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
                    <div className="flex justify-around items-center py-2">
                        {navigation.map((item) => {
                            const Icon = item.current ? item.activeIcon : item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                                        item.isAdd
                                            ? 'bg-blue-600 text-white shadow-lg scale-110 -mt-2 rounded-full px-4 py-3'
                                            : item.current
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className={`h-6 w-6 ${item.isAdd ? 'h-7 w-7' : ''}`} />
                                    <span className={`text-xs font-medium ${item.isAdd ? 'text-xs' : ''}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}
