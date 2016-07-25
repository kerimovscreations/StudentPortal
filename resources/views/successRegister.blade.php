<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Successful Registration</title>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel='stylesheet'
          type='text/css'>
    <style>
        .fa-6 {
            font-size: 12em;
        }

        .custom-font {
            font-family: "Open Sans";
        }

        body{
            background: #F6F6F6;
        }
        .blue-color{
            color: #2C87C4;
        }
        .gray-color{
            color: #A2B0BB;
        }
        .black-color{
            color: #111111;
        }
        button {
            font-family: 'Space Mono', monospace;
            letter-spacing: 1px;
            background: #5E9ECC;
            color: white;
            position: relative;
            outline: none;
            border: none;
            height: 50px;
            width: 190px;
            font-size: 14px;
            z-index: 2;
            -webkit-transition: .01s .23s ease-out all;
            transition: .01s .23s ease-out all;
            overflow: hidden;
        }
        button:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 55%;
            background: #9DDC06;
            z-index: -1;
            -webkit-transition: .3s ease-in all;
            transition: .3s ease-in all;
        }
        button:after {
            content: '';
            position: absolute;
            left: -5%;
            top: 5%;
            height: 90%;
            width: 5%;
            background: white;
            z-index: -1;
            -webkit-transition: .4s .02s ease-in all;
            transition: .4s .02s ease-in all;
        }
        button:hover {
            cursor: pointer;
            color: transparent;
        }
        button:hover:before {
            left: 100%;
            width: 25%;
        }
        button:hover:after {
            left: 100%;
            width: 70%;
        }
        button:hover .icon-right.after:after {
            left: -80px;
            color: white;
            -webkit-transition: .2s .2s ease all;
            transition: .2s .2s ease all;
        }
        button:hover .icon-right.after:before {
            left: -104px;
            top: 14px;
            opacity: 0.2;
            color: white;
        }

        .icon-right {
            position: absolute;
            top: 0;
            right: 0;
        }
        .icon-right:after {
            font-family: "FontAwesome";
            content: '\2192';
            font-size: 24px;
            display: inline-block;
            position: relative;
            top: 26px;
            -webkit-transform: translate3D(0, -50%, 0);
            transform: translate3D(0, -50%, 0);
        }
        .icon-right.after:after {
            left: -250px;
            color: #9DDC06;
            -webkit-transition: .15s .25s ease left, .5s .05s ease color;
            transition: .15s .25s ease left, .5s .05s ease color;
        }
        .icon-right.after:before {
            content: 'Logout';
            position: absolute;
            left: -230px;
            top: 14px;
            opacity: 0;
            -webkit-transition: .2s ease-in all;
            transition: .2s ease-in all;
        }
    </style>
</head>
<body>
<div style="margin-top: 40px; display: flex; flex-direction: column; justify-content: center; text-align: center">
    <div>
        <i class="fa fa-check fa-6 blue-color" aria-hidden="true"></i>
    </div>
    <div style="display: flex; flex-direction: column; text-align: center">
        <span class="custom-font black-color" style="font-size: 40px">You have successfully registered</span>
        <span class="custom-font gray-color" style="font-size: 24px">You'll get an access to portal <br> after your registration verified by our staff.<br>
        Wait for a confirmation email  <i class="fa fa-envelope-o" aria-hidden="true"></i></span>
    </div>
    <div style="margin-top: 30px">
        <button class="logout" onclick="location.href = '/logout';">Logout<span class="icon-right"></span><span class="icon-right after"></span></button>
    </div>
</div>
</body>
</html>