<?php

namespace App\Http\Controllers;

use App\Section;
use Illuminate\Http\Request;

use App\Http\Requests;

class SectionController extends Controller
{
    public function getAll()
    {
        $sections = Section::all();
        return json_encode($sections);
    }
}
