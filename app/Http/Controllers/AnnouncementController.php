<?php

namespace App\Http\Controllers;

use Gate;
use App\Announcement;
use App\Notification;
use App\Teacher;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function getAll()
    {
        $announcements = Announcement::all();
        $groups = array();
        $owner = array();
        foreach ($announcements as $announcement) {
            array_push($groups, $announcement->groups);
            array_push($owner, $announcement->owner);
        }
        $results = array();
        array_push($results, $announcements, $groups, $owner);
        return json_encode($results);
    }

    public function getById($id)
    {
        $announcement = Announcement::find($id);

        $announcement->groups;
        $announcement->owner;

        return json_encode($announcement);
    }

    public function update(Request $request)
    {
        $announcement = Announcement::find($request['id']);

        $teacher = Auth::guard('teacher')->user();

        $this->authorizeForUser($teacher, $announcement);
        
        $announcement->groups()->sync($request['group_list']);
        $announcement->update($request->all());

        $notification = Notification::where([['source_table', 'announcements'], ['source_id', $request['id']]]);
        $notification->delete();

        foreach ($request['group_list'] as $group_id) {
            $notification = new Notification();
            $notification->text = 'Announcement has been edited: "' . mb_strimwidth($announcement->body, 0, 87, '..."');
            $notification->receiver_id = $group_id;
            $notification->receiver_table = 'groups';
            $notification->source_id = $announcement->id;
            $notification->source_table = 'announcements';
            $notification->save();
        }

        return 1;
    }

    public function store(Request $request)
    {
        $announcement = new Announcement();
        $announcement->body = $request['body'];
        $announcement->owner_id = $request['owner_id'];
        $announcement->save();
        $announcement->groups()->sync($request['group_list']);

        $result_mail = [];

        foreach ($request['group_list'] as $group_id) {
            $notification = new Notification();
            $notification->text = 'New announcement: "' . mb_strimwidth($announcement->body, 0, 87, '..."');
            $notification->receiver_id = $group_id;
            $notification->receiver_table = 'groups';
            $notification->source_id = $announcement->id;
            $notification->source_table = 'announcements';
            $notification->save();

            $mail1 = [
                'receiver_id' => $group_id,
                'receiver_table' => 'groups',
                'subject' => 'New Announcement: "' . mb_strimwidth($announcement->body, 0, 47, '..."'),
                'source_id' => $announcement->id,
                'source_table' => 'announcements',
                'type' => 'group_announcement'
            ];
            array_push($result_mail, $mail1);
        }
        EmailController::send($result_mail);
    }

    public function delete(Request $request)
    {
        $announcement = Announcement::find($request['id']);

        $teacher = Auth::guard('teacher')->user();

        $this->authorizeForUser($teacher, $announcement);
        
        $announcement->delete();
        $notification = Notification::where([['source_table', 'announcements'], ['source_id', $request['id']]]);
        $notification->delete();
    }
}
