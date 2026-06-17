<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJAX test</title>
    <?php require_once 'logic.php';?>
    <script type="module" src="script.js" defer></script>
</head>
<body>
    <?php echo("<h1>". $date . "</h1>");?>
    <button onclick='refresh()'>Refresh</button>
    <script>
        function refresh() {
            console.log("refresh!");

            fetch('logic.php')
                // Tradycyjna funkcja zamiast strzałki
                .then(function(response) {
                    return response.text(); 
                })
                // Tradycyjna funkcja zamiast strzałki
                .then(function(data) {
                    console.log("Odpowiedź z serwera:", data);
                    document.querySelector('h1').innerText = data;
                })
                .catch(function(error) {
                    console.error('Błąd:', error);
                });
        }
    </script>
</body>
</html>