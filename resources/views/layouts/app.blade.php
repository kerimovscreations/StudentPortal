<!DOCTYPE html>
<html lang="en" ng-app="@yield('appName')">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Student Portal</title>

    <!-- Fonts -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700" rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <!-- Styles -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <!-- Text editor -->
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/trix/0.9.2/trix.css">
    <!-- Angular Material style sheet -->
    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0-rc.5/angular-material.min.css">
    <link href="css/all.css" rel="stylesheet">

</head>
<body id="app-layout">

@yield('content')

        <!-- JavaScripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<!-- Angular Material requires Angular.js Libraries -->
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-route.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-resource.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-messages.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-cookies.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-animate.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-aria.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-sanitize.min.js"></script>

<!-- Text Editor library -->
<script src="//cdnjs.cloudflare.com/ajax/libs/trix/0.9.2/trix.js"></script>
<script src="js/angular-trix.min.js"></script>

<!-- Image upload and crop library-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/danialfarid-angular-file-upload/12.0.4/ng-file-upload.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ng-img-crop/0.3.2/ng-img-crop.js"></script>

<!-- Angular Material Library -->
<script src="http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0-rc.5/angular-material.min.js"></script>
<script src="js/all.js"></script>
</body>
</html>
