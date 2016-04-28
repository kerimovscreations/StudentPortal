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
        '../../css/style.css'
    ]);

    mix.scripts([
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
