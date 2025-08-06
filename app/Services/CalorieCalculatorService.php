<?php

namespace App\Services;

use App\Models\Food;

class CalorieCalculatorService
{
    /**
     * Calculate calories based on food and portion.
     *
     * @param Food $food
     * @param float $portionInGrams
     * @return float
     */
    public static function calculateCalories(Food $food, float $portionInGrams): float
    {
        // Assuming default_calorie is per 100g
        return ($food->default_calorie * $portionInGrams) / 100;
    }

    /**
     * Validate portion size.
     *
     * @param float $portion
     * @return array
     */
    public static function validatePortion(float $portion): array
    {
        $errors = [];

        if ($portion <= 0) {
            $errors[] = 'Porsi harus lebih dari 0';
        }

        if ($portion < 0.1) {
            $errors[] = 'Porsi minimal adalah 0.1 gram';
        }

        if ($portion > 9999.99) {
            $errors[] = 'Porsi maksimal adalah 9999.99 gram';
        }

        return $errors;
    }

    /**
     * Format calorie display.
     *
     * @param float $calories
     * @return string
     */
    public static function formatCalories(float $calories): string
    {
        return number_format(round($calories, 2), 0) . ' kal';
    }
}
