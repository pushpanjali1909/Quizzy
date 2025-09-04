import { createContext, useContext, useState } from "react";

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [settings, setSettings] = useState({
    amount: 10,
    category: "",
    difficulty: "",
    type: "multiple",
    timePerQuestion: 20,
  });

  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const resetProgress = () => {
    setScore(0);
    setAnswers([]);
  };

  return (
    <QuizContext.Provider
      value={{
        settings,
        setSettings,
        score,
        setScore,
        answers,
        setAnswers,
        resetProgress,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => useContext(QuizContext);
