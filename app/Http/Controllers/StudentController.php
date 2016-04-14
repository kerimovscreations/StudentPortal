<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class StudentController extends Controller
{
    public function __construct(){
        $this->middleware('student');
    }
    public function index(){
        return 'Student have logged in!';
    }
}
