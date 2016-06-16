<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'phone', 'birthDate'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

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
