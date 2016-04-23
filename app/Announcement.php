<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable=[
        'body','date','teacher_id'
    ];

    public function teacher(){
        return $this->belongsTo('App\Teacher');
    }

    public function groups(){
        return $this->belongsToMany('App\Group');
    }
}
