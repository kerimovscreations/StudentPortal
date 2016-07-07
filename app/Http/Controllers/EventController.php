<?php

namespace App\Http\Controllers;

use App\Event;
use App\Group;
use App\Lesson;
use App\Mentor;
use App\Notification;
use App\Place;
use App\Reservation;
use App\Student;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{

    public function getWeekly($data1,$data2) {
        $events = array();
        if(Auth::guard('teacher')->check()){
            array_push($events,[Lesson::where('date', '>=', $data1)->where('date', '<=', $data2)->get(),'type'=>'lesson']);
            array_push($events,[Reservation::where('date', '>=', $data1)->where('date', '<=', $data2)->get(),'type'=>'reservation']);
        }else if(Auth::guard('mentor')->check()){
            array_push($events,[Reservation::where('mentor_id',Auth::guard('mentor')->user()->id)->where('date', '>=', $data1)->where('date', '<=', $data2)->get(),'type'=>'reservation']);
        }else if(Auth::guard('student')->check()){
            array_push($events,[Reservation::where('student_id',Auth::guard('student')->user()->id)->where('date', '>=', $data1)->where('date', '<=', $data2)->get(),'type'=>'reservation']);
        }
        return json_encode($events);
    }
    
}
