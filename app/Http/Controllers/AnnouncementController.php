<?php

namespace App\Http\Controllers;

use App\Announcement;
use Illuminate\Http\Request;

use App\Http\Requests;

class AnnouncementController extends Controller
{
    public function store(Request $request){
        $announcement=new Announcement();
        $announcement->body=$request['body'];
        $announcement->date=$request['date'];
        $announcement->teacher_id=$request['teacher_id'];
        $announcement->save();
        $announcement->groups()->sync($request['group_list']);
    }

    public function delete(Request $request){
        $announcement=Announcement::find($request['id']);
        $announcement->delete();
    }
}
