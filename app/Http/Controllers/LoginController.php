<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class LoginController extends Controller
{
    public function setType($type){
        session()->put('userType', $type);
        return redirect('/login');
    }
}
