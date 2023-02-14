import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const logo = require('../resources/logo-no-background.png');

    return (
        <nav className="nav-wrapper">
            <div className="container">
                <a href="/" className='brand-logo'></a>
                <ul className="links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;