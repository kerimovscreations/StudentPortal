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
        'name', 'place_id'
    ];

    public function place(){
        return $this->belongsTo('App\Place');
    }

    public function announcements(){
        return $this->hasMany('App\Announcement');
    }

    public function students(){
        return $this->hasMany('App\Student');
    }

    public function events(){
        return $this->hasMany('App\Event');
    }

}
