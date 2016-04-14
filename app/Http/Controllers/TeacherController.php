<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class TeacherController extends Controller
{
    public function __construct(){
        $this->middleware('teacher');
    }
    public function index(){
        return 'Teacher have logged in!';
    }
}
