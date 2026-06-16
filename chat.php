<?php
#CONFIG
$keyFile = 'keyFile.txt'; //PASTE YOUR ACUAL KEY THERE
$url = 'https://api.naga.ac/v1/chat/completions';

if (is_readable($keyFile)) {
    $apiKey = trim(file_get_contents($keyFile));
} else {
    echo "No keyFile.txt found. Create the file and paste your naga.ac API key here";
}

#FUNCTIONS
function callAI($apiKey, $url){
    // 2. Prepare the payload (the -d flag in your curl command)
    $data = [
        'model' => 'llama-3.2-1b-instruct',
        'messages' => [
            ['role' => 'user', 'content' => "generate a short greeting. Be creative"]
        ],
        'temperature' => 0.9
    ];

    // 3. Initialize cURL
    $ch = curl_init($url);

    // 4. Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Returns the response as a string
    curl_setopt($ch, CURLOPT_POST, true);           // Sets request method to POST
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data)); // Encodes data to JSON
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,         // -H "Authorization: ..."
        'Content-Type: application/json'             // -H "Content-Type: ..."
    ]);

    // 5. Execute and catch errors
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    } else {
        // 6. Decode and display the result
        $result = json_decode($response, true);
        echo $result['choices'][0]['message']['content'];
    }

    // 7. Close the connection
    curl_close($ch);
}

#MAIN
callAI($apiKey,$url);
?>