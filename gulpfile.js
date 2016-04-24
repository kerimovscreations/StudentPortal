var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    //mix.sass('app.scss', 'resources/assets/css');

    mix.styles([
        '/app.css',
        '../../css/angular-material.min.css',
        '../../css/style.css'
    ]);

    mix.scripts([
        "../../js/angular.js",
        "../../js/angular-route.min.js",
        "../../js/angular-resource.min.js",
        "../../js/angular-cookies.min.js",
        "../../js/angular-messages.min.js",
        "../../js/angular-animate.min.js",
        "../../js/angular-aria.min.js",
        "../../js/angular-material.min.js",
        "../../js/moment.js",
        "../../js/app.js",
        "../../js/factories.js",
        "../../js/services.js",
        "../../js/filters.js",
        "../../js/directives.js",
        "../../js/controllers.js",
        "../../js/routes.js"
    ]);
});
