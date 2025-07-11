<?php

namespace Tests\Feature;

use App\Models\CalorieEntry;
use App\Models\Food;
use App\Models\User;
use App\Models\UserFavoriteFood;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CalorieEntryTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $food;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->food = Food::create([
            'name' => 'Test Food',
            'default_calorie' => 200, // 200 calories per 100g
        ]);
    }

    /** @test */
    public function user_can_view_add_food_page()
    {
        $response = $this->actingAs($this->user)
            ->get(route('calorie.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('CalorieEntry/AddFoodPage')
                ->has('foods')
                ->has('favoriteFoods')
                ->has('maxDate')
                ->has('minDate')
        );
    }

    /** @test */
    public function user_can_store_calorie_entry_with_valid_data()
    {
        $data = [
            'food_id' => $this->food->id,
            'portion' => 150.5,
            'entry_date' => now()->toDateString(),
        ];

        $response = $this->actingAs($this->user)
            ->post(route('calorie.store'), $data);

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('success', 'Makanan berhasil ditambahkan!');

        $this->assertDatabaseHas('calorie_entries', [
            'user_id' => $this->user->id,
            'food_id' => $this->food->id,
            'portion' => 150.5,
            'calorie_amount' => 301, // (200 * 150.5) / 100 = 301
        ]);

        // Check the entry exists and verify the date
        $entry = CalorieEntry::where('user_id', $this->user->id)
            ->where('food_id', $this->food->id)
            ->first();

        $this->assertNotNull($entry);
        $this->assertNotNull($entry->entry_date);
    }

    /** @test */
    public function storing_calorie_entry_fails_with_invalid_data()
    {
        $data = [
            'food_id' => 999, // Non-existent food
            'portion' => -10, // Invalid portion
            'entry_date' => 'invalid-date',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('calorie.store'), $data);

        $response->assertSessionHasErrors(['food_id', 'portion', 'entry_date']);
        $this->assertDatabaseCount('calorie_entries', 0);
    }

    /** @test */
    public function user_can_add_food_to_favorites()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('calorie.add-favorite'), [
                'food_id' => $this->food->id,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Makanan ditambahkan ke favorit!',
        ]);

        $this->assertDatabaseHas('user_favorite_foods', [
            'user_id' => $this->user->id,
            'food_id' => $this->food->id,
        ]);
    }

    /** @test */
    public function user_can_remove_food_from_favorites()
    {
        // First add to favorites
        UserFavoriteFood::create([
            'user_id' => $this->user->id,
            'food_id' => $this->food->id,
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson(route('calorie.remove-favorite'), [
                'food_id' => $this->food->id,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Makanan dihapus dari favorit!',
        ]);

        $this->assertDatabaseMissing('user_favorite_foods', [
            'user_id' => $this->user->id,
            'food_id' => $this->food->id,
        ]);
    }

    /** @test */
    public function favorite_operations_fail_with_invalid_food_id()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('calorie.add-favorite'), [
                'food_id' => 999,
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['food_id']);
    }

    /** @test */
    public function calorie_calculation_is_accurate()
    {
        // Test with different portions
        $testCases = [
            ['portion' => 100, 'expected_calories' => 200],
            ['portion' => 50, 'expected_calories' => 100],
            ['portion' => 200, 'expected_calories' => 400],
            ['portion' => 150.5, 'expected_calories' => 301],
        ];

        foreach ($testCases as $case) {
            $response = $this->actingAs($this->user)
                ->post(route('calorie.store'), [
                    'food_id' => $this->food->id,
                    'portion' => $case['portion'],
                    'entry_date' => now()->toDateString(),
                ]);

            $response->assertRedirect(route('home'));

            $entry = CalorieEntry::latest()->first();
            $this->assertEquals($case['expected_calories'], $entry->calorie_amount);

            // Clean up for next iteration
            $entry->delete();
        }
    }

    /** @test */
    public function portion_validation_works_correctly()
    {
        $invalidPortions = [-1, 0, 0.05, 10000];

        foreach ($invalidPortions as $portion) {
            $response = $this->actingAs($this->user)
                ->post(route('calorie.store'), [
                    'food_id' => $this->food->id,
                    'portion' => $portion,
                    'entry_date' => now()->toDateString(),
                ]);

            $response->assertSessionHasErrors(['portion']);
        }
    }

    /** @test */
    public function date_validation_works_correctly()
    {
        // Future date should fail
        $futureDate = now()->addDays(1)->toDateString();
        $response = $this->actingAs($this->user)
            ->post(route('calorie.store'), [
                'food_id' => $this->food->id,
                'portion' => 100,
                'entry_date' => $futureDate,
            ]);

        $response->assertSessionHasErrors(['entry_date']);

        // Very old date should fail
        $oldDate = now()->subYears(2)->toDateString();
        $response = $this->actingAs($this->user)
            ->post(route('calorie.store'), [
                'food_id' => $this->food->id,
                'portion' => 100,
                'entry_date' => $oldDate,
            ]);

        $response->assertSessionHasErrors(['entry_date']);
    }
}
