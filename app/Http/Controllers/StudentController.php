<?php

namespace App\Http\Controllers;

use App\Student;
use Illuminate\Http\Request;

use App\Http\Requests;

class StudentController extends Controller
{
    public function getAll() {
        $students = Student::all();
        return json_encode($students);
    }
}
