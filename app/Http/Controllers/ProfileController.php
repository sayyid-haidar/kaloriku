<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\ActivityLevel;
use App\Models\UserProfile;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $userProfile = UserProfile::where('user_id', $user->id)->first();
        $activityLevel = null;

        if ($userProfile && $userProfile->activity_level_id) {
            $activityLevel = ActivityLevel::find($userProfile->activity_level_id);
        }

        return Inertia::render('Profile/ProfilePage', [
            'auth' => [
                'user' => $user
            ],
            'userProfile' => $userProfile,
            'activityLevel' => $activityLevel,
            'status' => session('status'),
        ]);
    }

    /**
     * Display the user's profile edit form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $userProfile = UserProfile::where('user_id', $user->id)->first();
        $activityLevels = ActivityLevel::all();

        return Inertia::render('Profile/EditProfilePage', [
            'auth' => [
                'user' => $user
            ],
            'userProfile' => $userProfile,
            'activityLevels' => $activityLevels,
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
            'gender' => 'nullable|in:male,female,other',
            'age' => 'nullable|integer|min:1|max:120',
            'weight' => 'nullable|numeric|min:1|max:500',
            'height' => 'nullable|numeric|min:50|max:300',
            'activity_level_id' => 'nullable|exists:activity_levels,id',
        ]);

        $user = $request->user();

        // Update user basic info
        $user->fill([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($user->isDirty('email')) {
            $user->forceFill(['email_verified_at' => null]);
        }

        $user->save();

        // Update or create user profile if additional data is provided
        if ($request->has(['gender', 'age', 'weight', 'height', 'activity_level_id'])) {
            $profileData = [
                'user_id' => $user->id,
                'gender' => $request->gender,
                'age' => $request->age,
                'weight' => $request->weight,
                'height' => $request->height,
                'activity_level_id' => $request->activity_level_id,
            ];

            // Calculate BMI if weight and height are provided
            if ($request->weight && $request->height) {
                $heightInMeters = $request->height / 100;
                $profileData['bmi'] = $request->weight / ($heightInMeters * $heightInMeters);
            }

            // Calculate daily calorie target if all required data is available
            if ($request->weight && $request->height && $request->age && $request->gender && $request->activity_level_id) {
                $activityLevel = ActivityLevel::find($request->activity_level_id);

                // Calculate BMR using Mifflin-St Jeor Equation
                if ($request->gender === 'male') {
                    $bmr = (10 * $request->weight) + (6.25 * $request->height) - (5 * $request->age) + 5;
                } else {
                    $bmr = (10 * $request->weight) + (6.25 * $request->height) - (5 * $request->age) - 161;
                }

                // Apply activity multiplier
                $dailyCalories = $bmr * $activityLevel->multiplier;
                $profileData['daily_calorie_target'] = round($dailyCalories);
            }

            UserProfile::updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
        }

        return Redirect::route('profile.index')->with('status', 'Profil berhasil diperbarui!');
    }

    /**
     * Display the password update form.
     */
    public function showPasswordForm(Request $request): Response
    {
        return Inertia::render('Profile/UpdatePasswordPage', [
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return Redirect::route('profile.index')->with('status', 'Password berhasil diubah!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
