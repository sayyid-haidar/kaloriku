<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = [
        'name',
    ];

    // Relationships
    public function foods()
    {
        return $this->belongsToMany(Food::class, 'food_tags');
    }

    public function foodTags()
    {
        return $this->hasMany(FoodTag::class);
    }
}
