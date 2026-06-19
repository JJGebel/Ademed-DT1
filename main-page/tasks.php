<?php
// tasks.php - wyswietla zadania z localStorage przez JS
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
  <title>Moje zadania</title>
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
    <h1 id="goal-title">Ładowanie celu...</h1>
    <p id="no-tasks" style="display:none">Brak zadań w localStorage. Uruchom najpierw load-tasks.js.</p>

    <div id="tasks-container"></div>
  </div>

<!-- Modal edycji -->
<dialog id="edit-modal" style="background: #1F2937; color: #E6EDF3; border: 1px solid #2d3748; border-radius: 12px; padding: 2em; max-width: 500px;">
  <h2 style="color: #E6EDF3; margin-bottom: 1em;">Edytuj zadanie</h2>
  <label style="display: block; margin-bottom: 0.5em; color: #9ca3af;">Tytuł:<br>
    <input id="edit-title" type="text" style="width: 100%; padding: 0.5em; background: #0D1117; border: 1px solid #2d3748; color: #E6EDF3; border-radius: 4px; margin-top: 0.25em;">
  </label><br><br>
  <label style="display: block; margin-bottom: 0.5em; color: #9ca3af;">Opis:<br>
    <textarea id="edit-details" rows="3" cols="40" style="width: 100%; padding: 0.5em; background: #0D1117; border: 1px solid #2d3748; color: #E6EDF3; border-radius: 4px; margin-top: 0.25em;"></textarea>
  </label><br><br>
  <label style="display: block; margin-bottom: 0.5em; color: #9ca3af;">Termin:<br>
    <input id="edit-deadline" type="text" style="width: 100%; padding: 0.5em; background: #0D1117; border: 1px solid #2d3748; color: #E6EDF3; border-radius: 4px; margin-top: 0.25em;">
  </label><br><br>
  <label style="display: block; margin-bottom: 0.5em; color: #9ca3af;">Czas wykonania (dla REP):<br>
    <input id="edit-duration" type="text" placeholder="np. 30 minut" style="width: 100%; padding: 0.5em; background: #0D1117; border: 1px solid #2d3748; color: #E6EDF3; border-radius: 4px; margin-top: 0.25em;">
  </label><br><br>
  <button id="edit-save" style="background: #3fa044bd; border: none; border-radius: 8px; color: white; padding: 0.5em 1em; font-weight: 600; cursor: pointer; transition: background 0.2s ease-out;">Zapisz</button>
  <button id="edit-cancel" style="background: #6c757d; border: none; border-radius: 8px; color: white; padding: 0.5em 1em; font-weight: 600; cursor: pointer; transition: background 0.2s ease-out; margin-left: 0.5em;">Anuluj</button>
</dialog>

