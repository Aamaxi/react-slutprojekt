import './App.css';
import Navbar from "./components/navbar/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Film from "./pages/Film.jsx";
import Home from "./pages/Home.jsx";
import List from "./pages/List.jsx";
import Account from "./pages/Account.jsx"
import Person from "./pages/Person.jsx"

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film" element={<Film />} />
        <Route path="/list" element={<List />} />
        <Route path="/account" element={<Account />} />
        <Route path="/person" element={<Person />} />
        <Route path="*" element={<p>Page not found</p>} /> {/* Catch-all route */}
      </Routes>
    </Router>
  );
}