import React from "react";
import {socket} from "../tools/socketService";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const intialState = {
    user: null,
    isAuth: false
}

const userContext = React.createContext(intialState);

export const UserContextProvider = (props) => {
    const [user, setUser] = React.useState(intialState);

    const login = (user) => {
        setUser({
            user: user,
            isAuth: true
        })
        console.log(user);
    }

    const logout = () => {
        setUser({
            user: null,
            isAuth: false
        })
    }

    const nav = useNavigate();

    useEffect(() => {
        if (socket.connected) {
            socket.on(`emitAnotherUser`, (response) => {
                if (response['isApproved']) {  
                    if (confirm(`${response['msg']}`)) {
                        nav(`/selected-item-post/${response['itemId']}`)
                    } 
                } else {
                    alert(`${response['msg']}`);
                }
            });
        }
    }, [user])

    return (
        <userContext.Provider value={{ user, isAuth: user.isAuth, login, logout }}>
            {props.children}
        </userContext.Provider>
    )
}


export default userContext;