import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/signup.css";

const ImgUpload =({
    onChange,
    src
  })=>
    <label htmlFor="photo-upload" className="custom-file-upload fas">
      <div className="img-wrap" >
        <img for="photo-upload" src={src} alt="upload image here" id="textfix"/>
      </div>
      <input id="photo-upload" type="file" onChange={onChange}/> 
    </label>
    
const SignUp = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setSelectedImage(URL.createObjectURL(img));
        }
    };

    return ( 
        <div id="outer-container">
            <div className="container" id="inner-container">
                <h1>Sign Up</h1>
                <div className="row">
                    <div className="col">        
                        <form>
                            <label className="form-label" htmlFor="name">Enter your name</label>
                            <input className="form-control" type="text" name="username" id="username" />
                            <label className="form-label" htmlFor="email">Enter email</label>
                            <input className="form-control" type="email" name="email" id="email" />
                            <label className="form-label" htmlFor="password">Enter a password</label>
                            <input className="form-control" type="password" name="password" id="password" />
                            <label className="form-label" htmlFor="password2">Confirm password</label>
                            <input className="form-control" type="password" name="password2" id="password2" />
                        </form>
                    </div>
                    <div className="col custom-col">
                        <form>
                            <ImgUpload onChange={handleImageChange} src={selectedImage}/>
                            <label className="form-label" htmlFor="text">Add user description</label>
                            <textarea className="form-control" name="description" id="description" cols="30" rows="10"></textarea>
                        </form>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default SignUp;