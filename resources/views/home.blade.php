@extends('layouts.app')

@section('appName','appTeacherDashboard')

@section('content')
    <div ng-controller="MainMenuController" layout="column" layout-fill>
        <md-toolbar class="md-whiteframe-4dp">
            <div class="md-toolbar-tools">

                <!--menu sidenav button-->

                <md-button class="md-icon-button" aria-label="Menu" ng-click="toggleNavBar()">
                    <md-icon md-svg-icon="svg/ic_menu_white_36px.svg"></md-icon>
                </md-button>
                <h2>
                    <span><% current_section %></span>
                </h2>
                <span flex></span>

                <!--profile icon and drop down menu-->

                <div style="position: relative">
                    <img ng-click="toggleDropDownProfile()" class="md-avatar" ng-src="images/profile_icon.png" style="width:40px; height: 40px; margin-right: 10px ;border-radius: 100%"/>
                    <div class="md-whiteframe-2dp" id="dropDownProfile">
                        <div class="drop-down-profile-triangle"></div>
                        <md-content>
                            <div layout="row" style="padding: 10px">
                                <div ng-click="changeProfileImage()" style="width:100px; height: 100px; border-radius: 100%;position: relative; overflow: hidden; margin: 5px">
                                    <img  class="md-avatar" ng-src="images/profile_icon.png" style="width:100px; height: 100px;"/>
                                    <div class="change-profile-image-text">Change</div>
                                </div>

                                <div layout="column" style="margin: 10px 15px;" layout-align="start start" >
                                    <h4 style="margin: 0">{{ Auth::guard(session('userType'))->user()->name }}</h4>
                                    <span style="margin-top: 0px; font-size: 12px; color:#909090">{{ Auth::guard(session('userType'))->user()->email }}</span>
                                    <span style="margin-top: 0px; font-size: 16px; color: #299af5; font-weight: bold">{{ session('userType') }}</span>
                                    <md-button class="md-raised md-primary" ng-click="editProfile()" style="margin: 0; margin-top: 10px">Edit Profile</md-button>
                                </div>
                            </div>
                            <md-divider></md-divider>
                            <div layout="row" style=" padding: 5px; background-color: #F0F0F0" layout-align="end">
                                <md-button style="color: #A6A6A6"><a href="{{ url('/'.session('userType').'/logout') }}">Sign Out</a></md-button>
                            </div>
                        </md-content>
                    </div>
                </div>
            </div>
        </md-toolbar>

        <!--side nav-->

        <md-content flex>

            <!--sections of side nav-->

            <section layout="row" ng-controller="SectionListController" layout-fill>
                <md-sidenav class="md-sidenav-left " md-component-id="left" style="opacity: 0.8">
                    <md-content style="background-color: #2e4c5c; color: #ffffff"  layout-fill>
                        <md-list ng-cloak >

                            <!--list of sections-->

                            <md-list-item class="secondary-button-padding" ng-repeat="section in sections" ng-click="selectSection(section.name)" >
                                <p> <% section.name %> </p>
                            </md-list-item>
                        </md-list>
                    </md-content>
                </md-sidenav>

                <!-- custom view for selected section -->

                <div layout="column" layout-fill >
                    <md-content layout-fill>
                        <div ng-view layout-fill></div>
                    </md-content>
                </div>
            </section>
        </md-content>
    </div>
@endsection
