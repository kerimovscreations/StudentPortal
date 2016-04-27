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

    public function groups(){
        return $this->hasMany('App\Group');
    }

    public function events(){
        return $this->hasMany('App\Event');
    }
}
