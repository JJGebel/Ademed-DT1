<?php

#CONFIG
$keyFile = 'keyFile.txt';


echo("echo OK"."<br>");
$output = shell_exec("python3 test.py");
echo($output . "<br>");

if (is_readable($keyFile)) {
    $apiKey = trim(file_get_contents($keyFile));
    echo($apiKey);
} else {
    echo "No keyFile.txt found. Create the file and paste your naga.ac API key here";
}
?>