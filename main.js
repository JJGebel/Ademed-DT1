const storageKey = 'adamed-tasks';
const taskList = document.getElementById('task-list');
const createTaskContent = document.querySelector('.create-task-content');
const createTaskText = createTaskContent.querySelector('p');
const zadButton = document.getElementById('zad-button');
const repButton = document.getElementById('rep-button');
const saveButton = document.getElementById('save-button');

const defaultTasks = [
	{
		type: 'zad',
		title: 'Test 1',
		details: 'To tylko przykładowy task - stwórz nowy, klikając przyciski powyżej!'
	}
];

function getTasks() {
	const storedTasks = localStorage.getItem(storageKey);

	if (!storedTasks) {
		localStorage.setItem(storageKey, JSON.stringify(defaultTasks));
		return [...defaultTasks];
	}

	try {
		const parsedTasks = JSON.parse(storedTasks);
		return Array.isArray(parsedTasks) ? parsedTasks : [...defaultTasks];
	} catch {
		return [...defaultTasks];
	}
}

function saveTasks(tasks) {
	localStorage.setItem(storageKey, JSON.stringify(tasks));
}
function clearTasks() {    
    localStorage.removeItem(storageKey);
    renderTasks();
}

function renderTasks() {
	const tasks = getTasks();

	taskList.innerHTML = '';

	for (let i = 0; i < tasks.length; i++) {
		const task = tasks[i];
		const taskElement = document.createElement('div');
		taskElement.className = 'task';
		taskElement.innerHTML = `
			<h2>${task.title || `Task ${i + 1}`}</h2>
			<div class="task-content">
				<p>${task.details}</p>
			</div>
		`;
		taskList.appendChild(taskElement);
	}
}

function addTask(type) {
    if (type === null)  return;

	const tasks = getTasks();
	const nextNumber = tasks.length + 1;
	const isZadTask = type === 'zad';

	tasks.push({
		type,
		title: `${isZadTask ? 'Zad' : 'Rep'} ${nextNumber}`,
		details: `Task o typie: ${isZadTask ? 'skończalne zadanie' : 'powtarzalne zadanie'}`
	});

	saveTasks(tasks);
	renderTasks();
}

let selectedType = null;

zadButton.addEventListener('click', () => {
	selectedType = 'zad';

    createTaskContent.style.display = 'block';
	createTaskText.textContent = 'To zadanie będzie skończalne - Będzie miało określony cel i sposób zaliczenia.';
});
repButton.addEventListener('click', () => {
	selectedType = 'rep';

    createTaskContent.style.display = 'block';
	createTaskText.textContent = 'To zadanie będzie powtarzalne - możesz je wykonywać wielokrotnie!';
});
saveButton.addEventListener('click', () => {
    addTask(selectedType);
	createTaskContent.style.display = 'none';
});

renderTasks();
