<?php
/**
 * Created by PhpStorm.
 * User: ragim
 * Date: 30/03/2016
 * test file to get
 * Time: 18:29
 */

$connection = new mysqli("localhost","root","qwerty123","codeacademy");
$query  = "SELECT * FROM users";
$data = $connection->query($query);
$users = array();

while($row = $data->fetch_assoc())
    array_push($users,$row);


header('Content-Type: application/json');
$result = json_encode($users);
print $result;