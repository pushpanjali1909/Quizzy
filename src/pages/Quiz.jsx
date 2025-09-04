import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/triviaApi.js";
import { useQuiz } from "../context/QuizContext.jsx";
import Loader from "../components/Loader.jsx";
import Error from "../components/Error.jsx";
import QuestionCard from "../components/QuestionCard.jsx";

export default function Quiz() {
  const { settings, score, setScore, answers, setAnswers } = useQuiz();
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [chosen, setChosen] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion || 20);
  const timerRef = useRef(null);
  const nav = useNavigate();

  // Fetch questions
  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const data = await fetchQuestions(settings);

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("No questions available. Please try again later.");
      }

      setQs(data);
      setIdx(0);
      resetTimer();
    } catch (e) {
      setErr(e.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(settings.timePerQuestion || 20);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    load();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = useMemo(() => qs[idx], [qs, idx]);

  // Save answer
  const commitAnswer = (selected) => {
    if (!current) return; // Guard if undefined

    const correct = current.correct_answer;
    const isCorrect = selected === correct;

    setAnswers((a) => [
      ...a,
      {
        q: current.question,
        correct,
        chosen: selected ?? null,
        category: current.category,
        difficulty: current.difficulty,
      },
    ]);

    if (isCorrect) setScore((s) => s + 1);
  };

  const handleAnswer = (selected) => {
    if (!current) return;
    setChosen(selected);
    setReveal(true);
    clearInterval(timerRef.current);
    commitAnswer(selected);
  };

  const handleAutoTimeUp = () => {
    if (reveal || !current) return; // already answered or no question
    setChosen(null);
    setReveal(true);
    commitAnswer(null);
  };

  const next = () => {
    if (idx + 1 >= qs.length) {
      nav("/result");
      return;
    }
    setIdx((i) => i + 1);
    setChosen(null);
    setReveal(false);
    resetTimer();
  };

  
  if (loading) return <Loader text="Fetching questions..." />;
  if (err) return <Error message={err} retry={load} />;
  if (!current) return <Error message="No questions loaded." />;

  return (
    <div className="card">
      <div className="spread">
        <div className="meta">
          <span>Score: {score}</span>
          <span>•</span>
          <span>Time Left: {timeLeft}s</span>
        </div>
        <button onClick={() => nav("/")}>Exit</button>
      </div>
      <hr />

      <QuestionCard
        q={current}
        index={idx}
        total={qs.length}
        onAnswer={handleAnswer}
        chosen={chosen}
        lockReveal={reveal}
      />

      <div className="spread">
        <small>
          {reveal
            ? "Answer locked. Click Next."
            : "Select an option before time runs out."}
        </small>
        <button onClick={next} disabled={!reveal}>
          {idx + 1 === qs.length ? "Finish" : "Next ▶"}
        </button>
      </div>
    </div>
  );
}
