import { getTasks, saveTasks, addTask, clearTasks } from '../taskUtilities.js';

const taskList = document.getElementById('task-list');
const taskTypeSelection = document.querySelector('.task-type-selection');
const addnewButton = document.getElementById('addnew-button');
const zadButton = document.getElementById('zad-button');
const repButton = document.getElementById('rep-button');
const saveButton = document.getElementById('save-button');

let selectedType = null;

function renderTask(task, idx) {
	const taskElement = document.createElement('div');
	taskElement.className = 'task';

	let innerHTML = '';
	innerHTML += `
		<div class="task-header">
			<h2>${task.title || `Default task`}</h2>
			
		</div>
		<div class="task-content">
			`/*<p>${task.details}</p>*/+`
			<br>
			<div class="milestones">
				<h3><i>Kamienie milowe:</i></h3>
				<ul style="list-style: none;">`;
					for (let i = 0; i < task.milestones.length; i++) {
						const milestone = task.milestones[i];
						const isCompleted = i <= task.progress;

						if (isCompleted) {
							innerHTML += `<li class="completed-milestone"><p><span style="font-style: normal;">◼</span> ${milestone} </p></li>`;
						} else {
							if (i === task.progress + 1) {
								innerHTML += `<li class="ongoing-milestone"><div style="display: flex; align-items: center; gap: 10px;"><p>➜ ${milestone} (bieżący)</p><button class="ongoing-button">Sprawdź się</button></div></li>`;
							} else {
								innerHTML += `<li class="upcoming-milestone"><p><span style="font-style: normal;">◻</span> ${milestone}</p></li>`;
							}
						}
						
					}
	innerHTML += `
				</ul>
			</div>
		</div>
	`;
	taskElement.innerHTML = innerHTML;
	return taskElement;
}

function renderTasks() {
	const tasks = getTasks();

	taskList.innerHTML = '';

	for (let i = 0; i < tasks.length; i++) {
		taskList.appendChild(renderTask(tasks[i], i));
	}
}

addnewButton.addEventListener('click', () => {
	taskTypeSelection.style.display = 'flex';
});
zadButton.addEventListener('click', () => {
	selectedType = 'zad';

	// przekierowuje do chat.php gdzie użytkownik będzie mógł rozmawiać z LLMem i ustalać kamienie milowe dla zadania
	// Po ustaleniu szczegółów, LLM stworzy taska (details i milestones) a następnie zapisze go w localStorage i przekieruje z powrotem do index.php
	// tam będzie wyświetlony w taskList
	window.location.href = 'chat.php?type=zad';
});
repButton.addEventListener('click', () => {
	selectedType = 'rep';
});

//clearTasks();
renderTasks();

const ongoingButton = document.querySelector('.ongoing-button');
ongoingButton.addEventListener('click', () => {
	const taskid = 0; // TODO: pobrać id taska
	const milestoneId = getTasks()[taskid].progress;
	window.location.href = 'sprawdzanie.php?task_id=' + taskid + '&milestone_id=' + milestoneId;
});