import { useEffect, useContext } from "react";
import SocketService, {socket} from "../tools/socketService";
import { useNavigate } from 'react-router-dom';
import {confirmAlert} from "react-confirm-alert";

export const NotificationProvider = (props) => {
    const nav = useNavigate();

    useEffect(() => {
        console.log("is socket connected? ", socket.connected);
        if (socket.connected) {
            socket.on(`emitBack`, (response) => {
                console.log("response: ", response)
                if (response['toBorrower']) {
                    // borrower side
                    if (response['isApproved']) {
                        alert(`You have a notification!`)
                        confirmAlert({
                            title: 'Update about your reservation request',
                            message: `${response['msg']} Bring you there?`,
                            buttons: [
                                {
                                    label: 'Take me there',
                                    onClick: () => nav(response['url'])
                                },
                                {
                                    label: 'Thanks! Maybe later',
                                    onClick: () => {}
                                }
                            ]
                        })
                    } else {
                        alert(`${response['msg']}`);
                    }
                } else {
                    // lender side
                    alert(`You have a notification!`)
                    confirmAlert({
                        title: 'Update about your item',
                        message: `${response['msg']}.Bring you there?`,
                        buttons: [
                            {
                                label: 'Take me there',
                                onClick: () => nav(response['url'])
                            },
                            {
                                label: 'Thanks! Maybe later',
                                onClick: () => {}
                            }
                        ]
                    })
                }
            });
        }
    })

    return (
        <div>
            {props.children}
        </div>
    )
}

