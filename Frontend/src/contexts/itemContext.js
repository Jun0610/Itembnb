import React from "react";

const itemContext = React.createContext(null);

export const ItemContextProvider = (props) => {
    const [item, setItem] = React.useState(null);

    const setSelectedItem = (item) => {
        setItem(item);
    };

    return (
        <itemContext.Provider value={{item, setSelectedItem}}>
            {props.children}
        </itemContext.Provider>
    )
}


export default itemContext;