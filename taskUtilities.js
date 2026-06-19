const storageKey = 'adamed-tasks';

// przykład tego jak struktura tasku powinna wyglądać:
const defaultTasks = [
	{
		type: 'zad', // type: 'zad' / 'rep'
		title: 'Układanie kostki rubika', // tytuł: string
        details: "Użytkownik uczy się układania kostki Rubika od zera. Posiada fizyczną kostkę, może poświęcić pół godziny dziennie na naukę i ma dostęp do dowolnych materiałów (filmiki, tutoriale, algorytmy). Cel: umieć ułożyć kostkę samodzielnie z pamięci.",
  		milestones: [
  		  "Potrafię nazwać i wskazać na fizycznej kostce wszystkie jej elementy: ścianki (góra, dół, przód, tył, lewo, prawo), rodzaje klocków (centrum, krawędź, narożnik) oraz ich kolory — bez zaglądania do notatek.",
  		  "Potrafię wykonać z pamięci 6 podstawowych ruchów kostki (R, L, U, D, F, B) oraz ich odwrotności (R', L', U', D', F', B') i rozumiem notację ruchów tak, że gdy ktoś poda mi sekwencję np. 'R U R' U'' wykonuję ją poprawnie.",
  		  "Potrafię ułożyć biały krzyż na dolnej ściance (4 białe krawędzie na swoich miejscach względem kolorów bocznych ścianek) — samodzielnie, z pamięci, bez podpowiedzi.",
  		  "Potrafię ułożyć całą białą ściankę wraz z narożnikami (pierwsza warstwa) — samodzielnie, z pamięci, bez podpowiedzi.",
  		  "Potrafię ułożyć środkową warstwę kostki (4 boczne krawędzie na właściwych miejscach) — samodzielnie, z pamięci, bez podpowiedzi.",
  		  "Potrafię ułożyć żółty krzyż na górnej ściance — samodzielnie, z pamięci, bez podpowiedzi.",
  		  "Potrafię ułożyć całą kostkę od początku do końca — samodzielnie, z pamięci, bez podpowiedzi, w czasie poniżej 5 minut."
  		], // kamienie milowe ustalone przez LLMa, które użytkownik musi osiągnąć, aby zaliczyć zadanie (na razie tylko dla 'zad')
        progress: 3, // postęp w zadaniu (index kamienia milowego, który został osiągnięty)
	},
	{
		type: 'zad', // type: 'zad' / 'rep'
		title: 'Nauka czym jest fotosynteza', // tytuł: string
        details: "Detale . . . .",
  		milestones: [
  		  "Milestone 1 . ..",
  		  "Milestone 2 . ..",
  		  "Milestone 3 . ..",
  		  "Milestone 4 . ..",
  		  "Milestone 5 . ..",
  		  "Milestone 6 . ..",
  		  "Milestone 7 . ..",
  		], // kamienie milowe ustalone przez LLMa, które użytkownik musi osiągnąć, aby zaliczyć zadanie (na razie tylko dla 'zad')
        progress: 4, // postęp w zadaniu (index kamienia milowego, który został osiągnięty)
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

// indeksy nastepnych taskow sie zmniejsza o 1 przy usunieciu danego taska
export function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
}

export function getTask(index) {
	const tasks = getTasks();
	return tasks[index];
}
export function setTask(index, newtask) {
	const tasks = getTasks();
	tasks[index] = newtask;
	saveTasks(tasks);
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