<?php

namespace App\Http\Controllers;

use App\Student;
use App\Teacher;
use Illuminate\Http\Request;

use App\Http\Requests;

class UserController extends Controller
{
    public function update(Request $request)
    {
        $user = null;
        if ($request['table'] == 'teachers') {
            $user = Teacher::findOrFail($request['id']);
        } else if ($request['table'] == 'students') {
            $user = Student::findOrFail($request['id']);
        }
        $user->update($request->all());
    }
}
