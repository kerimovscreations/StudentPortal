@extends('layouts.app')

@section('appName', 'appLogin')

@section('content')
    <md-content layout='column' ng-controller="LoginController" layout-fill>
        <div style="margin: 0 auto; text-align: center">
            <h3>Select login type</h3>
            <div layout="row" layout-align="center">
                <md-button class="md-raised md-primary" href="{{ url('login/student') }}">Student</md-button>
                <md-button class="md-raised md-primary" href="{{ url('login/teacher') }}">Teacher</md-button>
                <md-button class="md-raised md-primary" href="{{ url('login/mentor') }}">Mentor</md-button>
            </div>
        </div>
        @if(session()->has('userType'))
            <form role="form" method="POST"
                  action="{{ url('/'.session('userType').'/login') }}">
                {!! csrf_field() !!}
                <md-card style="max-width: 350px; margin: 20px auto">
                    <img src="{{ URL::to('/') }}/images/login_background.jpg" class="md-card-image" alt="Washed Out"
                         style="width: 100%">
                    <md-card-title>
                        <md-card-title-text>
                            <span class="md-headline">Login for <span style="color: #1da8bc;">{!! session('userType') !!}</span></span>
                        </md-card-title-text>
                    </md-card-title>
                    <md-card-content layout="column">
                        <md-input-container class="reduce-margin">
                            <label>Email</label>
                            <input ng-model="user_email" type="email" name="email">
                            @if ($errors->has('email'))
                                <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                            @endif
                        </md-input-container>
                        <md-input-container class="reduce-margin">
                            <label>Password</label>
                            <input ng-model="user_password" type="password" name="password">
                            @if ($errors->has('password'))
                                <span class="help-block">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                            @endif
                        </md-input-container>
                    </md-card-content>
                    <md-card-actions layout="row" layout-align="center none" style="padding: 5px;">
                        <a class="md-button" href="{{ url('/password/reset') }}">Forgot Your Password?</a>
                        <div flex></div>
                        <input type="submit" class="md-button md-raised md-primary" value="Login">
                    </md-card-actions>
                </md-card>
            </form>
    </md-content>
    @endif

@endsection
