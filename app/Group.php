<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'place_id', 'email', 'status'
    ];

    public function place(){
        return $this->belongsTo(Place::class);
    }

    public function announcements(){
        return $this->hasMany(Announcement::class);
    }

    public function students(){
        return $this->hasMany(Student::class);
    }

    public function lessons(){
        return $this->hasMany(Lesson::class);
    }

}
