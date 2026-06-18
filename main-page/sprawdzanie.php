<?php
$taskId = isset($_GET['task_id']) ? htmlspecialchars($_GET['task_id']) : '';
$milestoneId = isset($_GET['milestone_id']) ? htmlspecialchars($_GET['milestone_id']) : '';
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="sprawdzanie.css"> 
    
    <script type="module" src="sprawdzanie.js" defer></script>
    
    <title>AdamedDT - Milestone</title>
</head>
<body>    
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