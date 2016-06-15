<?php

namespace App\Policies;

use App\Announcement;
use App\Teacher;
use Illuminate\Auth\Access\HandlesAuthorization;

class AnnouncementPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function update(Teacher $teacher, Announcement $announcement)
    {
        return $teacher->id === $announcement->owner_id;
    }

    public function delete(Teacher $teacher, Announcement $announcement)
    {
        return $teacher->id === $announcement->owner_id;
    }
}
