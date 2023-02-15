import './navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {

    const logo = require('../resources/logo-no-background.png');

    return (
        <nav className="nav-wrapper">
            <div className="container">
                <a href="/" >
                    <img src = {logo} className='brand-logo'></img>
                </a>
                <ul>
                    <li><NavLink to="/signup" className='nav-link'>Sign Up</NavLink></li>
                    <li><NavLink to="/login" className='nav-link'>Login</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;