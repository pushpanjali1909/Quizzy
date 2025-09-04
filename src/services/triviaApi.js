const BASE = "https://opentdb.com";

export async function getCategories() {
  const res = await fetch(`${BASE}/api_category.php`);
  if (!res.ok) throw new Error("Failed to load categories");
  const data = await res.json();
  return data.trivia_categories; // [{id, name}]
}

export async function fetchQuestions({ amount, category, difficulty, type }) {
  const params = new URLSearchParams();
  params.set("amount", amount);
  if (category) params.set("category", category);
  if (difficulty) params.set("difficulty", difficulty);
  if (type) params.set("type", type);

  const res = await fetch(`${BASE}/api.php?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load questions");
  const data = await res.json();

  
  if (data.response_code !== 0) {
    throw new Error("No questions match your filters. Try different settings.");
  }
  return data.results; // [{question, correct_answer, incorrect_answers, ...}]
}
