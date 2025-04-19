import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer";
import Film from "./pages/Film";
import Home from "./pages/Home";
import List from "./pages/List";
import Account from "./pages/Account";
import Person from "./pages/Person";
import Login from "./pages/Login";
import CreateAccount from "./pages/createaccount";
import CreateList from "./pages/createList";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div data-theme="Flicks" className="bg-base-100 flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/film" element={<Film />} />
              <Route path="/list" element={<List />} />
              <Route path="/account" element={<Account />} />
              <Route path="/person" element={<Person />} />
              <Route path="/login" element={<Login />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="/createlist" element={<CreateList />} />
              <Route path="*" element={<p>Page not found</p>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}