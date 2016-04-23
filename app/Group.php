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
        return $this->belongsToMany('App\Announcement');
    }

}
