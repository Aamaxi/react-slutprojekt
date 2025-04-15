
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Film from "./pages/Film";
import Home from "./pages/Home";
import List from "./pages/List";
import Account from "./pages/Account"
import Person from "./pages/Person"

function App() {
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
  )
}

export default App
