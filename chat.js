const PROMPT_INPUT = document.getElementById('prompt')
const CHAT_BOX = document.getElementById('chat-box')
function sendToAi() {
    CHAT_BOX.innerHTML += "<p>" + PROMPT_INPUT.value + "</p>";
    // 1. Pobieramy tekst wpisany przez użytkownika do pola input
    var userInput = PROMPT_INPUT.value;

    // 2. Wysyłamy żądanie do serwera (do pliku functions.php)
    fetch('functions.php', {
        method: 'POST',           // Używamy metody POST, bo przesyłamy dane do serwera
        body: userInput           // W ciele wysyłamy tylko tekst z inputa
    })
    
    // 3. Czekamy na odpowiedź z serwera i zamieniamy ją na zwykły tekst
    .then(function(response) {
        return response.text();
    })
    
    // 4. Gdy tekst jest gotowy, wypisujemy go w konsoli
    .then(function(data) {
        console.log("PHP odpowiedziało: " + data);
        
        // Opcjonalnie: wyświetlamy odpowiedź na stronie
        CHAT_BOX.innerHTML += "<p>" + data + "</p>";
    })
    
    // 5. Obsługa błędów (jeśli serwer nie odpowie lub wystąpi problem)
    .catch(function(error) {
        console.error("Wystąpił błąd podczas komunikacji: " + error);
    });
    PROMPT_INPUT.value = ""
}