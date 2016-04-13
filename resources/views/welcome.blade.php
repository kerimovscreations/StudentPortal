@extends('layouts.app')

@section('content')
    <div style="width: 100%; height: 100%; font-family: Lato; font-size: 40px; font-weight: 100; text-align: center;">
        <a href="{{ url('/login') }}" style="text-decoration: none">Login</a>
        <br/>
        <a href="{{ url('/register') }}"  style="text-decoration: none">Register</a>
    </div>
@endsection
