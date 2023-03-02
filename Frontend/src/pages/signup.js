import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/signup.css";

const ImgUpload = ({
    onChange,
    src
}) =>
    <label htmlFor="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap" >
            <img for="photo-upload" src={src} alt="upload image here" />
        </div>
        <input id="photo-upload" type="file" onChange={onChange} />
    </label>

const SignUp = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [description, setDescription] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPass, setConfirmPass] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState("Sign Up");

    var xhr = new XMLHttpRequest();

    const nav = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setSelectedImage(URL.createObjectURL(img));

            let reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = () => {
                setImgFile(reader.result);
            };
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        if (password === e.target.value) {
            setConfirmPass(true);
        } else {
            setConfirmPass(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirmPass) {
            var user = {
                "name": name,
                "email": email,
                "password": password,
                "favoritedItems": [],
                "postedItems": [],
                "requestPosts": [],
                "profileDesc": description,
                "reservHist": [],
                "chatId": "12345",
                "borrowerRating": 5,
                "lenderRating": 5,
                "profilePic": imgFile
            };
            fetch("http://localhost:8888/api/user/register-user", {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status === 201) {
                    console.log("success");
                    setSignUpSuccess("Sign up successful! Redirecting...");
                    setTimeout(() => {
                        nav("/");
                    }, 2000);
                } else {
                    console.log(user);
                    console.log(xhr.status);
                    setEmailError(true);
                }
            });
        }
        else
            console.log("passwords not matching");
    };

    return (
        <div className="fullscreen">
            <div id="inner-signup-container">
                <h1 id="signup-header">Sign Up</h1>
                <div className="row">
                    <div className="col">
                        <form className="custom-col">
                            <div id="center-img">
                                <ImgUpload onChange={handleImageChange} src={selectedImage} />
                            </div>
                            <label className="form-label" htmlFor="text">Add user description</label>
                            <textarea className="form-control" name="description" id="description" cols="30" rows="10" onChange={handleDescriptionChange}></textarea>
                        </form>
                    </div>
                    <div className="col">
                        <form id="custom-signup-form" onSubmit={handleSubmit}>
                            <label className="form-label" htmlFor="name">Enter your name</label>
                            <input className="form-control" type="text" name="name" id="name" onChange={handleNameChange} required />
                            <label className="form-label" htmlFor="email">Enter email</label>
                            <input className="form-control" type="email" name="email" id="email" onChange={handleEmailChange} required />
                            {emailError && <span id="email-error" className="error-message">Email already in use!</span>}
                            <label className="form-label" htmlFor="password">Enter a password</label>
                            <input className="form-control" type="password" name="password" id="password" onChange={handlePasswordChange} required />
                            <label className="form-label" htmlFor="password2">Confirm password</label>
                            <input className="form-control" type="password" name="password2" id="password2" onChange={handleConfirmPassword} required />
                            {!confirmPass && <span id="password-error" className="error-message">Your passwords don't match!</span>}
                            <button className="btn custom-btn">{signUpSuccess}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;