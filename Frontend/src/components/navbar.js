import '../styles/navbar.css';
import { NavLink } from 'react-router-dom';
import {useContext} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import userContext from '../contexts/userContext';

const Navbar = () => {
  const logo = require("../resources/logo-no-background.png");

  const authUser = useContext(userContext);

  const logout = (e) => {
    e.preventDefault();
    authUser.logout();
  };

  return (
    <nav className="navbar customNavBar">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} className="brand-logo" alt='...'>
          </img>
        </a>
        <ul className="custom-ul">
          {!authUser.isAuth && <li>
            <NavLink to="/signup" className="custom-nav-link">
              Sign Up
            </NavLink>
          </li>}
          {!authUser.isAuth && <li>
            <NavLink to="/login" className="custom-nav-link">
              Login
            </NavLink>
          </li>}
          {authUser.isAuth && <li>
            <NavLink to="/logout" onClick={logout} className="custom-nav-link">
              Logout
            </NavLink>
          </li>}
          {authUser.isAuth && <li>
            <NavLink to="/create-item-post" className="custom-nav-link">
              Create Item Post!
            </NavLink>
          </li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
