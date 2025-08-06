<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'KaloriKu') }}</title>

        <!-- Custom Favicon -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/favicon.ico">

        <!-- SEO Meta Tags -->
        <meta name="description" content="KaloriKu - Aplikasi tracking kalori harian yang mudah dan praktis. Pantau asupan kalori, kelola makanan favorit, dan capai target kesehatan Anda.">
        <meta name="keywords" content="kalori, tracking kalori, diet sehat, nutrisi, makanan, kesehatan">
        <meta name="author" content="KaloriKu Team">

        <!-- PWA Meta Tags -->
        <meta name="theme-color" content="#22c55e">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="KaloriKu">

        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="KaloriKu - Tracking Kalori Harian">
        <meta property="og:description" content="Aplikasi tracking kalori yang mudah dan praktis untuk hidup sehat">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:image" content="{{ url('/favicon.ico') }}">

        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="KaloriKu - Tracking Kalori Harian">
        <meta name="twitter:description" content="Aplikasi tracking kalori yang mudah dan praktis untuk hidup sehat">
        <meta name="twitter:image" content="{{ url('/favicon.ico') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
