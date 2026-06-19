const PROMPT_INPUT = document.querySelector('.chat-prompt input');
const CHAT_BOX = document.querySelector('.chat-view');

// =============================================================
// STATE MANAGEMENT
// =============================================================
let currentPhase = 0; // 0: SMART, 1: Tasks, 2: Complete
let smartGoal = null;
let tasks = [];
let phaseHistory = {
    phase0: [], // SMART conversation
    phase1: []  // Tasks conversation
};

// =============================================================
// FAZA 0 - SMART
// =============================================================
function getSmartSystemPrompt() {
    return `Pomagasz użytkownikowi sformułować cel wg metodologii SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
Zasady:
1. Jeśli cel NIE spełnia wszystkich 5 kryteriów SMART - zadaj JEDNO pytanie o najważniejsze brakujące kryterium.
2. Jeśli cel SPEŁNIA wszystkie 5 kryteriów SMART - odpowiedz DOKŁADNIE zaczynając od "SMART!" (z wykrzyknikiem), następnie krótko potwierdź cel.
3. Odpowiadaj po polsku. Bądź zwięzły.`;
}

async function runSmartPhase() {
    currentPhase = 0;
    phaseHistory.phase0 = [];
    
    // Clear chat and show phase header
    CHAT_BOX.innerHTML = '<div class="bubble received"><strong>=== FAZA 1: Definiowanie celu SMART ===</strong></div>';
    
    // Wait for user input
    PROMPT_INPUT.placeholder = 'Podaj swój cel...';
}

async function handleSmartPhase(userInput) {
    // Display user message immediately
    CHAT_BOX.innerHTML += '<div class="bubble sent">' + userInput + '</div>';
    CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;

    // Build history for API call
    const history = [
        { role: 'system', content: getSmartSystemPrompt() },
        ...phaseHistory.phase0,
        { role: 'user', content: userInput }
    ];
    
    const response = await callAi(history);
    
    // Add to history
    phaseHistory.phase0.push({ role: 'user', content: userInput });
    phaseHistory.phase0.push({ role: 'assistant', content: response });
    
    // Display AI response
    CHAT_BOX.innerHTML += '<div class="bubble received">' + response + '</div>';
    
    // Check if SMART goal confirmed
    if (response.startsWith('SMART!')) {
        smartGoal = response.replace(/^SMART!\s*/i, '').split('\n')[0].trim();
        if (!smartGoal) smartGoal = userInput;
        
        CHAT_BOX.innerHTML += '<div class="bubble received"><strong>Cel SMART zatwierdzony!</strong></div>';
        
        // Transition to Phase 1
        await startTasksPhase();
    } else {
        // Continue SMART conversation
        PROMPT_INPUT.placeholder = 'Odpowiedź na pytanie...';
    }
    
    CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;
}

// =============================================================
// FAZA 1 - TASKS
// =============================================================
function getTasksSystemPrompt() {
    return `Pomagasz planować małe kroki do celu SMART: "${smartGoal}".
Zasady:
1. Poproś użytkownika o opisanie kolejnego małego kroku/zadania. NIE sugeruj kroków samodzielnie, chyba że użytkownik wprost poprosi.
2. Sprawdź, czy zadanie zawiera:
   a) Tytuł
   b) Termin wykonania
   c) Dla zadań czasowych (których NIE można sprawdzić papierowym testem, np. gitara, bieganie, czytanie) - także długość wykonywania.
3. Jeśli brakuje info - dopytuj.
4. Gdy zadanie jest kompletne - odpowiedz zaczynając DOKŁADNIE od "ZADANIE_OK:" i powtórz tytuł.
5. Odpowiadaj po polsku. Bądź zwięzly.`;
}

async function startTasksPhase() {
    currentPhase = 1;
    phaseHistory.phase1 = [];
    
    CHAT_BOX.innerHTML += '<div class="bubble received"><strong>=== FAZA 2: Małe kroki do celu ===</strong></div>';
    CHAT_BOX.innerHTML += '<div class="bubble received">(Wpisz /end aby zakończyć dodawanie zadań)</div>';
    
    // Start with AI asking about first task
    await promptForNextTask();
}

