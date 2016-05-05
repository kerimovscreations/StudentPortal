@extends('layouts.app')

@section('appName','appRegister')

@section('content')
    <div ng-controller="RegisterController"
         style="width:100%; height: 100%; background-image: url('{{ URL::to('/') }}/images/welcome_background.jpg'); background-size: cover">
        <div class="md-padding" style="text-align: center; color: ivory">
            <h2>Select registration type</h2>
            <div layout="row" layout-align="center">
                <md-button class="md-raised md-primary" ng-click="changeUserType('student')">Student</md-button>
                <md-button class="md-raised md-primary" ng-click="changeUserType('teacher')">Teacher</md-button>
                <md-button class="md-raised md-primary" ng-click="changeUserType('mentor')">Mentor</md-button>
            </div>
        </div>
        <div class="container">
            <div style="padding: 10px">
                <md-card flex-xs style="max-width: 400px; margin: 10px auto" ng-cloak>
                    <md-card-title>
                        <md-card-title-text layout="column" layout-align="center center">
                            <span class="md-headline" style="color: #2E4454">Registration for <span
                                        style="color: #1da8bc;"><% select_user_type %></span></span>
                        </md-card-title-text>
                    </md-card-title>
                    <md-card-content layout="column" layout-align="center">
                        <form name='userForm' role="form" method="POST" action="<%'/'+ select_user_type +'/register'%>">
                            {!! csrf_field() !!}
                            <div layout-gt-sm="row">
                                <md-input-container class="md-block" flex-gt-sm style="margin: 10px 0">
                                    <label>First name</label>
                                    <input type="text" name="firstName" ng-model="user.firstName" required
                                           value="{{ old('firstName') }}">
                                    <div ng-messages="userForm.firstName.$error" role="alert">
                                        <div ng-message="required">Required field!</div>
                                    </div>
                                </md-input-container>
                                <md-input-container class="md-block" flex-gt-sm style="margin: 10px 0">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" ng-model="user.lastName" required
                                           value="{{ old('lastName') }}">
                                    <div ng-messages="userForm.lastName.$error" role="alert">
                                        <div ng-message="required">Required field!</div>
                                    </div>
                                </md-input-container>
                            </div>
                            <md-input-container style="width: 100%; margin: 10px 0">
                                <label>Email</label>
                                <input name="email" ng-model="user.email" required type="email"
                                       ng-pattern="/^.+@.+\..+$/" value="{{ old('email') }}">
                                <div ng-messages="userForm.email.$error" role="alert" multiple>
                                    <div ng-message="required">Required field!</div>
                                    <div ng-message="pattern">It doesn't seem like an email!</div>
                                </div>
                            </md-input-container>
                            <div layout-gt-xs="row">
                                <md-input-container class="md-block" flex-gt-sm style="margin: 10px 0">
                                    <label>Password</label>
                                    <input name="password" ng-model="user.password" required type="password"
                                           minlength="8">
                                    <div ng-messages="userForm.password.$error" role="alert" multiple>
                                        <div ng-message="required" class="my-message">Required field!</div>
                                        <div ng-message="minlength">Required at least 8 character!</div>
                                    </div>
                                </md-input-container>
                                <md-input-container class="md-block" flex-gt-sm style="margin: 10px 0">
                                    <label>Confirm Password</label>
                                    <input name="password_confirmation" ng-model="user.passwordConfirm" required
                                           type="password" minlength="8" ng-pattern="user.password">
                                    <div ng-messages="userForm.passwordConfirm.$error" role="alert" multiple>
                                        <div ng-message="required">Required field!</div>
                                        <div ng-message="pattern">Not the same to confirm!</div>
                                        <div ng-message="minlength">Required at least 8 character!</div>
                                    </div>
                                </md-input-container>
                            </div>
                            <div layout-gt-sm="row" ng-if="select_user_type=='student'">
                                <md-input-container class="md-block" flex-gt-sm style="margin: 10px 0">
                                    <label>Phone Number</label>
                                    <input type="text" name="phone" ng-model="user.number"
                                           placeholder="+994123456789" required maxlength="13">
                                    <div ng-messages="userForm.number.$error" role="alert" multiple>
                                        <div ng-message="required">Required field!</div>
                                        <div ng-message="maxlength">No more than 13 character!</div>
                                    </div>
                                </md-input-container>
                                <md-input-container class="md-block" flex-gt-sm style="margin: 10px 0">
                                    <label>Birth Date</label>
                                    <input type="text" name="birthDate" ng-model="user.birthDate"
                                           placeholder="MM-DD-YYYY" required maxlength="10">
                                    <div ng-messages="userForm.number.$error" role="alert">
                                        <div ng-message="required">Required field!</div>
                                    </div>
                                </md-input-container>
                            </div>
                            <md-button class="md-raised md-primary" type="submit">Submit</md-button>
                        </form>
                        @include('errors.list')
                    </md-card-content>
                </md-card>
            </div>
        </div>
    </div>
@endsection
