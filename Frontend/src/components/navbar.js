import '../styles/navbar.css';
import { NavLink } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const logo = require("../resources/logo-no-background.png");

  return (
    <nav className="navbar customNavBar">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} className="brand-logo">
          </img>
        </a>
        <ul className="custom-ul">
          <li>
            <NavLink to="/signup" className="custom-nav-link">
              Sign Up
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className="custom-nav-link">
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/create-item-post" className="custom-nav-link">
              Create Item Post!
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
