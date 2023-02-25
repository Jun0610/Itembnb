import React, {useEffect} from "react";
import RequestService from '../tools/requestService';

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";

const CreateRequest = () => {
  const [request, setRequest] = React.useState({
    name: '',
    description: '',
    dateCreated: '',
    ownerID: "TODO",
    resolved: false,
    recommendedItems: []
  });

  const handleRequest = (e) => {
    setRequest({
      ...request, 
      [e.target.id]: e.target.value, 
    });
  }

  const validateRequest = () => {
    let errors = "";
    if (request.name.length < 1) {
      errors += "Invalid name: You must give your item request a name.\n";
    }
    if (request.description.length < 1) {
      errors += "Invalid description: You must give your item request a description.\n";
    }

    if (errors !== "") {
      alert("Error!\n" + errors);
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(request);
    if (validateRequest()) {
      await RequestService.postRequest(request).then((res) => {
        alert("Request successfully posted!");
        setRequest({
          name: '',
          description: '',
        });
      });
    }
  }

  return (
    <div>
      <div className="m-3 text-xl font-bold" style={{color: "#F0D061"}}>Request an Item</div>
      <div>&nbsp;If you'd like to borrow an item you can't find, you can put out a request and other users will try to fulfill it!</div>
      <div className="m-3">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-6 mb-6">
            <div className="flex-none">
              <label htmlFor="name" className="font-bold" style={{color: "#F0D061"}}>Name</label>
              <input className="mt-1 block px-3 border border-slate-300 py-2 rounded-md text-sm shadow-sm placeholder-slate-400 bg-white" id="name" type="text" value={request.name} onChange={handleRequest} name="name"/>
            </div>
            <div className="flex-auto">
              <label htmlFor="description" className="font-bold" style={{color: "#F0D061"}}>Description</label>
              <textarea className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-2 bg-white" id="description" rol={10} value={request.description} onChange={handleRequest} name="description"/>
            </div>
          </div>
          <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{backgroundColor: '#F7D65A'}} type="submit" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
