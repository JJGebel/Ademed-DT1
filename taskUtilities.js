const storageKey = 'adamed-tasks';

// przykład tego jak struktura tasku powinna wyglądać:
const defaultTasks = [
	{
		type: 'zad', // type: 'zad' / 'rep'
		title: 'Tytuł', // tytuł: string
        details: 'To  przykładowy task - stwórz nowy!', // opis: string
        milestones: [
            'punkt 1', 'punkt 2', 'punkt 3', 'punkt 4', 'punkt 5'
        ], // kamienie milowe ustalone przez LLMa, które użytkownik musi osiągnąć, aby zaliczyć zadanie (na razie tylko dla 'zad')
        progress: 1, // postęp w zadaniu (index kamienia milowego, który został osiągnięty)
	}
];

export function getTasks() {
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

export function saveTasks(tasks) {
	localStorage.setItem(storageKey, JSON.stringify(tasks));
}
export function clearTasks() {    
    localStorage.removeItem(storageKey);
}

export function addTask(type, title, details, milestones) {
    if (type === null)  return;

	const tasks = getTasks();

	tasks.push({
		type,
		title,
		details,//: `Task o typie: ${isZadTask ? 'skończalne zadanie' : 'powtarzalne zadanie'}`,
        milestones,
        progress: -1
	});

	saveTasks(tasks);
}