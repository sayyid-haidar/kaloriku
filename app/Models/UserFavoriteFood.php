<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFavoriteFood extends Model
{
    protected $table = 'user_favorite_foods';
    public $incrementing = false;
    protected $primaryKey = null;
    protected $fillable = [
        'user_id',
        'food_id',
        'note',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
