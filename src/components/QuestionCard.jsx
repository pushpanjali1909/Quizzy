import { useMemo } from "react";
import { decodeHTMLEntities } from "../utils/decode.js";
import { shuffle } from "../utils/shuffle.js";

export default function QuestionCard({ q, index, total, onAnswer, chosen, lockReveal }) { 
  const options = useMemo(() => {
    const mixed = [q.correct_answer, ...q.incorrect_answers];
    return shuffle(mixed);
  }, [q]);

  return (
    <div className="card">
      <div className="spread">
        <div className="meta">
          <span>Question {index + 1} / {total}</span>
          <span>•</span>
          <span>{decodeHTMLEntities(q.category)}</span>
          {q.difficulty && <>
            <span>•</span>
            <span>{q.difficulty}</span>
          </>}
        </div>
      </div>

      <h3 className="q-title">{decodeHTMLEntities(q.question)}</h3>

      <div className="row">
        {options.map((opt) => {
          const isChosen = chosen === opt;
          const isCorrect = opt === q.correct_answer;
          const classNames =
            "answer " +
            (lockReveal && isCorrect ? "correct " : "") +
            (lockReveal && isChosen && !isCorrect ? "wrong " : "");

          return (
            <button
              key={opt}
              className={classNames}
              onClick={() => !lockReveal && onAnswer(opt)}
              disabled={lockReveal}
            >
              {decodeHTMLEntities(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
