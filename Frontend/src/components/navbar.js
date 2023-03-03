import '../styles/navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserData } from '../tools/userServices';

import userContext from '../contexts/userContext';

const Navbar = () => {
  const logo = require("../resources/logo-no-background.png");

  const authUser = useContext(userContext);
  const [userData, setUserData] = useState({});
  const nav = useNavigate();

  //keeps user logged in
  useEffect(() => {
    if (sessionStorage.getItem('curUser') !== null) {
      authUser.login(JSON.parse(sessionStorage.getItem('curUser')))
    }

    const fetchUserData = async () => {
      try {
        const res = await getUserData(JSON.parse(sessionStorage.getItem('curUser'))._id);
        setUserData(res.data);
      } catch (err) {
        return err
      }
    }
    fetchUserData();
  }, [sessionStorage.getItem('curUser')])

  const logout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('curUser')
    nav('/')
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
          {authUser.isAuth && <li>
            <NavLink to="/create-item-request" className="custom-nav-link">
              Create Item Request!
            </NavLink>
          </li>}
          {authUser.isAuth && <li>
            <NavLink to={"/user/" + authUser.user.user._id} className="nav-link-img">
              <img src={userData.profilePic} alt="" className='nav-img' />
            </NavLink>
          </li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
