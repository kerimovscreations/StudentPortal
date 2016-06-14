<?php

namespace App\Http\Controllers;

use App\Mentor;
use Illuminate\Http\Request;

use App\Http\Requests;

class MentorController extends Controller
{

    public function getAll()
    {
        $mentors = Mentor::all();
        return json_encode($mentors);
    }
    
}
