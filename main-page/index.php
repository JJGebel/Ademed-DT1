<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
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
        <div class="task">
            <div class="add-task-button-container">
                <button class="add-task-button" id="zad-button">Zad+</button>    
                <button class="add-task-button" id="rep-button">Rep+</button>  
            </div>
            <div class="task-content create-task-content">
                <p>Tymczasowe szczegóły nowego taska</p>
                <button class="add-task-button" id="save-button">Zapisz</button>  
            </div>
        </div>

        <div class="content" id="task-list"></div>

    </div>
</body>
</html>