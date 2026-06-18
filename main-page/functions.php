<?php
#CONFIG
define('KEY_FILE', 'keyFile.txt'); //PASTE YOUR ACTUAL KEY IN THIS FILE
define('URL', 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');

// Fallback models in order of preference
define('MODEL_FALLBACKS', ['gemini-2.5-flash-lite','gemini-2.5-flash']);

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (is_readable(KEY_FILE)) {
    define('API_KEY', trim(file_get_contents(KEY_FILE)));
} else {
    http_response_code(500);
    echo json_encode(['error' => 'No ' . KEY_FILE . ' found. Create the file and paste your API key here']);
    exit;
}

#FUNCTIONS
function callAi($history, $apiKey = null, $url = null, $model = null){
    global $lastError;

    $apiKey = $apiKey ?? API_KEY;
    $url    = $url    ?? URL;
    $modelsToTry = $model ? [$model] : MODEL_FALLBACKS;

    foreach ($modelsToTry as $currentModel) {
        $lastError = '';

        // Prepare the payload with conversation history
        $data = [
            'model'    => $currentModel,
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
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // 30 second timeout

        // Execute and handle errors
        try {
            $response = curl_exec($ch);

            if (curl_errno($ch)) {
                $lastError = 'Curl error: ' . curl_error($ch);
                curl_close($ch);
                continue; // Try next model
            }

            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode !== 200) {
                $lastError = "HTTP $httpCode: " . $response;
                continue; // Try next model
            }

            $result = json_decode($response, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $lastError = 'JSON decode error: ' . json_last_error_msg();
                continue; // Try next model
            }

            if (!isset($result['choices'][0]['message']['content'])) {
                $lastError = 'Invalid response structure from API';
                continue; // Try next model
            }

            return $result['choices'][0]['message']['content'];

        } catch (Exception $e) {
            $lastError = 'Exception: ' . $e->getMessage();
            if (isset($ch)) {
                curl_close($ch);
            }
            continue; // Try next model
        }
    }

    // All models failed
    return json_encode(['error' => 'All models failed', 'details' => $lastError]);
}

// Process the request
if (isset($input['history']) && is_array($input['history'])) {
    // Get system prompt from input or use default
    $systemPrompt = $input['systemPrompt'] ?? null;
    
    // If custom system prompt provided, prepend it to history
    if ($systemPrompt !== null) {
        array_unshift($input['history'], ['role' => 'system', 'content' => $systemPrompt]);
    }
    
    $response = callAi($input['history']);

    // Check if response is an error
    $decoded = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE && isset($decoded['error'])) {
        http_response_code(500);
        echo $response;
    } else {
        echo $response;
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input: history array required']);
}
?>