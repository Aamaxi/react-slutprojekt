import './App.css';
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Film from "./pages/Film.js";
import Home from "./pages/Home.js"

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/film">Film</Link> {/* Navigation to the Film page */}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film" element={<Film />} /> {/* Route for Film */}
      </Routes>
    </Router>
  );
}