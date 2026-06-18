import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const keyFile = fs.readFileSync(path.join(__dirname, 'keyFile.txt'), 'utf8').trim();
const chatConfig = fs.readFileSync(path.join(__dirname, 'chatConfig.txt'), 'utf8').trim();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function callGemini(systemPrompt, messages) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${keyFile}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: messages
    })
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status} - ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
}

// =============================================================
// FAZA 1 - Petla SMART
// =============================================================
async function smartLoop() {
  const sys = `${chatConfig}

Pomagasz uztkownikowi sformulowac cel wg metodologii SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
Zasady:
1. Jesli cel NIE spełnia wszystkich 5 kryteriow SMART - zadaj JEDNO pytanie o najwazniejsze brakujace kryterium.
2. Jesli cel SPELNIA wszystkie 5 kryteriow SMART - odpowiedz DOKLADNIE zaczynajac od "SMART!" (z wykrzyknikiem), nastepnie krotko potwierdz cel.
3. Odpowiadaj po polsku. Badz zwiezly.`;

  const history = [];
  console.log('\n=== FAZA 1: Definiowanie celu SMART ===\n');
  const goalInput = await ask('Podaj swoj cel: ');
  history.push({ role: 'user', parts: [{ text: goalInput }] });

  while (true) {
    const reply = await callGemini(sys, history);
    console.log(`\nAI: ${reply}\n`);
    history.push({ role: 'model', parts: [{ text: reply }] });
    if (reply.startsWith('SMART!')) {
      const confirmed = reply.replace(/^SMART!\s*/i, '').split('\n')[0].trim();
      return confirmed || goalInput;
    }
    const userReply = await ask('Ty: ');
    history.push({ role: 'user', parts: [{ text: userReply }] });
  }
}

// =============================================================
// FAZA 2 - Petla zadan
// =============================================================
async function tasksLoop(smartGoal) {
  const sys = `${chatConfig}

Pomagasz planowac male kroki do celu SMART: "${smartGoal}".
Zasady:
1. Poproś użytkownika o opisanie kolejnego małego kroku/zadania. NIE sugeruj kroków samodzielnie, chyba że użytkownik wprost poprosi.
2. Sprawdź, czy zadanie zawiera:
   a) Tytuł
   b) Termin wykonania
   c) Dla zadań czasowych (których NIE można sprawdzić papierowym testem, np. gitara, bieganie, czytanie) - także długość wykonywania.
3. Jeśli brakuje info - dopytuj.
4. Gdy zadanie jest kompletne - odpowiedz zaczynając DOKŁADNIE od "ZADANIE_OK:" i powtórz tytuł.
5. Odpowiadaj po polsku. Bądź zwięzły.`;

  const tasks = [];
  console.log('\n=== FAZA 2: Male kroki do celu ===');
  console.log('(Wpisz /end aby zakonczyc)\n');

  while (true) {
    const initMsg = tasks.length === 0
      ? 'Zacznijmy. Zapytaj o pierwsze małe zadanie prowadzące do celu.'
      : `Zadanie zapisane. Zapytaj o kolejne zadanie lub poczekaj na /end.`;

    const th = [{ role: 'user', parts: [{ text: initMsg }] }];
    const initReply = await callGemini(sys, th);
    console.log(`AI: ${initReply}\n`);
    th.push({ role: 'model', parts: [{ text: initReply }] });

    while (true) {
      const input = await ask('Ty: ');
      if (input.trim() === '/end') { rl.close(); return tasks; }

      th.push({ role: 'user', parts: [{ text: input }] });
      const reply = await callGemini(sys, th);
      console.log(`\nAI: ${reply}\n`);
      th.push({ role: 'model', parts: [{ text: reply }] });

      if (reply.startsWith('ZADANIE_OK:')) {
        const extractSys = `Wyciągnij dane zadania z rozmowy i zwróć TYLKO JSON (bez markdown):
{"title":"...","deadline":"...","duration":"...lub null","details":"..."}`;
        const conv = th.map(m => `${m.role === 'user' ? 'U' : 'AI'}: ${m.parts[0].text}`).join('\n');
        const extracted = await callGemini(extractSys, [{ role: 'user', parts: [{ text: conv }] }]);
        try {
          const taskData = JSON.parse(extracted.replace(/```json?/gi, '').replace(/```/g, '').trim());
          tasks.push(taskData);
          console.log(`Zapisano: "${taskData.title}"\n`);
        } catch {
          tasks.push({ title: 'Zadanie ' + (tasks.length + 1), deadline: '', duration: null, details: input });
          console.log('Zadanie zapisane.\n');
        }
        break;
      }
    }
  }
}

// =============================================================
// FAZA 3 - Generowanie JSON
// =============================================================
async function generateJson(smartGoal, tasks) {
  const sys = `Generujesz JSON planu działania. Odpowiedz TYLKO JSONem bez markdown.
Schema:
{
  "smartGoal": "string",
  "tasks": [
    {
      "type": "zad lub rep",
      "title": "string",
      "details": "string",
      "deadline": "string",
      "duration": "string lub null",
      "milestones": ["...", "..."]
    }
  ]
}
type="rep": powtarzalne czasowe (gitara, bieganie, czytanie) - ma duration, BRAK milestones.
type="zad": zadanie z efektem - ma milestones (3-5), BRAK duration (null).`;

  const prompt = `Cel SMART: ${smartGoal}\n\nZadania:\n${JSON.stringify(tasks, null, 2)}\n\nWygeneruj JSON.`;
  const result = await callGemini(sys, [{ role: 'user', parts: [{ text: prompt }] }]);
  return JSON.parse(result.replace(/```json?/gi, '').replace(/```/g, '').trim());
}

// =============================================================
// MAIN
// =============================================================
async function main() {
  console.log('\nSmart Goal Planner - powered by Gemini\n');
  try {
    const smartGoal = await smartLoop();
    console.log(`\nCel SMART zatwierdzony: ${smartGoal}\n`);

    const tasks = await tasksLoop(smartGoal);
    if (tasks.length === 0) { console.log('Brak zadan. Konczę.'); return; }

    console.log('\n=== FAZA 3: Generowanie JSON ===\n');
    const output = await generateJson(smartGoal, tasks);
    const outPath = path.join(__dirname, 'plan.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
    console.log('Plan zapisany do: plan.json\n');
    console.log(JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('Blad:', err.message);
    if (!rl.closed) rl.close();
    process.exit(1);
  }
}

main();
