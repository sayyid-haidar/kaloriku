export default function ApplicationLogo(props) {
    return (
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                {...props}
            >
                <path d="M12 2l2.09 6.26L20 8.18l-5.91 4.56L16.18 20 12 17.27 7.82 20l2.09-7.26L4 8.18l5.91-.08L12 2z" />
                <circle cx="12" cy="15" r="2" opacity="0.7" />
            </svg>
        </div>
    );
}
