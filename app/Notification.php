<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable=[
        'text','status','receiver_id','receiver_table','source_id','source_table'
    ];
}
