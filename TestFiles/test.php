<?php
echo("echo works");
echo("<br>");
$output = shell_exec("python3 test.py");
echo($output);  // Sends HTML to browser
?>