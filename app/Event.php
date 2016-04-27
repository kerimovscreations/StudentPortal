<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable=[
      'title', 'description', 'type', 'date', 'start_time', 'end_time', 'group_id', 'place_id', 'status', 'owner_id', 'owner_table',
        'responsible_first_id', 'responsible_first_table', 'responsible_second_id', 'responsible_second_table'
    ];

    public function group(){
        return $this->belongsTo('App\Group');
    }

    public function place(){
        return $this->belongsTo('App\Place');
    }
}
