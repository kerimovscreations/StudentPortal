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

    public function update(Request $request){
        Attendance::where('date', $request['date'])->where('student_id', $request['student_id'])->delete();
        Attendance::create($request->all());
    }

    public function getAll()
    {
        if (Auth::guard('teacher')->check())
            return json_encode(Attendance::all());
        else
            abort(401);
        return back();
    }
}
