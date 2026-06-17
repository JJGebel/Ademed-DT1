<?php
#CONFIG
define('KEY_FILE', 'keyFile.txt'); //PASTE YOUR ACUAL KEY IN THIS FILE
define('URL','https://api.naga.ac/v1/chat/completions');
define('DEFAULT_MODEL', 'llama-3.2-1b-instruct');

$userPrompt = file_get_contents('php://input');

if (is_readable(KEY_FILE)) {
    define('API_KEY', trim(file_get_contents(KEY_FILE)));
} else {
    echo "No " . KEY_FILE. " found. Create the file and paste your API key here";
}

#FUNCTIONS
function callAi($prompt, $apiKey = null, $url = null, $model = null){
    $apiKey = $apiKey ?? API_KEY;
    $url = $url ?? URL;
    $model = $model ?? DEFAULT_MODEL;

    // 2. Prepare the payload (the -d flag in your curl command)
    $data = [
        'model' => $model,
        'messages' => [
            ['role' => 'user', 'content' => $prompt]
        ],
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
    try{
        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            return 'Error:' . curl_error($ch);
        } else {
            // 6. Decode and display the result
            $result = json_decode($response, true);
            return $result['choices'][0]['message']['content'];
        }
    }
    // 7. Close the connection
    finally{
        curl_close($ch);
    }
}
echo(callAi($userPrompt))
?>

