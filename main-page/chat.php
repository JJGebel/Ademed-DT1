<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="chat.css">
    <title>AdamedDT</title>
    <script src="chat.js" defer></script>
</head>
<body>
    <div class="content">
        <div class="chat wrapper">
            <div class="chat-container">
                <div class="chat-view" id="chat-box">
                </div>

                <div class="chat-prompt">
                    <input type="text" id="prompt" placeholder="Type your goal or type /end to get a summary..." autocomplete="off">
                </div>
            </div>
        </div>

        <div class="button-proceed">
            <button class="end-chat-btn" onclick="sendToAi()">Koniec rozmowy</button>
        </div>
    </div>
</body>
</html>