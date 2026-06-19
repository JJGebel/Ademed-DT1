// KLUCZOWA POPRAWKA: Przeglądarka wymaga końcówki .js w ścieżce
import { getTask, setTask } from './taskUtilities.js';

// Pobranie elementów z HTML
const contentDiv = document.querySelector('.content');
const inputArea = document.querySelector('.INPUT textarea');
const submitBtn = document.querySelector('.submit-btn');
const milestoneElement = document.getElementById('milestone-text');

// Pobranie parametrów task_id i milestone_id
const taskIdStr = contentDiv.getAttribute('data-task-id');
const milestoneIdStr = contentDiv.getAttribute('data-milestone-id');

// Konwersja na liczby całkowite
const taskId = parseInt(taskIdStr, 10);
const milestoneId = parseInt(milestoneIdStr, 10);

const constantInstruction = "Opisz swoimi słowami, czego nauczyłeś się w procesie wykonywania tego małego kroku i jak zbliża Cię to do Twojego większego celu.";

let currentMilestoneText = "";
let currentTaskTitle = ""; // Zachowane tylko w tle dla sztucznej inteligencji

// --- INICJALIZACJA DANYCH ---
if (!isNaN(taskId) && !isNaN(milestoneId)) {
    // UŻYWAMY getTask() zamiast pobierania całej tablicy
    const task = getTask(taskId); 

    if (task && task.milestones && task.milestones[milestoneId]) {
        currentMilestoneText = task.milestones[milestoneId];
        currentTaskTitle = task.title; 

        // Podmiana samego kroku na ekranie
        milestoneElement.innerText = currentMilestoneText;
    } else {
        milestoneElement.innerText = "Błąd: Nie znaleziono takiego kroku milowego.";
        submitBtn.disabled = true;
        inputArea.disabled = true;
    }
} else {
    milestoneElement.innerText = "Błąd: Brak poprawnych parametrów w adresie URL.";
    submitBtn.disabled = true;
    inputArea.disabled = true;
}

// --- LOGIKA FORMULARZA I WYSYŁANIA ---
if (inputArea && submitBtn && currentMilestoneText !== "") {

    inputArea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
        }
    });

    submitBtn.addEventListener('click', async function() {
        const textToSend = inputArea.value.trim();
        
        if (textToSend !== "") {
            submitBtn.textContent = "Weryfikacja wniosków...";
            submitBtn.disabled = true;
            inputArea.disabled = true; 
            
            const graderSystemPrompt = `
                Jesteś mentorem edukacyjnym weryfikującym postępy ucznia.
                Główny cel ucznia to: "${currentTaskTitle}".
                Obecny etap (mały krok) zrealizowany to: "${currentMilestoneText}".
                Uczeń miał za zadanie napisać refleksję: "${constantInstruction}".
                
                Oto refleksja ucznia, w której tłumaczy czego się nauczył:
                "${textToSend}"
                
                Twoje zadanie:
                Oceń, czy odpowiedź ma sens, odnosi się do wykonanego kroku i pokazuje, że uczeń faktycznie wyciągnął jakąś naukę lub wniosek w drodze do Głównego Celu.
                - Jeśli tak: Odpowiedz DOKŁADNIE i TYLKO jednym słowem: "ZALICZONE".
                - Jeśli nie: Odpowiedz zaczynając od "ODRZUCONE: ", a następnie w jednym, krótkim zdaniu doradź uczniowi, czego brakuje w jego myśli.
            `;

            const payload = {
                history: [{ role: "user", content: graderSystemPrompt }]
            };

            try {
                const response = await fetch('functions.php', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const aiResponseText = await response.text();
                console.log("Odpowiedź Mentora AI:", aiResponseText);

                if (aiResponseText.includes("ZALICZONE")) {
                    submitBtn.textContent = "Sukces! Wnioski wyciągnięte ✔";
                    submitBtn.style.backgroundColor = "#00E5FF";
                    submitBtn.style.color = "#0D1117";
                    
                    // --- ZAPISYWANIE PROGRESU ---
                    const currentTask = getTask(taskId);
                    
                    if (currentTask.progress < milestoneId) {
                        currentTask.progress = milestoneId;
                        
                        // Opcjonalnie: Jeśli to był ostatni krok, oznacz zadanie jako ukończone
                        if (currentTask.progress >= currentTask.milestones.length - 1) {
                            currentTask.done = true; 
                        }

                        // Zapisujemy tylko ten konkretny element za pomocą setTask
                        setTask(taskId, currentTask);
                        
                        console.log(`Progres zaktualizowany! Zadanie ${taskId}, nowy postęp: ${milestoneId}`);
                    }
                    
                    setTimeout(() => {
                        showCustomAlert("Gratulacje, krok zaliczony i progres zapisany!");
                    }, 800);

                    setTimeout(() => {
                        window.location.href = 'index.php';
                    }, 5000);

                } else {
                    submitBtn.textContent = "Spróbuj ponownie";
                    submitBtn.disabled = false;
                    inputArea.disabled = false;
                    
                    const reason = aiResponseText.replace("ODRZUCONE:", "").trim();
                    showCustomAlert("Wskazówka od Mentora:\n\n" + reason);
                }

            } catch (error) {
                console.error("Błąd połączenia:", error);
                submitBtn.textContent = "Zatwierdź";
                submitBtn.disabled = false;
                inputArea.disabled = false;
                showCustomAlert("Nie udało się połączyć z serwerem. Sprawdź konsolę.");
            }
            
        } else {
            showCustomAlert("Pole nie może być puste. Napisz, czego udało Ci się dowiedzieć lub nauczyć!");
            inputArea.focus();
        }
    });
}


window.showCustomAlert = function(message) {
    const alertBox = document.getElementById('custom-alert');
    const messageBox = document.getElementById('custom-alert-message');
    
    if (alertBox && messageBox) {
        messageBox.innerText = message;
        alertBox.classList.remove('hidden');
    }
};

window.closeCustomAlert = function() {
    const alertBox = document.getElementById('custom-alert');
    if (alertBox) {
        alertBox.classList.add('hidden');
    }
};