import React from "react";

const chatContext = React.createContext(null);

export const ChatContextProvider = (props) => {
    const [user, setUser] = React.useState(null);
    const [otherUser, setOtherUser] = React.useState(null);

    return (
        <chatContext.Provider value={{ user, otherUser, setUser, setOtherUser }}>
            {props.children}
        </chatContext.Provider>
    )
}


export default chatContext;