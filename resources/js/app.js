var registerApp=angular.module('appRegister',['ngMaterial','ngRoute','ngResource','ngMessages','ngCookies']);
registerApp.config(function($mdThemingProvider, $interpolateProvider){
    $mdThemingProvider.definePalette('customTheme', customTheme);
    $mdThemingProvider.theme('default')
        .primaryPalette('customTheme');
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

var loginApp=angular.module('appLogin',['ngMaterial','ngRoute','ngResource','ngMessages','ngCookies']);
loginApp.config(function($mdThemingProvider, $interpolateProvider){
    $mdThemingProvider.definePalette('customTheme', customTheme);
    $mdThemingProvider.theme('default')
        .primaryPalette('customTheme');
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

var welcomeApp=angular.module('appWelcome',['ngMaterial','ngRoute','ngResource']);


var portalApp=angular.module('appTeacherDashboard',['ngMaterial','ngRoute','ngResource','ngMessages', 'ngCookies']);
portalApp.config(function($mdThemingProvider, $interpolateProvider){
    $mdThemingProvider.definePalette('customTheme', customTheme);
    $mdThemingProvider.theme('default')
        .primaryPalette('customTheme');
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

var customTheme={
    '50': '3c092c',
    '100': '3c092c',
    '200': '3c092c',
    '300': 'fbe52e', //hue-1
    '400': '3c092c',
    '500': '2E4454', //toolbar
    '600': '3c092c',
    '700': '3c092c',
    '800': 'facd3e', //hue-2
    '900': '3c092c',
    'A100': 'fd6542', //hue-3 and accent
    'A200': 'fd6542',
    'A400': 'fd6542',
    'A700': 'fd6542',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
};