async function promptForNextTask() {
    const initMsg = tasks.length === 0
        ? 'Zacznijmy. Zapytaj o pierwsze małe zadanie prowadzące do celu.'
        : 'Zadanie zapisane. Zapytaj o kolejne zadanie lub poczekaj na /end.';
    
    const history = [
        { role: 'system', content: getTasksSystemPrompt() },
        { role: 'user', content: initMsg }
    ];
    
    const response = await callAi(history);
    CHAT_BOX.innerHTML += '<div class="bubble received">' + response + '</div>';
    
    phaseHistory.phase1.push({ role: 'user', content: initMsg });
    phaseHistory.phase1.push({ role: 'assistant', content: response });
    
    PROMPT_INPUT.placeholder = 'Opisz zadanie lub wpisz /end...';
    CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;
}

async function handleTasksPhase(userInput) {
    // Display user message immediately
    CHAT_BOX.innerHTML += '<div class="bubble sent">' + userInput + '</div>';
    CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;

    // Check for /end command
    if (userInput.trim() === '/end') {
        await generateFinalJson();
        return;
    }
    
    // Build history
    const history = [
        { role: 'system', content: getTasksSystemPrompt() },
        ...phaseHistory.phase1,
        { role: 'user', content: userInput }
    ];
    
    const response = await callAi(history);
    
    // Add to history
    phaseHistory.phase1.push({ role: 'user', content: userInput });
    phaseHistory.phase1.push({ role: 'assistant', content: response });
    
    // Display AI response
    CHAT_BOX.innerHTML += '<div class="bubble received">' + response + '</div>';
    
    // Check if task is complete
    if (response.startsWith('ZADANIE_OK:')) {
        await extractTaskData(phaseHistory.phase1);
        await promptForNextTask();
    } else {
        PROMPT_INPUT.placeholder = 'Dokończ opis zadania...';
    }
    
    CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;
}

async function extractTaskData(convHistory) {
    const extractSys = `Wyciągnij dane zadania z rozmowy i zwróć TYLKO JSON (bez markdown):
{"title":"...","deadline":"...","duration":"...lub null","details":"..."}`;
    
    const conv = convHistory.map(m => `${m.role === 'user' ? 'U' : 'AI'}: ${m.content}`).join('\n');
    
    const history = [
        { role: 'system', content: extractSys },
        { role: 'user', content: conv }
    ];
    
    const extracted = await callAi(history);
    
    try {
        const cleanJson = extracted.replace(/```json?/gi, '').replace(/```/g, '').trim();
        const taskData = JSON.parse(cleanJson);
        tasks.push(taskData);
        CHAT_BOX.innerHTML += '<div class="bubble received" style="background: #0d9488; color: white;">Zapisano: "' + taskData.title + '"</div>';
    } catch (e) {
        // Fallback if JSON parsing fails
        const lastUserMsg = convHistory[convHistory.length - 2]?.content || 'Zadanie ' + (tasks.length + 1);
        tasks.push({
            title: 'Zadanie ' + (tasks.length + 1),
            deadline: '',
            duration: null,
            details: lastUserMsg
        });
        CHAT_BOX.innerHTML += '<div class="bubble received" style="background: #0d9488; color: white;">Zadanie zapisane.</div>';
    }
}

