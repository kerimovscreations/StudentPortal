<?php

namespace App\Http\Controllers;

use App\Teacher;
use Illuminate\Http\Request;

use App\Http\Requests;

class TeacherController extends Controller
{

    public function getAll()
    {
        $teachers = Teacher::all();
        return json_encode($teachers);
    }
    
}
