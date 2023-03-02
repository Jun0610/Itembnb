import React, {useEffect, useContext} from "react";
import {useParams, Navigate} from "react-router-dom";
import RequestService from '../tools/requestService';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import userContext from '../contexts/userContext';

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";

const DisplayRequestPost = () => {
	const userAuth = useContext(userContext);

  const [isEditing, setIsEditing] = React.useState(false);
  const {id} = useParams(); // id of request post

  // Get request to be shown from the server
  const [request, setRequest] = React.useState({ });
  useEffect(() => {

    async function fetchRequest() {
        const data = await RequestService.getRequest(id);
        setRequest(data);
    } 
    fetchRequest();

  }, []);

  if (! Object.keys(request).length) { // if request hasn't loaded
    return ""; // just show a blank screen
  }

  const onRequestChange = (e) => {
    setRequest({
        ...request,
        [e.target.id]: e.target.value
    });
  }

  const handleDeleteRequest = () => {
    console.log("deletion message");
    confirmAlert({
        name: 'Confirm to delete',
        message: "Are you sure you want to delete this request?",
        buttons: [
            {
                label: 'Yes',
                onClick: () => {

                  async function deleteRequest() {
                      const deleteResult = await RequestService.deleteRequest(request, id);
                      console.log("deleteresult", deleteResult);
                      if (deleteResult.success) {
                        alert("Deletion successful. Please return to the homepage.");
                      }
                      return deleteResult;
                  } 
                  console.log("stuff", deleteRequest());

                }
            }, 
            {
                label: 'No',
                onClick: () => {},
            }
        ],
    });
  }

  const handleEditRequest = () => {
    if (isEditing) {
      RequestService.editRequest(request, id);
    }

    setIsEditing(!isEditing);
  }

  return (
    <div>
        <div className="m-3 font-bold" style={{color: "#F0D061"}}>View Item Request</div>
        {(userAuth.user.user._id === 0) && (
        <div>
            <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{backgroundColor: '#F7D65A'}} onClick={handleEditRequest}>{isEditing ? 'Save' : 'Edit'}</button>
            <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{backgroundColor: '#F7D65A'}} onClick={handleDeleteRequest}>Delete</button>
        </div>)}
        <div className='m-3'>
            <div className="flex gap-6 mb-6">
                <div className="flex-none">
                    <label htmlFor='name' className="font-bold" style={{color: "#F0D061"}}>Name</label>
                    <input className="mt-1 block px-3 rounded-md" id="name" type="text" value={request.name} name="name" readOnly={isEditing ? false : true} style={isEditing ? {background: "white", color: "black"} : {background: "#F1F1F1", color: "#545454"}} onChange={onRequestChange}/>
                </div>
                <div className="flex-auto">
                    <label htmlFor='name' className="font-bold" style={{color: "#F0D061"}}>Description</label>
                    <textarea className="mt-1 border rounded-md w-full text-sm block px-3 py-2" id="description" type="text" value={request.description} readOnly={isEditing ? false : true} rol={10} style={isEditing ? {background: "white", color: "black"} : {background: "#F1F1F1", color: "#545454"}} onChange={onRequestChange}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DisplayRequestPost;