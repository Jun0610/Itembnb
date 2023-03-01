import '../styles/navbar.css';
import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserData } from '../tools/userServices';

import userContext from '../contexts/userContext';

const Navbar = () => {
  const logo = require("../resources/logo-no-background.png");

  const authUser = useContext(userContext);
  const [userData, setUserData] = useState({});

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
  }, [])


  const logout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('curUser')
    authUser.logout();
  };

  const a = () => {
    console.log("authhhhh?", authUser);
    console.log("auhh?", authUser.user.user._id);
  }

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
<<<<<<< HEAD
=======
            <NavLink to="/logout" onClick={logout} className="custom-nav-link">
              Logout
            </NavLink>
          </li>}
          {authUser.isAuth && <li>
>>>>>>> 50386c91e035d8ccde4661beb3c87160c2c00f0d
            <NavLink to="/create-item-post" className="custom-nav-link">
              Create Item Post!
            </NavLink>
          </li>}
          {authUser.isAuth && <li>
            <NavLink to={"/user/"+authUser.user.user._id} className="nav-link-img">
              <img src={userData.profilePic} alt="" className='nav-img' />
            </NavLink>
          </li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
