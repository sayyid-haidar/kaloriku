<?php

use App\Http\Controllers\CalorieEntryController;
use App\Http\Controllers\FavoriteFoodController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Main app routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');

    // Calorie Entry Routes
    Route::get('/add-food', [CalorieEntryController::class, 'create'])->name('calorie.create');
    Route::post('/add-food', [CalorieEntryController::class, 'store'])->name('calorie.store');
    Route::post('/add-to-favorites', [CalorieEntryController::class, 'addToFavorites'])->name('calorie.add-favorite');
    Route::delete('/remove-from-favorites', [CalorieEntryController::class, 'removeFromFavorites'])->name('calorie.remove-favorite');

    // History Routes
    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');

    // Favorite Foods Routes
    Route::get('/favorites', [FavoriteFoodController::class, 'index'])->name('favorites.index');
    Route::delete('/favorites/{id}', [FavoriteFoodController::class, 'destroy'])->name('favorites.destroy');
});

// Onboarding Routes
Route::middleware('auth')->group(function () {
    Route::get('/onboarding/profile', [OnboardingController::class, 'showProfileForm'])->name('onboarding.profile');
    Route::post('/onboarding/profile', [OnboardingController::class, 'storeProfile']);
    Route::get('/onboarding/activity', [OnboardingController::class, 'showActivityForm'])->name('onboarding.activity');
    Route::post('/onboarding/activity', [OnboardingController::class, 'storeActivityAndCalculate']);
    Route::get('/onboarding/result', [OnboardingController::class, 'showResult'])->name('onboarding.result');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/password', [ProfileController::class, 'showPasswordForm'])->name('profile.password');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update.put');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
