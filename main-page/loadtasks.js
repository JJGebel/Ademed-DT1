// Wczytaj plan.json i zapisz do localStorage
async function loadPlanToLocalStorage(jsonPath = 'plan.json') {
  const res = await fetch(jsonPath);
  if (!res.ok) throw new Error(`Nie można wczytać ${jsonPath}: ${res.status}`);
  const plan = await res.json();

  localStorage.setItem('smartGoal', plan.smartGoal);
  localStorage.setItem('tasks', JSON.stringify(plan.tasks));

  console.log(`Załadowano cel: ${plan.smartGoal}`);
  console.log(`Zapisano ${plan.tasks.length} zadań do localStorage.`);
  return plan;
}

loadPlanToLocalStorage();