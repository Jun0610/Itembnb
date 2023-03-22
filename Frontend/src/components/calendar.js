import Calendar from 'react-calendar';
import React, { useContext, useEffect } from 'react';
import itemContext from '../contexts/itemContext';
import userContext from '../contexts/userContext';
import '../styles/calendar.css';



const ItemCalendar = () => {
    const [date, setDate] = React.useState(null);
    const selectedItem = useContext(itemContext);
    const authUser = useContext(userContext);

    useEffect(() => {
        console.log(selectedItem.item);
    }, []);

    const reset = () => {
        setDate(null);
    }
    
    const itemUnavail = ({date, view}) => {
        if (view === 'month') {
            if (date.getTime() < Date.now()) 
                return true;
            if (selectedItem.item.unavailList) {
                for (let i = 0; i < selectedItem.item.unavailList.length; i++) {
                    let date1 = new Date(selectedItem.item.unavailList[i].startDate);
                    let date2 = new Date(selectedItem.item.unavailList[i].endDate);
                    if (date.getFullYear() >= date1.getFullYear() && date.getMonth() >= date1.getMonth() && date.getDate() >= date1.getDate() && 
                    date.getFullYear() <= date2.getFullYear() && date.getMonth() <= date2.getMonth() && date.getDate() <= date2.getDate()) 
                        return true; // calculated this way because getTime() precision is in milliseconds, and we want to compare by day only
                }
            }
        }
        
    }   

    return (
        <div>
        <Calendar
            onChange={setDate}
            value={date}
            selectRange={true}
            tileDisabled={itemUnavail}
        />
        <button onClick={reset}>Clear</button>
        <label>From: {date ? date[0].toLocaleDateString() : "None"}</label>
        <label>To: {date ? date[1].toLocaleDateString() : "None"}</label>
        </div>
    );
}

export default ItemCalendar;