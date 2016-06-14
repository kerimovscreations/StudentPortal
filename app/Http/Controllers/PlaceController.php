<?php

namespace App\Http\Controllers;

use App\Place;
use Illuminate\Http\Request;

use App\Http\Requests;

class PlaceController extends Controller
{
    public function getAll() {
        $places = Place::all();
        return json_encode($places);
    }
}
