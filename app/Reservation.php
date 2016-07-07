<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'description', 'student_id', 'mentor_id', 'place_id', 'date', 'status', 'start_time', 'end_time'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    
    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
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
