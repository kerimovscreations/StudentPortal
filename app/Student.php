<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Carbon\Carbon;

class Student extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'phone', 'birthDate', 'group_id','api_token','bio'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token','api_token'
    ];

    public function group(){
        return $this->belongsTo('App\Group');
    }

    public function setCreatedAtAttribute($value)
    {
        $this->attributes['created_at'] = Carbon::createFromTimestamp(strtotime($value))
            ->timezone('Asia/Baku')
            ->toDateTimeString();
    }
    public function setUpdatedAtAttribute($value)
    {
        $this->attributes['updated_at'] = Carbon::createFromTimestamp(strtotime($value->subHour()))
            ->timezone('Asia/Baku')
            ->toDateTimeString();
    }
}
