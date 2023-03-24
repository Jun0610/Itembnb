import { useEffect, useContext } from "react";
import userContext from "../contexts/userContext";
import {socket} from "../tools/socketService";
import { useNavigate } from 'react-router-dom';


export const NotificationProvider = (props) => {
    const nav = useNavigate();
    const authUser = useContext(userContext);

    useEffect(() => {
        if (socket.connected) {
            socket.on(`emitAnotherUser`, (response) => {
                if (response['isApproved']) {  
                    if (window.confirm(`${response['msg']}`)) {
                        nav(`/selected-item-post/${response['itemId']}`)
                    } 
                } else {
                    alert(`${response['msg']}`);
                }
            });
        }
    }, [authUser])

    return (
        <div>
            {props.children}
        </div>
    )
}

