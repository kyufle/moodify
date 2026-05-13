<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{
    protected $fillable = ['user_id', 'name', 'icon', 'color', 'time', 'is_active'];

    public function logs()
    {
        return $this->hasMany(HabitLog::class);
    }
}