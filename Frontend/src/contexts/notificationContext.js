import { useEffect, useContext } from "react";
import userContext from "../contexts/userContext";
import {socket} from "../tools/socketService";
import { useNavigate } from 'react-router-dom';
import {confirmAlert} from "react-confirm-alert";


export const NotificationProvider = (props) => {
    const nav = useNavigate();
    const authUser = useContext(userContext);

    useEffect(() => {
        if (socket.connected) {
            socket.on(`emitAnotherUser`, (response) => {
                console.log("response: ", response)
                if (response['isApproved']) {  
                    alert(`You have a notification!`)
                    confirmAlert({
                        title: 'Update about your reservation request',
                        message: `${response['msg']}.Bring you there?`,
                        buttons: [
                            {
                                label: 'Take me there',
                                onClick: () => nav(`/selected-item-post/${response['itemId']}`)
                            }
                        ]
                    })
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

