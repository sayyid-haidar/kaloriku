<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    protected $table = 'foods';

    protected $fillable = [
        'name',
        'default_calorie',
        'created_by_user_id',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'food_tags');
    }

    public function calorieEntries()
    {
        return $this->hasMany(CalorieEntry::class);
    }

    public function userFavoriteFoods()
    {
        return $this->hasMany(UserFavoriteFood::class);
    }
}
