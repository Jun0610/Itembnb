import '../styles/navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import UserService from '../tools/userService';
import App from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import userContext from '../contexts/userContext';
import SocketService from '../tools/socketService';
import SearchBar from './SearchBar';

const Navbar = () => {
    const logo = require("../resources/logo.png");

    const authUser = useContext(userContext);
    const [userData, setUserData] = useState({});
    const [notifications, setNotifications] = useState('notifications-off')
    const [listOfNotifications, setListOfNotifications] = useState(undefined)
    const [enable, setEnable] = useState("Enable")
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
                setListOfNotifications(res.data.notificationList)
                const res2 = await UserService.getNotificationStatus(JSON.parse(sessionStorage.getItem('curUser'))._id);
                setNotifications(res2.data)
                if (res2.data === 'notifications-on') {
                    setNotifications('notifications-on')
                    setEnable("Disable")
                }
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

    const handleNotifications = async () => {
        if (enable === 'Disable') {
            const res = await UserService.getUserData(JSON.parse(sessionStorage.getItem('curUser'))._id);
            setUserData(res.data);
            setListOfNotifications(res.data.notificationList)
        }

        const notifBarOpen = document.getElementById('notification')
        notifBarOpen.classList.toggle('open')
    }

    const enableNotification = async () => {
        if (enable === "Enable") {
            setEnable("Disable")
            await UserService.turnOnNotifications(JSON.parse(sessionStorage.getItem('curUser'))._id)
            setNotifications("notifications-on")
        } else {
            setEnable("Enable")
            UserService.turnOffNotifications(JSON.parse(sessionStorage.getItem('curUser'))._id)
            setNotifications('notifications-off')
        }
    }

    console.log("notif list (outside): ", listOfNotifications);

    window.onclick = (e) => {
        const dropDown = document.querySelector(".drop-down-container")
        const notifBar = document.querySelector('.notification-bar')

        if (dropDown === null || notifBar === null) {
            return;
        }
        if (dropDown.classList.contains('open') && !e.target.matches('.nav-img')) {

            dropDown.classList.remove('open');
        }
        if (notifBar.classList.contains('open') && e.target.namespaceURI !== "http://www.w3.org/2000/svg") {

            notifBar.classList.remove('open');
        }

    }

    return (
        <nav className="customNavBar">
            <div>
                <a href="/" className="navbar-brand">
                    <img src={logo} className="brand-logo" alt='...'>
                    </img>
                </a>
            </div>


            {authUser.isAuth &&
                <div className='search-container'>
                    <SearchBar />
                </div>
            }



            <ul className="nav-bar-info">
                {!authUser.isAuth && <li>
                    <NavLink to="/signup" className="custom-nav-link">
                        Sign Up
                    </NavLink>
                </li>

                }
                {!authUser.isAuth &&

                    <li>
                        <NavLink to="/login" className="custom-nav-link">
                            Login
                        </NavLink>
                    </li>

                }

            </ul>
            {authUser.isAuth &&
                <div className='add-item'>
                    <NavLink to="/create-item-post" className="custom-nav-link">
                        <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: "25px" }} />
                    </NavLink>
                    <span className='more-info-item'>Create an Item Post!</span>
                </div>

            }

            {authUser.isAuth &&
                <>
                    <div className='bell'>
                        <FontAwesomeIcon icon={faBell} className={notifications} onClick={handleNotifications} style={{ fontSize: "22px" }} />
                        <span className='more-info-bell'>Notifications</span>
                    </div>



                    <div id='notification' className='notification-bar'>
                        {notifications === 'notifications-on' &&
                            <div className='notification-bar-on'>
                                <button className='enable-notification-btn' onClick={enableNotification}>{enable} deadline notifications</button>
                                <hr style={{ width: "80%", margin: "1rem auto" }} />

                                {(listOfNotifications === undefined || listOfNotifications.length === 0) &&
                                    <div style={{ color: "#a19f9f", paddingBottom: "1rem" }}>
                                        You have no deadline notifications yet!
                                    </div>
                                }

                                {(listOfNotifications !== undefined && listOfNotifications.length !== 0) ?
                                    listOfNotifications.map((notification) =>
                                        (<div className='notification-item'>{notification}</div>)
                                    ) : (<div></div>)
                                }

                            </div>}
                        {notifications === 'notifications-off' &&
                            <div className='notification-bar-off'>
                                <button className='enable-notification-btn' onClick={enableNotification}>{enable} deadline notifications</button>
                                <hr style={{ width: "80%", margin: "1rem auto" }} />
                                <div style={{ color: "#a19f9f", paddingBottom: "1rem" }}>
                                    Please enable notifications to see your notifications
                                </div>

                            </div>}

                    </div>
                </>

            }


            {authUser.isAuth &&
                <>
                    <img src={userData.profilePic} alt="" className='nav-img' onClick={handleDropDown} />

                    <div className='drop-down-container' id='drop-down'>
                        <div className='drop-down-info'>

                            <NavLink to={"/user/" + authUser.user.user._id} className="drop-down-item">
                                <div>
                                    Profile
                                </div>
                            </NavLink>


                            <NavLink to={"/item-status"} className="drop-down-item">
                                <div>
                                    Active Reservations
                                </div>
                            </NavLink>


                            <NavLink to={"/pending-reservations"} className="drop-down-item">
                                <div>
                                    Pending Reservations
                                </div>
                            </NavLink>

                            <NavLink to="/create-item-request" className="drop-down-item">
                                Create Item Request!
                            </NavLink>

                            <NavLink to="/borrowing-history" className="drop-down-item">
                                <div>
                                    Borrowing History
                                </div>
                            </NavLink>

                            <NavLink to="/lending-history" className="drop-down-item">
                                <div>
                                    Lending History
                                </div>
                            </NavLink>

                            <NavLink to="/logout" onClick={logout} className="drop-down-item">
                                <div>
                                    Logout
                                </div>
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
