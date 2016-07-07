<?php

namespace App\Http\Controllers;

use App\Mentor;
use App\Notification;
use App\Reservation;
use App\Student;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request;

        $data['title'] = Student::findOrFail($data['student_id'])->name;

        $reservation = Reservation::create($data->all());

        $result_mail = [];
        if (Auth::guard('student')->check()) {
            Notification::create([
                'text' => 'New reservation request',
                'status' => 0,
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);

            $sender = Student::find($reservation->student_id)->name;
            $receiver = Mentor::find($reservation->mentor_id)->name;

            Notification::create([
                'text' => $sender . ' has requested a reservation to ' . $receiver,
                'status' => 1,
                'receiver_id' => 0,
                'receiver_table' => 'teachers',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);

            $result_mail[0] = [
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'subject' => 'New reservation request',
                'source_id' => $reservation->id,
                'source_table' => 'reservations',
                'type' => 'request_extra'
            ];
        } else {
            Notification::create([
                'text' => 'New Reservation',
                'status' => 0,
                'receiver_id' => $reservation->student_id,
                'receiver_table' => 'students',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);
            Notification::create([
                'text' => 'New reservation',
                'status' => 0,
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);
            $mail1 = [
                'receiver_id' => $reservation->student_id,
                'receiver_table' => 'students',
                'subject' => 'New reservation',
                'source_id' => $reservation->id,
                'source_table' => 'reservations',
                'type' => 'decided_extra'
            ];
            $mail2 = [
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'subject' => 'New reservation',
                'source_id' => $reservation->id,
                'source_table' => 'reservations',
                'type' => 'decided_extra'
            ];
            array_push($result_mail, $mail1, $mail2);
        }
        EmailController::send($result_mail);
    }

    public function get(Reservation $reservation)
    {
        $reservation->student_name = $reservation->student()->first()->name;
        $reservation->mentor_name = $reservation->mentor()->first()->name;
        $reservation->place_name = $reservation->place()->first()->name;
        return json_encode($reservation);
    }

    public function changeTime(Request $request)
    {
        $result_mail = [];
        $reservation = Reservation::findOrFail($request['id']);
        Notification::where('source_table', 'reservations')->where('source_id', $reservation->id)->delete();
        $reservation->start_time = $request['startTime'];
        $reservation->end_time = $request['endTime'];
        if ($request['from'] == 'student') {
            Notification::create([
                'text' => 'Reservation time has changed',
                'status' => 0,
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);
            $result_mail[0] = [
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'subject' => 'Reservation time has changed',
                'source_id' => $reservation->id,
                'source_table' => 'reservations',
                'type' => 'time_changed_extra'
            ];
        } else {
            Notification::create([
                'text' => 'Reservation time has changed',
                'status' => 0,
                'receiver_id' => $reservation->student_id,
                'receiver_table' => 'students',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);
            $result_mail[0] = [
                'receiver_id' => $reservation->student_id,
                'receiver_table' => 'students',
                'subject' => 'Reservation time has changed',
                'source_id' => $reservation->id,
                'source_table' => 'reservations',
                'type' => 'time_changed_extra'
            ];
        }
        $reservation->save();
        EmailController::send($result_mail);
    }

    public function changeStatus(Request $request)
    {
        $result_mail = [];
        $reservation = Reservation::findOrFail($request['id']);
        $reservation->status = $request['status'];

        $reservation->save();

        $sender = $reservation->student()->first()->name;
        $receiver = $reservation->mentor()->first()->name;

        if ($reservation->status == 1) {
            Notification::where('source_table', 'reservations')->where('source_id', $reservation->id)->where('receiver_table', '<>', 'teachers')->delete();

            Notification::create([
                'text' => $receiver . ' has completed reservation with ' . $sender,
                'status' => 1,
                'receiver_id' => 0,
                'receiver_table' => 'teachers',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);
        } else if ($reservation->status == 2) {
            Notification::where('source_table', 'reservations')->where('source_id', $reservation->id)->where('receiver_table', '<>', 'teachers')->delete();

            if ($request['from'] == 'student') {
                Notification::create([
                    'text' => 'Reservation rejected',
                    'status' => 0,
                    'receiver_id' => $reservation->mentor_id,
                    'receiver_table' => 'mentors',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations']);

                Notification::create([
                    'text' => $sender . ' has rejected reservation from ' . $receiver,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations']);

                $result_mail[0] = [
                    'receiver_id' => $reservation->mentor_id,
                    'receiver_table' => 'mentors',
                    'subject' => 'Reservation rejected',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations',
                    'type' => 'rejected_extra'
                ];
            } else {
                Notification::create([
                    'text' => 'Reservation rejected',
                    'status' => 0,
                    'receiver_id' => $reservation->student_id,
                    'receiver_table' => 'students',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations']);

                Notification::create([
                    'text' => $receiver . ' has rejected reservation from ' . $sender,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations']);

                $result_mail[0] = [
                    'receiver_id' => $reservation->student_id,
                    'receiver_table' => 'students',
                    'subject' => 'Reservation rejected',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations',
                    'type' => 'rejected_extra'
                ];
            }
        }

        if ($reservation->status == 0) {
            Notification::where('source_table', 'reservations')->where('source_id', $reservation->id)->where('receiver_table', '<>', 'teachers')->delete();

            if ($request['from'] == 'student') {
                Notification::create([
                    'text' => 'Reservation accepted',
                    'status' => 0,
                    'receiver_id' => $reservation->student_id,
                    'receiver_table' => 'mentors',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations']);

                Notification::create([
                    'text' => $sender . ' has accepted reservation from ' . $receiver,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations']);

                $result_mail[0] = [
                    'receiver_id' => $reservation->mentor_id,
                    'receiver_table' => 'mentors',
                    'subject' => 'Reservation accepted',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations',
                    'type' => 'accepted_extra'
                ];
            } else {
                Notification::create([
                    'text' => 'Reservation accepted',
                    'status' => 0,
                    'receiver_id' => $reservation->student_id,
                    'receiver_table' => 'students',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations']);

                Notification::create([
                    'text' => $receiver . ' has accepted reservation from ' . $sender,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations']);

                $result_mail[0] = [
                    'receiver_id' => $reservation->student_id,
                    'receiver_table' => 'students',
                    'subject' => 'Reservation decided',
                    'source_id' => $reservation->id,
                    'source_table' => 'reservations',
                    'type' => 'accepted_extra'
                ];
            }
        }
        EmailController::send($result_mail);
    }

    public function update(Request $request)
    {
        $reservation = Reservation::findOrFail($request['id']);

        Notification::where('source_table', 'reservations')->where('source_id', $reservation->id)->delete();

        if ($reservation->mentor_id != $request['mentor_id']) {
            $result_mail = [];
            $result_mail[0] = [
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'subject' => 'Reservation cancelled',
                'source_id' => $reservation->id,
                'source_table' => 'reservations',
                'type' => 'cancelled_extra'
            ];
            $result_mail[1] = [
                'receiver_id' => $request['mentor_id'],
                'receiver_table' => 'mentors',
                'subject' => 'New reservation request',
                'source_id' => $reservation->id,
                'source_table' => 'reservations',
                'type' => 'request_extra'
            ];
            
            $reservation->update($request->all());

            EmailController::send($result_mail);

            Notification::create([
                'text' => 'New reservation request',
                'status' => 0,
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);

            $sender = $reservation->student()->first()->name;
            $receiver = $reservation->mentor()->first()->name;
            $new_receiver = Mentor::find($request['mentor_id'])->name;

            Notification::create([
                'text' => $sender . ' has changed mentor - ' . $receiver . ' to ' . $new_receiver,
                'status' => 1,
                'receiver_id' => 0,
                'receiver_table' => 'teachers',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);
        } else {
            $reservation->update($request->all());

            $result_mail = [];

            $mail = [
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'subject' => 'Reservation updated',
                'source_id' => $reservation->id,
                'source_table' => 'reservations',
                'type' => 'updated_extra'
            ];
            array_push($result_mail, $mail);
            EmailController::send($result_mail);

            Notification::create([
                'text' => 'Reservation updated',
                'status' => 0,
                'receiver_id' => $reservation->mentor_id,
                'receiver_table' => 'mentors',
                'source_id' => $reservation->id,
                'source_table' => 'reservations']);
        }
    }

    public function delete(Request $request)
    {
        $reservation = Reservation::findOrFail($request['id']);
        Notification::where('source_table', 'reservations')->where('source_id', $reservation->id)->delete();

        $result_mail = [];

        $mail = [
            'receiver_id' => $reservation->mentor_id,
            'receiver_table' => 'mentors',
            'subject' => 'Reservation deleted',
            'source_id' => $reservation->id,
            'source_table' => 'reservations',
            'type' => 'deleted_extra'
        ];
        array_push($result_mail, $mail);

        EmailController::send($result_mail);

        $reservation->delete();
    }
}
