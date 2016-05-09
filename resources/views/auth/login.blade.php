@extends('layouts.app')

@section('appName', 'appLogin')

@section('content')
    <div ng-controller="LoginController" layout="column" layout-align="center center" layout-fill>
        <md-card style="max-width: 350px;">
            <form name='userForm' role="form" method="POST" action="<%'/'+ select_user_type +'/login'%>">
                {!! csrf_field() !!}
                <img src="{{ URL::to('/') }}/images/login_background.jpg" class="md-card-image" alt="Washed Out"
                     style="width: 100%">
                <md-card-title>
                    <md-card-title-text>
                        <span class="md-headline">Login for <span style="color: #1da8bc;"><% select_user_type %></span></span>
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
                    <md-radio-group ng-model="select_user_type" layout="row" layout-align="center">
                        <md-radio-button value="student">Student</md-radio-button>
                        <md-radio-button value="teacher"> Teacher</md-radio-button>
                        <md-radio-button value="mentor">Mentor</md-radio-button>
                    </md-radio-group>
                </md-card-content>
                <md-card-actions layout="row" layout-align="center none" style="padding: 5px;">
                    <!--
                    <a class="md-button" href="{{ url('/password/reset') }}">Forgot Your Password?</a>
                    -->
                    <div flex></div>
                    <input type="submit" class="md-button md-raised md-primary" value="Login">
                </md-card-actions>
            </form>
        </md-card>
    </div>
@endsection
