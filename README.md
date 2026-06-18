# Smart Goal Planner

Interaktywny planer celów SMART z AI (Gemini).

## Wymagania

- Node.js >= 18 (natywny `fetch`)
- Klucz API do Gemini

## Konfiguracja

1. Utwórz plik `keyFile.txt` z kluczem Gemini API (tylko klucz, bez spacji):
   ```
   AIza...twoj_klucz...
   ```

2. Utwórz plik `chatConfig.txt` z systemowym promptem dla swojego asystenta, np.:
   ```
   Jesteś pomocnym asystentem planowania celów. Odpowiadaj zwięźle i po polsku.
   ```

## Uruchomienie

```bash
node smart-planner.js
# lub
npm start
```

## Jak działa

### Faza 1 — Cel SMART
AI sprawdza czy podany cel spełnia kryteria SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
Jeśli nie — zadaje pytania uzupełniające. Gdy cel jest OK, wypisuje `SMART!` i przechodzi dalej.

### Faza 2 — Małe kroki
AI pyta o kolejne małe zadania prowadzące do celu. Weryfikuje że każde zadanie ma:
- Tytuł
- Termin
- Czas trwania (dla zadań czasowych jak ćwiczenia, czytanie)

Wpisz `/end` aby zakończyć fazę planowania.

### Faza 3 — Generowanie JSON
AI tworzy plik `plan.json` z celem i wszystkimi zadaniami.

## Format wyjściowy (plan.json)

```json
{
  "smartGoal": "Pełny cel SMART",
  "tasks": [
    {
      "type": "zad",
      "title": "Tytuł zadania",
      "details": "Opis",
      "deadline": "2025-07-01",
      "duration": null,
      "milestones": ["krok 1", "krok 2", "krok 3"]
    },
    {
      "type": "rep",
      "title": "Ćwiczenie na gitarze",
      "details": "Codzienna praktyka",
      "deadline": "codziennie",
      "duration": "30 minut",
      "milestones": []
    }
  ]
}
```

- `type: "zad"` — zadanie z weryfikowalnym efektem → ma `milestones`
- `type: "rep"` — zadanie powtarzalne czasowe → ma `duration`
