<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class MentorController extends Controller
{
    public function __construct(){
        $this->middleware('mentor');
    }
    public function index(){
        return 'Mentor have logged in!';
    }
}
