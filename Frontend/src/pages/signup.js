import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/signup.css";

const ImgUpload =({
    onChange,
    src
  })=>
    <label htmlFor="photo-upload" className="custom-file-upload fas">
      <div className="img-wrap" >
        <img for="photo-upload" src={src} alt="upload image here"/>
      </div>
      <input id="photo-upload" type="file" onChange={onChange}/> 
    </label>
    
const SignUp = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPass, setConfirmPass] = useState(true);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setSelectedImage(URL.createObjectURL(img));
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
        if (confirmPass)
            console.log("submit");
        else    
            console.log("error");
    };

    return ( 
        <div className="fullscreen">
            <div id="inner-signup-container">
                <h1 id="signup-header">Sign Up</h1>
                <div className="row">
                    <div className="col">
                        <form className="custom-col">
                            <div id="center-img">
                                <ImgUpload onChange={handleImageChange} src={selectedImage}/>
                            </div>
                            <label className="form-label" htmlFor="text">Add user description</label>
                            <textarea className="form-control" name="description" id="description" cols="30" rows="10" onChange={handleDescriptionChange}></textarea>
                        </form>
                    </div>
                    <div className="col">        
                        <form id="custom-signup-form" onSubmit={handleSubmit}>
                            <label className="form-label" htmlFor="name">Enter your name</label>
                            <input className="form-control" type="text" name="name" id="name" onChange={handleNameChange} required/>
                            <label className="form-label" htmlFor="email">Enter email</label>
                            <input className="form-control" type="email" name="email" id="email" onChange={handleEmailChange} required/>
                            <label className="form-label" htmlFor="password">Enter a password</label>
                            <input className="form-control" type="password" name="password" id="password" onChange={handlePasswordChange} required/>
                            <label className="form-label" htmlFor="password2">Confirm password</label>
                            <input className="form-control" type="password" name="password2" id="password2" onChange={handleConfirmPassword} required/>
                            {!confirmPass && <span id="password-error" className="error-message">Your passwords don't match!</span>}
                            <button className="btn custom-btn">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default SignUp;