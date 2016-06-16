var registerApp=angular.module('appRegister',['ngMaterial','ngRoute','ngResource','ngMessages','ngCookies','mdPickers']);
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
    '300': '7F1369', //hue-1
    '400': '3c092c',
    '500': '2E4454', //toolbar
    '600': '3c092c',
    '700': '3c092c',
    '800': 'facd3e', //hue-2
    '900': '3c092c',
    'A100': '6737FF', //hue-3 and accent
    'A200': '6737FF',
    'A400': '6737FF',
    'A700': '6737FF',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
    'contrastLightColors': 'light'    // could also specify this if default was 'dark'
};