// =============================================================
// FAZA 2 - FINAL JSON
// =============================================================
async function generateFinalJson() {
    currentPhase = 2;

    CHAT_BOX.innerHTML += '<div class="bubble received"><strong>=== FAZA 3: Generowanie JSON ===</strong></div>';

    const sys = `Generujesz JSON planu działania. Odpowiedz TYLKO JSONem bez markdown.
Schema:
{
  "smartGoal": "string",
  "tasks": [
    {
      "type": "zad lub rep",
      "title": "string",
      "details": "string",
      "milestones": ["...", "..."] lub null,
      "progress": -1,
      "duration": "string lub null"
    }
  ]
}
type="rep": powtarzalne czasowe (gitara, bieganie, czytanie) - ma duration, BRAK milestones.
type="zad": zadanie z efektem - ma milestones (3-5), BRAK duration (null).
progress zawsze = -1 dla nowych zadań.`;

    const prompt = `Cel SMART: ${smartGoal}\n\nZadania:\n${JSON.stringify(tasks, null, 2)}\n\nWygeneruj JSON.`;
    
    const history = [
        { role: 'system', content: sys },
        { role: 'user', content: prompt }
    ];
    
    const result = await callAi(history);
    
    try {
        const cleanJson = result.replace(/```json?/gi, '').replace(/```/g, '').trim();
        const finalPlan = JSON.parse(cleanJson);
        
        CHAT_BOX.innerHTML += '<div class="bubble received"><strong>Plan gotowy!</strong></div>';
        CHAT_BOX.innerHTML += '<div class="bubble received" style="font-family: monospace; white-space: pre-wrap; background: #1A1F29;">' + JSON.stringify(finalPlan, null, 2) + '</div>';

        // Zapisz do localStorage zgodnie z taskUtilities.js
        localStorage.setItem('smartGoal', finalPlan.smartGoal);
        localStorage.setItem('adamed-tasks', JSON.stringify(finalPlan.tasks));

        console.log(`Załadowano cel: ${finalPlan.smartGoal}`);
        console.log(`Zapisano ${finalPlan.tasks.length} zadań do localStorage.`);
        
        PROMPT_INPUT.placeholder = 'Plan zakończony! Przekierowanie...';
        PROMPT_INPUT.disabled = true;
        
        // Przekieruj do tasks.php po krótkim opóźnieniu
        setTimeout(() => {
            window.location.href = 'tasks.php';
        }, 2000);
        
    } catch (e) {
        CHAT_BOX.innerHTML += '<div class="bubble received" style="background: #f8d7da; color: #721c24;">Błąd generowania JSON: ' + e.message + '</div>';
    }
    
    CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;
}

function downloadJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =============================================================
// AI CALL HELPER
// =============================================================
async function callAi(history) {
    const response = await fetch('functions.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            history: history
        })
    });

    const data = await response.text();

    // Check for error
    try {
        const decoded = JSON.parse(data);
        if (decoded.error) {
            throw new Error(decoded.error);
        }
    } catch (e) {
        // Not JSON or parse error, return as-is
    }

    return data;
}

// =============================================================
// TASK UTILITIES COMPATIBILITY
// =============================================================
// Te funkcje są zgodne z taskUtilities.js dla dodatkowej kompatybilności
const storageKey = 'adamed-tasks';

function getTasks() {
    const storedTasks = localStorage.getItem(storageKey);
    if (!storedTasks) return [];
    try {
        const parsedTasks = JSON.parse(storedTasks);
        return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch {
        return [];
    }
}

function saveTasksLocal(tasks) {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasksLocal(tasks);
}

function setTask(index, newtask) {
    const tasks = getTasks();
    tasks[index] = newtask;
    saveTasksLocal(tasks);
}

function addTask(type, title, details, milestones, duration = null) {
    if (!type) return;
    const tasks = getTasks();
    const newTask = {
        type,
        title,
        details,
        progress: -1
    };
    if (type === 'zad' && milestones) {
        newTask.milestones = milestones;
    }
    if (type === 'rep' && duration) {
        newTask.duration = duration;
    }
    tasks.push(newTask);
    saveTasksLocal(tasks);
}

// =============================================================
// MAIN INPUT HANDLER
// =============================================================
async function sendToAi() {
    const userInput = PROMPT_INPUT.value.trim();
    
    if (!userInput) return;
    if (currentPhase === 2) return; // Phase complete
    
    PROMPT_INPUT.value = '';
    
    switch (currentPhase) {
        case 0:
            await handleSmartPhase(userInput);
            break;
        case 1:
            await handleTasksPhase(userInput);
            break;
    }
}

// Handle Enter key
PROMPT_INPUT.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendToAi();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    runSmartPhase();
});