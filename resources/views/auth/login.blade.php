@extends('layouts.app')

@section('appName', 'appLogin')

@section('content')
    <md-content class="md-padding" style="text-align: center">
        <h2>Select login type</h2>
        <div layout="row" layout-align="center">
            <md-button class="md-raised md-primary" href="{{ url('login/student') }}">Student</md-button>
            <md-button class="md-raised md-primary" href="{{ url('login/teacher') }}">Teacher</md-button>
            <md-button class="md-raised md-primary" href="{{ url('login/mentor') }}">Mentor</md-button>
        </div>
    </md-content>
    @if(session()->has('userType'))
        <md-content class="md-padding" ng-controller="LoginController" layout-fill>
            <form layout-fill layout="row" layout-align="center center" role="form" method="POST" action="{{ url('/'.session('userType').'/login') }}">
                {!! csrf_field() !!}
                <md-card style="max-width: 400px">
                    <img ng-src="{{ 'https://www.gse.harvard.edu/sites/default/files//content-images/400x200--UK-rise-of-data.png' }}" class="md-card-image" alt="Washed Out" style="width: 100%">
                    <md-card-title>
                        <md-card-title-text>
                            <span class="md-headline">Login for {!! session('userType') !!}</span>
                        </md-card-title-text>
                    </md-card-title>
                    <md-card-content layout="column">
                        <md-input-container>
                            <label>Email</label>
                            <input ng-model="user_email" type="email" name="email">
                            @if ($errors->has('email'))
                                <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                            @endif
                        </md-input-container>
                        <md-input-container>
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
