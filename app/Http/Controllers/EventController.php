<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class EventController extends Controller
{
    protected $fillable=[
        'title','description','date','start_time','end_time','type',
        'group_id','place_id','status','owner_id','owner_table',
        'responsible_first_id','responsible_first_table',
        'responsible_second_id', 'responsible_second_table'
    ];

    public function store(Request $request){

    }

    public function group(){
        return $this->belongsTo('App\Group');
    }

    public function place(){
        return $this->belongsTo('App\Place');
    }
}
