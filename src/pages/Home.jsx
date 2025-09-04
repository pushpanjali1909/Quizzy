import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import { getCategories } from "../services/triviaApi.js";
import Loader from "../components/Loader.jsx";
import Error from "../components/Error.jsx";

export default function Home() {
  const { settings, setSettings, setScore, setAnswers } = useQuiz();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    async function loadCats() {
      try {
        setErr("");
        setLoading(true);
        const cats = await getCategories();
        setCategories(cats);
      } catch (e) {
        setErr(e.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    loadCats();
  }, []);

  const startQuiz = () => {
    setScore(0);
    setAnswers([]);
    nav("/quiz");
  };

  if (loading) return <Loader text="Loading categories..." />;
  if (err) return <Error message={err} retry={() => window.location.reload()} />;

  return (
    <div className="card">
      <h2>🎯 Quiz Setup</h2>
      <div className="form">
        {/* Number of Questions */}
        <label>
          Number of Questions:
          <input
            type="number"
            min="5"
            max="50"
            value={settings.amount}
            onChange={(e) =>
              setSettings((s) => ({ ...s, amount: Number(e.target.value) }))
            }
          />
        </label>

        {/* Category */}
        <label>
          Category:
          <select
            value={settings.category}
            onChange={(e) =>
              setSettings((s) => ({ ...s, category: e.target.value }))
            }
          >
            <option value="">Any Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {/* Difficulty */}
        <label>
          Difficulty:
          <select
            value={settings.difficulty}
            onChange={(e) =>
              setSettings((s) => ({ ...s, difficulty: e.target.value }))
            }
          >
            <option value="">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        {/* Type */}
        <label>
          Type:
          <select
            value={settings.type}
            onChange={(e) =>
              setSettings((s) => ({ ...s, type: e.target.value }))
            }
          >
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True / False</option>
          </select>
        </label>

        {/* Time per question */}
        <label>
          Time per Question (sec):
          <input
            type="number"
            min="5"
            max="60"
            value={settings.timePerQuestion}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                timePerQuestion: Number(e.target.value),
              }))
            }
          />
        </label>
      </div>
      <br></br>
      <button onClick={startQuiz}>🚀 Start Quiz</button>
    </div>
  );
}
