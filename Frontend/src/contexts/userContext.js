import React from "react";

const intialState = {
    user: null,
    isAuth: false
}

const userContext = React.createContext(intialState);

export const userContextProvider = (props) => {
    const [user, setUser] = React.useState(intialState);

    const login = (user) => {
        setUser({
            user: user,
            isAuth: true
        })
    }

    const logout = () => {
        setUser({
            user: null,
            isAuth: false
        })
    }

    return (
        <userContext.Provider value={{user, isAuth: user.isAuth, login, logout}}>
            {props.children}
        </userContext.Provider>
    )
}


export default userContext;