<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="chat.css">
    <title>AdamedDT - Goal Breakdown Assistant</title>
    <script src="chat.js" defer></script>
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
        <h1>Goal Breakdown Assistant</h1>
        <p>Share your goal and I'll help you break it down into manageable steps!</p>
    </div>
    
    <div id="chat">
        <div id="chat-box"></div>
        <div id="input-area">
            <input type="text" id="prompt" placeholder="Type your goal or type /end to get a summary...">
            <button onclick="sendToAi()">Wyślij</button>
        </div>
    </div>
</body>
</html>