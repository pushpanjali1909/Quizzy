import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import { decodeHTMLEntities } from "../utils/decode.js";

export default function Result() {
  const { settings, score, answers, resetProgress } = useQuiz();
  const nav = useNavigate();
  const total = answers.length || Number(settings.amount) || 0;
  const pct = total ? Math.round((score / total) * 100) : 0;

  const restart = () => {
    resetProgress();
    nav("/");
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Your Results</h2>
      <p className="meta">
        <span>Score: {score}/{total}</span>
        <span>•</span>
        <span>{pct}%</span>
        <span>•</span>
        <span>Difficulty: {settings.difficulty || "Any"}</span>
      </p>

      <div className="row">
        {answers.map((a, i) => {
          const correct = a.correct === a.chosen;
          return (
            <div key={i} className="card" style={{ borderRadius: 12, padding: 12 }}>
              <div className="meta">
                <span>Q{i + 1}</span>
                <span>•</span>
                <span>{a.category}</span>
                <span>•</span>
                <span>{a.difficulty}</span>
              </div>
              <div style={{ marginTop: 6, marginBottom: 8 }}>
                {decodeHTMLEntities(a.q)}
              </div>
              <div className="row">
                <div className={"answer " + (correct ? "correct" : "wrong")}>
                  Your answer: {a.chosen ? decodeHTMLEntities(a.chosen) : "—"}
                </div>
                {!correct && (
                  <div className="answer correct">
                    Correct: {decodeHTMLEntities(a.correct)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="spread" style={{ marginTop: 16 }}>
        <button onClick={() => nav("/")}>Change Settings</button>
        <button onClick={restart}>Play Again</button>
      </div>
    </div>
  );
}
