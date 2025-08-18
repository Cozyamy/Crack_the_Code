// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayRedirectPage from "./pages/PlayRedirectPage";
import NotFound from "./pages/NotFound";
import NumberGamePage from "./pages/NumberGamePage";
import WordGamePage from "./pages/WordGamePage";
import CreateCustomGamePage from "./pages/CreateCustomGamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayRedirectPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/number" element={<NumberGamePage />} />
        <Route path="/word" element={<WordGamePage />} />
        <Route path="/create" element={<CreateCustomGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;