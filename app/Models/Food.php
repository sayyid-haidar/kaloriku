<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    protected $table = 'foods';

    protected $fillable = [
        'name',
        'calories_per_100g',
        'description',
        'brand',
        'tags',
        'is_verified',
        'created_by_user_id',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_verified' => 'boolean',
        'calories_per_100g' => 'decimal:2',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function calorieEntries()
    {
        return $this->hasMany(CalorieEntry::class);
    }

    public function userFavoriteFoods()
    {
        return $this->hasMany(UserFavoriteFood::class);
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByName($query, $name)
    {
        return $query->where('name', 'like', '%' . $name . '%');
    }

    // Accessors
    public function getCaloriesFormattedAttribute()
    {
        return number_format((float) $this->calories_per_100g, 0) . ' kal/100g';
    }

    public function getTagListAttribute()
    {
        return $this->tags ? implode(', ', $this->tags) : '';
    }

    // Static methods
    public static function findOrCreateByName($name, $calories = null)
    {
        return static::firstOrCreate(
            ['name' => trim($name)],
            [
                'calories_per_100g' => $calories ?? 100,
                'is_verified' => false,
            ]
        );
    }
}
