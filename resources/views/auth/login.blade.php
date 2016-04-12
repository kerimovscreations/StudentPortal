@extends('layouts.app')

@section('appName', 'appLogin')

@section('content')
    <md-content class="md-padding" ng-controller="LoginController" layout-fill>
        <form layout-fill layout="row" layout-align="center center" role="form" method="POST" action="{{ url('/login') }}">
            {!! csrf_field() !!}
            <md-card style="max-width: 400px">
                <img ng-src="{{ 'https://www.gse.harvard.edu/sites/default/files//content-images/400x200--UK-rise-of-data.png' }}" class="md-card-image" alt="Washed Out" style="width: 100%">
                <md-card-title>
                    <md-card-title-text>
                        <span class="md-headline">Login</span>
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
                    <md-radio-group ng-model="user_type" layout="row" layout-align="center none">
                        <md-radio-button value="Student">Student</md-radio-button>
                        <md-radio-button value="Teacher"> Teacher </md-radio-button>
                        <md-radio-button value="Administration">Mentor</md-radio-button>
                    </md-radio-group>
                </md-card-content>
                <md-card-actions layout="row" layout-align="center none" style="padding: 5px;">
                    <a class="md-button" href="{{ url('/password/reset') }}">Forgot Your Password?</a>
                    <div flex></div>
                    <input type="submit" class="md-button md-raised md-primary" value="Login">
                </md-card-actions>
            </md-card>
        </form>
    </md-content>
@endsection
