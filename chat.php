<?php
#CONFIG
define('KEY_FILE', 'keyFile.txt'); //PASTE YOUR ACUAL KEY IN THIS FILE
define('URL','https://api.naga.ac/v1/chat/completions');
define('DEFAULT_MODEL', 'llama-3.2-1b-instruct');

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
echo(callAi("cześć"));
?>

<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="chat.css">
    <script type="module" src="main.js"></script>
    <title>AdamedDT</title>
</head>
<body>    
    <div class="header">
        <div class="header-left">
            <div class="profile-wrapper">
                <div class="profile-main">
                    <div class="profile-image"></div>
                    <div class="profile-tag"><span>admin</span></div>
                </div>
            </div>
        </div>
        
        <div class="header-right">
            <div class="settings-wrapper">
                <button class="settings-main">
                    <div class="settings-icon-outer">
                        <div class="settings-icon-inner"></div>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <div class="content">
        
    </div>
    <div id="chat-interface">
        <input type="text">
        <button type="submit" name="sendToAi">Wyślij</button>

    </div>
</body>
</html>