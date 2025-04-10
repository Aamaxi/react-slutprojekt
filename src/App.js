import './App.css';
import Navbar from "./components/navbar/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Film from "./pages/Film.js";
import Home from "./pages/Home.js";
import List from "./pages/List.js";
import Account from "./pages/Account.js"

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film" element={<Film />} /> {/* Route for Film */}
        <Route path="/list" element={<List />} /> {/* Route for List */}
        <Route path="/account" element={<Account />} /> {/* Route for Account */}
      </Routes>
    </Router>
  );
}