<script>
// ── Helpers ──────────────────────────────────────────────────────────────────

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Parsuje string czasu np. "30 minut", "1 godzina 20 minut", "45 sekund" → sekundy
function parseDuration(str) {
  if (!str) return null;
  let total = 0;
  const h = str.match(/(\d+)\s*(godzin|hour)/i);
  const m = str.match(/(\d+)\s*(minut|min)/i);
  const s = str.match(/(\d+)\s*(sekund|sec)/i);
  if (h) total += parseInt(h[1]) * 3600;
  if (m) total += parseInt(m[1]) * 60;
  if (s) total += parseInt(s[1]);
  return total > 0 ? total : null;
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderTasks() {
  const goal = localStorage.getItem('smartGoal');
  const raw  = localStorage.getItem('tasks');
  const container = document.getElementById('tasks-container');
  container.innerHTML = '';

  if (!raw) {
    document.getElementById('no-tasks').style.display = 'block';
    document.getElementById('goal-title').textContent = 'Brak danych';
    return;
  }

  const tasks = JSON.parse(raw);
  document.getElementById('goal-title').textContent = 'Cel: ' + goal;

  tasks.forEach((task, i) => {
    const section = document.createElement('section');
    const badge = task.type === 'rep' ? '[REP]' : '[ZAD]';
    const done  = task.done ? ' ✅' : '';
    const badgeColor = task.type === 'rep' ? '#9664f5' : '#57aeff';

    const milestonesHTML = task.milestones && task.milestones.length
      ? `<p style="color: #E6EDF3; margin: 1em 0 0.5em 0;"><strong>Kamienie milowe:</strong></p>
         <ol style="color: #9ca3af; padding-left: 1.5em;">${task.milestones.map(m => `<li style="margin: 0.5em 0; border-radius: 8px; padding: 0.5em; background: #2d3748;">${m}</li>`).join('')}</ol>`
      : '';

    const durationHTML = task.duration
      ? `<p style="color: #9ca3af; margin-bottom: 0.5em;"><strong>Czas wykonania:</strong> ${task.duration}</p>`
      : '';

    // Przycisk akcji: Start! dla REP, Test dla ZAD
    const actionBtn = task.duration
      ? `<button class="btn-start" data-index="${i}" ${task.done ? 'disabled' : ''} style="background: #854cee; border: none; border-radius: 8px; border: 1px solid #a16ce6; color: #faf3ff; padding: 0.5em 1em; font-weight: 600; cursor: pointer; transition: background 0.2s ease-out;">▶ Start!</button>
         <span class="timer" id="timer-${i}" style="display:none; font-weight:bold; margin-left:8px;"></span>`
      : `<button class="btn-test" data-index="${i}" ${task.done ? 'disabled' : ''} style="background: #3fa044bd; border: none; border-radius: 8px; color: white; padding: 0.5em 1em; font-weight: 600; cursor: pointer; transition: background 0.2s ease-out;">📝 Test</button>`;

    section.style.cssText = 'background: #1F2937; border-radius: 12px; padding: 1.5em; margin-bottom: 1.5em; border: 1px solid #2d3748;';
    
    section.innerHTML = `
      <h2 style="color: #E6EDF3; margin-bottom: 1em; font-size: 1.5em;">
        <span style="background: ${badgeColor}; color: #0D1117; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-right: 8px;">${badge}</span>
        ${task.title}${done}
      </h2>
      <p style="color: #9ca3af; margin-bottom: 0.5em;"><strong>Opis:</strong> ${task.details}</p>
      <p style="color: #9ca3af; margin-bottom: 0.5em;"><strong>Termin:</strong> ${task.deadline}</p>
      ${durationHTML}
      ${milestonesHTML}
      <div style="margin-top:1em;">
        ${actionBtn}
        <button class="btn-edit" data-index="${i}" style="background: #57aeff; border: none; border-radius: 8px; color: #0D1117; padding: 0.5em 1em; font-weight: 600; cursor: pointer; transition: background 0.2s ease-out; margin-left: 0.5em;">✏️ Edytuj</button>
        <button class="btn-delete" data-index="${i}" style="background: #dc3545; border: none; border-radius: 8px; color: white; padding: 0.5em 1em; font-weight: 600; cursor: pointer; transition: background 0.2s ease-out; margin-left: 0.5em;">🗑️ Usuń</button>
      </div>
    `;
    container.appendChild(section);
  });

  attachHandlers(tasks);
}

// ── Handlers ──────────────────────────────────────────────────────────────────

const activeTimers = {}; // index → intervalId

function attachHandlers(tasks) {

  // --- TEST ---
  document.querySelectorAll('.btn-test').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index);
      const passed = confirm(`Zadanie: "${tasks[i].title}"\n\nCzy zaliczasz to zadanie?`);
      if (passed) {
        tasks[i].done = true;
        saveTasks(tasks);
        renderTasks();
      }
    });
  });

  // --- START! (timer) ---
  document.querySelectorAll('.btn-start').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index);

      // Jeśli timer już działa — zatrzymaj (toggle)
      if (activeTimers[i]) {
        clearInterval(activeTimers[i]);
        delete activeTimers[i];
        btn.textContent = '▶ Start!';
        return;
      }

      const totalSec = parseDuration(tasks[i].duration);
      if (!totalSec) {
        alert('Nie udało się sparsować czasu: ' + tasks[i].duration);
        return;
      }

      let elapsed = 0;
      const timerEl = document.getElementById(`timer-${i}`);
      timerEl.style.display = 'inline';
      timerEl.textContent = formatTime(0) + ' / ' + formatTime(totalSec);
      btn.textContent = '⏸ Pauza';

      activeTimers[i] = setInterval(() => {
        elapsed++;
        timerEl.textContent = formatTime(elapsed) + ' / ' + formatTime(totalSec);

        if (elapsed >= totalSec) {
          clearInterval(activeTimers[i]);
          delete activeTimers[i];
          tasks[i].done = true;
          saveTasks(tasks);
          alert(`✅ Czas minął! Zadanie "${tasks[i].title}" zaliczone.`);
          renderTasks();
        }
      }, 1000);
    });
  });

  // --- EDYTUJ ---
  const modal     = document.getElementById('edit-modal');
  const inpTitle    = document.getElementById('edit-title');
  const inpDetails  = document.getElementById('edit-details');
  const inpDeadline = document.getElementById('edit-deadline');
  const inpDuration = document.getElementById('edit-duration');
  let editIndex = null;

  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      editIndex = parseInt(btn.dataset.index);
      const t = tasks[editIndex];
      inpTitle.value    = t.title;
      inpDetails.value  = t.details;
      inpDeadline.value = t.deadline;
      inpDuration.value = t.duration || '';
      modal.showModal();
    });
  });

  document.getElementById('edit-save').onclick = () => {
    if (editIndex === null) return;
    tasks[editIndex].title    = inpTitle.value.trim();
    tasks[editIndex].details  = inpDetails.value.trim();
    tasks[editIndex].deadline = inpDeadline.value.trim();
    tasks[editIndex].duration = inpDuration.value.trim() || null;
    saveTasks(tasks);
    modal.close();
    renderTasks();
  };

  document.getElementById('edit-cancel').onclick = () => modal.close();

  // --- USUŃ ---
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index);
      if (!confirm(`Usunąć zadanie "${tasks[i].title}"?`)) return;
      if (activeTimers[i]) { clearInterval(activeTimers[i]); delete activeTimers[i]; }
      tasks.splice(i, 1);
      saveTasks(tasks);
      renderTasks();
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
renderTasks();
</script>

</body>
</html>