<?php
$taskId = isset($_GET['task_id']) ? htmlspecialchars($_GET['task_id']) : '';
$milestoneId = isset($_GET['milestone_id']) ? htmlspecialchars($_GET['milestone_id']) : '';
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="sprawdzanie.css"> 
    
    <script type="module" src="sprawdzanie.js" defer></script>
    
    <title>AdamedDT - Milestone</title>
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

    <div class="content" data-task-id="<?php echo $taskId; ?>" data-milestone-id="<?php echo $milestoneId; ?>">

        <div class="TEXT">
            <div class="MILESTONE" id="milestone-text">
                Ładowanie kroku...
            </div>
            <div class="Polecenie" id="instruction-text">
                Opisz swoimi słowami, czego nauczyłeś się w procesie wykonywania tego małego kroku i jak zbliża Cię to do Twojego większego celu.
            </div>
        </div>

        <div class="INPUT">
            <textarea id="user-input" placeholder="Napisz, czego się nauczyłeś i jakie wyciągasz wnioski..."></textarea>
        </div>

        <div class="Button">
            <button class="submit-btn" id="submit-btn">ZATWIERDŹ</button>
        </div>

    </div>
</body>
</html>