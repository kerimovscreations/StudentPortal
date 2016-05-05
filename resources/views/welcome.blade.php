@extends('layouts.app')

@section('appName', 'appWelcome')

@section('content')
    <div layout="column" layout-align="center center"
         style="width:100%; height: 100%; background-image: url('{{ URL::to('/') }}/images/welcome_background.jpg'); background-size: cover">
        <img src="{{URL::to('/')}}/images/ca_logo.png" style="width: 400px">
        <div layout="row" layout-align="center" style="margin-top: 40px">
            <md-button class="md-raised" ng-click="changePath('login')" onclick="location.href='/login'">Login
            </md-button>
            <md-button class="md-raised" ng-click="changePath('register')" onclick="location.href='/register'">
                Register
            </md-button>
        </div>
    </div>
@endsection
