<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
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
        <h1>Obecne zadania</h1>

        <div class="task">
            <div class="task-button-container">
                <button class="task-button" id="addnew-button">Dodaj Zadanie</button>
            </div>
            <div class="task-type-selection">
                <br>
                <h2>Wybierz rodzaj zadania</h2>
                <div class="task-button-container">
                    <button class="task-button" id="zad-button">Zad+</button>    
                    <button class="task-button" id="rep-button" disabled>Rep+</button>  
                </div>
            </div>
        </div>

        <div class="content" id="task-list"></div>
    </div>
</body>
</html>