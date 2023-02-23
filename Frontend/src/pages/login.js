import React, {useState, useContext} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";
import userContext from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
    
const Login = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const nav = useNavigate();

    const authUser = useContext(userContext);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit");
        authUser.login({
            user: {email, password}
        });
        nav("/");
    };

    return ( 
        <div className="fullscreen">
            <div id="inner-login-container">
                <h1 id="login-header">Login</h1>   
                <form id="custom-login-form" onSubmit={handleSubmit}>
                    <label className="form-label" htmlFor="email">Enter email</label>
                    <input className="form-control" type="email" name="email" id="email" onChange={handleEmailChange} required/>
                    <label className="form-label" htmlFor="password">Enter a password</label>
                    <input className="form-control" type="password" name="password" id="password" onChange={handlePasswordChange} required/>
                    <button className="btn custom-btn">Login</button>
                </form>
            </div>
        </div>
     );
}

export default Login;