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

        //$announcement->groups()->sync([1,2]);
        $announcement->save();
    }

    private function syncGroups(Announcement $announcement, array $groups){
        $announcement->groups()->sync($groups);
    }

    private function createAnnouncement(array $request){
        return $request;
        //$announcement=new Announcement($request['id']);

        //$this->syncGroups($announcement,$request['group_list']);
    }
}
