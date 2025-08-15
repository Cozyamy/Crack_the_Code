// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayGame from "./pages/PlayGame";
import NotFound from "./pages/NotFound";
import NumberGamePage from "./pages/NumberGamePage";
import WordGamePage from "./pages/WordGamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayGame />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/number" element={<NumberGamePage />} />
        <Route path="/word" element={<WordGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;