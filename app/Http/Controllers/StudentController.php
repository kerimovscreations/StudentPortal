<?php

namespace App\Http\Controllers;

use App\Student;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function getAll() {
        $students = Student::all();
        return json_encode($students);
    }
    public function getAllWithAttendances($date) {
        $students = Student::all();
        foreach ($students as $student) {
            $student->attendance=DB::table('attendances')->where('student_id',$student->id)->where('date',$date)->first();
        }
        return json_encode($students);
    }
}
