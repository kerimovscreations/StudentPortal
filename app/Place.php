<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name'
    ];

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
