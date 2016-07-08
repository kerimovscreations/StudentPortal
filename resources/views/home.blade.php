@extends('layouts.app')

@section('appName','appTeacherDashboard')

@section('content')
    <div ng-controller="MainMenuController" layout="column" layout-fill ng-cloak>
        <md-toolbar class="md-whiteframe-3dp">
            <div ng-cloak class="md-toolbar-tools">

                <!--menu side nav button-->

                <md-button class="md-icon-button" aria-label="Menu" ng-click="toggleNavBar()">
                    <md-icon md-svg-icon="svg/ic_menu_white_36px.svg"></md-icon>
                </md-button>
                <h2>
                    <span><% current_section %></span>
                </h2>
                <span flex></span>
                <div layout="row" class="no-outline" ng-click="openNotification()"
                     style="width: 60px;position: relative; margin-right: 15px" ng-cloak>
                    <md-icon md-svg-src="svg/ic_notifications_none_white_48px.svg" aria-label="Notification"
                             style="position: relative;left: 0px; width:35px; height: 35px;"></md-icon>
                    <div ng-show="notification_count!=0" class="notification-circle"
                         style="position: relative;right: 20px" ng-cloak><% notification_count %>
                    </div>
                </div>

                <!--profile icon and drop down menu-->

                <div style="position: relative">
                    <div id="toggleDropDown"
                         style="width:40px; height: 40px; margin-right: 10px ;border-radius: 100%; overflow: hidden">
                        <img ng-src="<% user_profile_pic %>" style="width:100%; height: 100%;"/>
                    </div>
                    <div tabindex="-1" id="dropDown" class="md-whiteframe-2dp" ng-blur="hideDropDown()">
                        <div class="drop-down-profile-triangle"></div>
                        <div layout="row" style="padding: 10px">
                            <div class="no-outline" ng-click="changeProfileImage()"
                                 style="width:100%; height: 100px; border-radius: 100%;position: relative; overflow: hidden; margin: 5px">
                                <img class="no-outline" ng-src="<% user_profile_pic || 'images/profile_icon.png'%>"
                                     style="width:100px; height: 100px;"/>
                                <div class="change-profile-image-text">Change</div>
                            </div>
                            <div layout="column" style="margin: 10px 15px;" layout-align="start start">
                                <h4 style="margin: 0"><% user_name %></h4>
                                <span style="margin-top: 0px; font-size: 12px; color:#909090"><% user_email %></span>
                                <span style="margin-top: 0px; font-size: 16px; color: #299af5; font-weight: bold"><% user_type %></span>
                                <md-button class="md-raised md-primary" ng-click="editProfile()"
                                           style="margin: 0; margin-top: 10px">Edit Profile
                                </md-button>
                            </div>
                        </div>
                        <md-divider></md-divider>
                        <div layout="row" style=" padding: 5px; background-color: #F0F0F0" layout-align="end">
                            <md-button style="color: #A6A6A6"><a href="/logout">Sign Out</a></md-button>
                        </div>
                    </div>
                </div>
            </div>
        </md-toolbar>

        <!--side nav-->

        <md-content flex>

            <!--sections of side nav-->

            <section layout="row" ng-controller="SectionListController" layout-fill>
                <md-sidenav class="md-sidenav-left " md-component-id="left" style="opacity: 0.8">
                    <md-content style="background-color: #2e4c5c; color: #ffffff" layout-fill>
                        <md-list ng-cloak>

                            <!--list of sections-->

                            <md-list-item class="secondary-button-padding" ng-repeat="section in sections"
                                          ng-click="selectSection(section.name)" ng-if="section.access_level.indexOf(user_access_level()) != -1">
                                <md-icon md-svg-src="<% section.url %>"
                                         style="margin-right: 15px; margin-left: 0"></md-icon>
                                <span> <% section.name %> </span>
                            </md-list-item>
                        </md-list>
                    </md-content>
                </md-sidenav>

                <!-- custom view for selected section -->

                <div layout="column" layout-fill>
                    <md-content layout-fill>
                        <div ng-view layout-fill></div>
                    </md-content>
                </div>
            </section>
        </md-content>
    </div>
@endsection
