import React, {useContext} from "react";
import itemContext from "../contexts/itemContext";

const SelectedItemPost = () => {

    const selectedItem = useContext(itemContext);
    return (
        <div>
            <h1>Selected Item Post</h1>
        <h1>{selectedItem.item.name}</h1>
        </div>
    );
};

export default SelectedItemPost;