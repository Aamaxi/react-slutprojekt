import LoginButton from './LoginButton';

function Navbar() {
  return(
    <nav className="Navbar">
      <div className="Navbar-clickables-container">
        <button className="Navbar-hamburger-button">
          <img src="/icons/hamburger_menu.svg" alt="Hamburger Menu"/>
        </button>
        <a href="/" className="Navbar-logo-container">
          <h1 className="Navbar-header">Old Flicks</h1>
          <img src="/icons/logo.svg" alt="Logo" className="Navbar-logo"/>
        </a>
      </div>
      <LoginButton />
    </nav>
  );
}

export default Navbar