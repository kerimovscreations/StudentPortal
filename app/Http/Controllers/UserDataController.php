<?php

namespace App\Http\Controllers;

use App\Mentor;
use App\Student;
use App\Teacher;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class UserDataController extends Controller
{
    public function getDataUser($table, $id)
    {
        $user=null;
        if ($table == 'students') {
            if(Auth::guard('student')->check()){
                if(Auth::guard('student')->user()->id==$id){
                    $user = Student::findOrFail($id);
                    $user->group = Group::find($user->group_id)->name;
                }else{
                    return redirect('/');
                }
            }else if(Auth::guard('teacher')->check() || Auth::guard('mentor')->check()){
                $user = Student::findOrFail($id);
                $user->group = Group::find($user->group_id)->name;
            }
        } else if ($table == 'users') {
            $user = User::findOrFail($id);
        } else if($table == 'teachers'){
            $user = Teacher::findOrFail($id);
        }else if($table == 'mentors'){
            $user = Mentor::findOrFail($id);
        }
        return json_encode($user);
    }
}
