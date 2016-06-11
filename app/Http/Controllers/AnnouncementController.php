<?php

namespace App\Http\Controllers;

use App\Announcement;
use App\Notification;
use Illuminate\Http\Request;

use App\Http\Requests;

class AnnouncementController extends Controller
{
    public function store(Request $request){
        $announcement=new Announcement();
        $announcement->body=$request['body'];
        $announcement->owner_id=$request['owner_id'];
        $announcement->save();
        $announcement->groups()->sync($request['group_list']);

        $result_mail=[];

        foreach($request['group_list'] as $group_id){
            $notification=new Notification();
            $notification->text='New announcement';
            $notification->receiver_id=$group_id;
            $notification->receiver_table='groups';
            $notification->source_id=$announcement->id;
            $notification->source_table='announcements';
            $notification->save();

            $mail1 = [
                'receiver_id' => $group_id,
                'receiver_table' => 'groups',
                'subject' => 'New Announcement',
                'source_id' => $announcement->id,
                'source_table' => 'announcements',
                'type' => 'group_announcement'
            ];
            array_push($result_mail, $mail1);
        }
        EmailController::send($result_mail);
    }

    public function delete(Request $request){
        $announcement=Announcement::find($request['id']);
        $announcement->delete();
        $notification=Notification::where([['source_table','announcements'],['source_id',$request['id']]]);
        $notification->delete();
    }
}
