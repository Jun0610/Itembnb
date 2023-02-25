import React, {useState, useContext} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";
import userContext from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
    
const Login = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loginSuccess, setLoginSuccess] = useState("Login");
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
        fetch("http://localhost:8888/api/user/user-login", {
                method: "POST",
                body: JSON.stringify({email, password}),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status === 200) {
                    console.log("success");
                    setLoginSuccess("Success! Logging in...");
                    setTimeout(() => {
                        nav("/");
                    }, 2000);
                    res.json().then(data => {
                        authUser.login(data.data);
                    });
                } else {
                    console.log("failure");
                    setLoginSuccess("Login failed");
                    setTimeout(() => {
                        setLoginSuccess("Login");
                    }, 2000);
                }
            });
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
                    <button className="btn custom-btn"> {loginSuccess} </button>
                </form>
            </div>
        </div>
     );
}

export default Login;