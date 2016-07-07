<?php

namespace App\Http\Controllers;

use App\Attendance;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function store(Request $request)
    {
        if (Auth::guard('teacher')->check()) {
            $attendances = $request['attendances'];
            DB::table('attendances')->where('date', $request['date'])->delete();
            foreach ($attendances as $attendance) {
                $temp = new Attendance(['student_id' => $attendance['student_id'],
                    'date' => $request['date'],
                    'status' => $attendance['status'],
                    'note' => $attendance['note']]);
                $temp->save();
            }
        } else
            abort(401);
    }

    public function getAll()
    {
        if (Auth::guard('teacher')->check())
            return json_encode(Attendance::all());
        else
            abort(401);
    }
}
