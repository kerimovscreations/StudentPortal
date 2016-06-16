@extends('layouts.app')

@section('appName','appRegister')

@section('content')
    <div ng-controller="RegisterController" layout="column" layout-align="center center" layout-fill ng-cloak
         style="height: auto">
        <md-card style="max-width: 400px" ng-cloak>
            <form name='userForm' role="form" method="POST" action="/register">
                <md-card-title>
                    <md-card-title-text layout="column" layout-align="center center">
                            <span class="md-headline" style="color: #2E4454">Registration</span>
                    </md-card-title-text>
                </md-card-title>
                <md-card-content layout="column" layout-align="center">
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
                    <div layout-gt-sm="row">
                        <md-input-container class="md-block" flex-gt-sm style="margin: 30px 0">
                            <label>Phone Number</label>
                            <input type="text" name="phone" ng-model="user.number"
                                   placeholder="+994123456789" required>
                            <div ng-messages="userForm.phone.$error" role="alert">
                                <div ng-message="required">Required field!</div>
                            </div>
                        </md-input-container>
                        <md-input-container class="md-block" flex-gt-sm style="margin: 10px 0">
                            <mdp-date-picker mdp-open-on-click required mdp-placeholder="Birth Date" mdp-format="MM-DD-YYYY" ng-model="user.birthDate" mdp-max-date="maxDate">
                                <div ng-messages="userForm.birthDate.$error">
                                    <div ng-message="required">This is required</div>
                                </div>
                            </mdp-date-picker>
                            <input type="hidden" name="birthDate" ng-value="birthDateFormatted">
                        </md-input-container>
                    </div>
                </md-card-content>
                <md-card-actions layout="row" layout-align="center none" style="padding: 5px;">
                    <md-button class="md-raised md-primary" type="submit" style="width: 100%">Submit</md-button>
                </md-card-actions>
            </form>
        </md-card>
    </div>
@endsection
