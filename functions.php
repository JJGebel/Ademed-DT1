<?php
#CONFIG
define('KEY_FILE', 'keyFile.txt'); //PASTE YOUR ACUAL KEY IN THIS FILE
define('URL','https://api.naga.ac/v1/chat/completions');
define('DEFAULT_MODEL', 'llama-3.2-1b-instruct');

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (is_readable(KEY_FILE)) {
    define('API_KEY', trim(file_get_contents(KEY_FILE)));
} else {
    echo json_encode(['error' => 'No ' . KEY_FILE . ' found. Create the file and paste your API key here']);
    exit;
}

#FUNCTIONS
function callAi($history, $apiKey = null, $url = null, $model = null){
    $apiKey = $apiKey ?? API_KEY;
    $url = $url ?? URL;
    $model = $model ?? DEFAULT_MODEL;

    // Prepare the payload with conversation history
    $data = [
        'model' => $model,
        'messages' => $history,
    ];

    // Initialize cURL
    $ch = curl_init($url);

    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ]);

    // Execute and catch errors
    try{
        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            return 'Error:' . curl_error($ch);
        } else {
            $result = json_decode($response, true);
            return $result['choices'][0]['message']['content'];
        }
    }
    finally{
        curl_close($ch);
    }
}

// Process the request
if (isset($input['history']) && is_array($input['history'])) {
    echo callAi($input['history']);
} else {
    echo json_encode(['error' => 'Invalid input: history array required']);
}
?>