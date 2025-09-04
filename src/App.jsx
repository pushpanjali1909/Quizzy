import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Quiz from "./pages/Quiz.jsx";
import Result from "./pages/Result.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";

export default function App() {
  return (
    <QuizProvider>
      <div className="app">
        <header className="app__header">
          <Link to="/" className="brand">Quizzy</Link>
        </header>

        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>

        <footer className="app__footer">© {new Date().getFullYear()} Quizzy</footer>
      </div>
    </QuizProvider>
  );
}
