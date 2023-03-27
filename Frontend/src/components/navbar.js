import '../styles/navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import UserService from '../tools/userService';
import App from '../App';
import userContext from '../contexts/userContext';
import SocketService from '../tools/socketService';

const Navbar = () => {
    const logo = require("../resources/logo.png");

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
                const res = await UserService.getUserData(JSON.parse(sessionStorage.getItem('curUser'))._id);
                setUserData(res.data);
            } catch (err) {
                return err
            }
        }
        fetchUserData();
    }, [sessionStorage.getItem('curUser')])

    const logout = (e) => {
        e.preventDefault();
        SocketService.emit("leaveChannel", authUser.user.user.email);
        SocketService.disconnect();
        sessionStorage.removeItem('curUser')
        nav('/')
        authUser.logout();
    };

    const handleDropDown = () => {
        const dropDown = document.getElementById("drop-down");
        dropDown.classList.toggle('open');
    }

    window.onclick = (e) => {
        console.log(e);
        const dropDown = document.querySelector(".drop-down-container")
        if (dropDown && dropDown.classList.contains('open') && !e.target.matches('.nav-img')) {
            dropDown.classList.remove('open');
        }
    }


    return (
        <nav className="customNavBar">
            <a href="/" className="navbar-brand">
                <img src={logo} className="brand-logo" alt='...'>
                </img>
            </a>

            <ul className="nav-bar-info">
                {!authUser.isAuth && <li>
                    <NavLink to="/signup" className="custom-nav-link">
                        Sign Up
                    </NavLink>
                </li>

                }
                {!authUser.isAuth && <li>
                    <NavLink to="/login" className="custom-nav-link">
                        Login
                    </NavLink>
                </li>

                }
                {authUser.isAuth && <li>
                    <NavLink to="/create-item-post" className="custom-nav-link">
                        Create Item Post!
                    </NavLink>
                </li>

                }
                {authUser.isAuth && <li>
                    <NavLink to="/create-item-request" className="custom-nav-link">
                        Create Item Request!
                    </NavLink>
                </li>

                }

            </ul>

            {authUser.isAuth &&
                <>
                    <img src={userData.profilePic} alt="" className='nav-img' onClick={handleDropDown} />

                    <div className='drop-down-container' id='drop-down'>
                        <div className='drop-down-info'>
                            <NavLink to={"/user/" + authUser.user.user._id} className="drop-down-item">
                                Profile
                            </NavLink>
                            <br />
                            <NavLink to={"/item-status"} className="drop-down-item">
                                Active Reservations
                            </NavLink>
                            <br />
                            <NavLink to={"/item-status"} className="drop-down-item">
                                Pending Reservations
                            </NavLink>
                            <br />
                            <NavLink to="/logout" onClick={logout} className="drop-down-item">
                                Logout
                            </NavLink>

                        </div>

                    </div>

                </>
            }
            {/* </div> */}
        </nav>


    );
};

export default Navbar;
