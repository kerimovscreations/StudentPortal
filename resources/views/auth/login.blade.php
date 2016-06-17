@extends('layouts.app')

@section('appName', 'appLogin')

@section('content')
    <div ng-cloak ng-controller="LoginController"  layout="column" layout-align="center center" layout-fill
         style="height: auto">
        <md-card style="max-width: 350px;">
            <form name='userForm' role="form" method="POST" action="/login">
                {!! csrf_field() !!}
                <img src="{{ URL::to('/') }}/images/login_background.jpg" class="md-card-image" alt="Washed Out"
                     style="width: 100%">
                <md-card-title>
                    <md-card-title-text>
                            <span class="md-headline">Login</span>
                    </md-card-title-text>
                </md-card-title>
                <md-card-content layout="column">
                    <md-input-container class="reduce-margin">
                        <label>Email</label>
                        <input ng-model="user_email" type="email" name="email">
                    </md-input-container>
                    <md-input-container class="reduce-margin">
                        <label>Password</label>
                        <input ng-model="user_password" type="password" name="password">
                    </md-input-container>
                </md-card-content>
                <md-card-actions layout="row" layout-align="center none">
                <!--
                    <a class="md-button" href="{ url('/password/reset') }}">Forgot Your Password?</a>
                    -->
                    <input flex type="submit" class="md-button md-raised md-primary" value="Login">
                </md-card-actions>
            </form>
        </md-card>
    </div>
@endsection
