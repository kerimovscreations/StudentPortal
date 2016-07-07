<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'body', 'date', 'start_time', 'end_time', 
        'group_id', 'place_id', 'teacher_id'
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
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
