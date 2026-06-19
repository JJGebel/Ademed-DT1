<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="chat.css">
    <title>AdamedDT</title>
    <script src="chat.js" defer></script>
</head>
<body>    
    <div class="header">
        <div class="header-left">
            <div class="profile-wrapper">
                <div class="profile-main">
                    <div class="profile-image" onclick="window.location.href='index.php'" style="cursor: pointer;"></div>
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
            <button class="end-chat-btn" onclick="document.getElementById('prompt').value='/end'; sendToAi();">Zakończ rozmowę</button>
        </div>
    </div>
</body>
</html>