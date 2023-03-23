import Calendar from 'react-calendar';
import React, { useContext, useEffect } from 'react';
import itemContext from '../contexts/itemContext';
import userContext from '../contexts/userContext';
import '../styles/calendar.css';

const inDateRange = (date, startDate, endDate) => {
    if ( (date.getFullYear() > startDate.getFullYear() && date.getFullYear() < endDate.getFullYear()) || 
        (date.getFullYear() === startDate.getFullYear() && date.getMonth() > startDate.getMonth() && date.getFullYear() < endDate.getFullYear()) ||
        (date.getFullYear() === startDate.getFullYear() && date.getMonth() === startDate.getMonth() && date.getDate() >= startDate.getDate() && date.getFullYear() < endDate.getFullYear()) ||
        (date.getFullYear() > startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() < endDate.getMonth()) ||
        (date.getFullYear() > startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() === endDate.getMonth() && date.getDate() <= endDate.getDate()) ||
        (date.getFullYear() === startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() > startDate.getMonth() && date.getMonth() < endDate.getMonth()) || 
        (date.getFullYear() === startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() === startDate.getMonth() && date.getDate() >= startDate.getDate() && date.getMonth() < endDate.getMonth()) || 
        (date.getFullYear() === startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() > startDate.getMonth() && date.getDate() <= endDate.getDate() && date.getMonth() === endDate.getMonth()) || 
        (date.getFullYear() === startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() === startDate.getMonth() && date.getMonth() === endDate.getMonth() && date.getDate() >= startDate.getDate() && date.getDate() <= endDate.getDate() ) 
        )
        return true;
    return false;
}

const ItemCalendar = () => {
    const [date, setDate] = React.useState(null);
    const selectedItem = useContext(itemContext);
    const authUser = useContext(userContext);

    useEffect(() => {
        console.log(selectedItem);
        console.log(authUser);
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
                    if (inDateRange(date, date1, date2)) 
                        return true; // calculated this way because getTime() precision is in milliseconds, and we want to compare by day only
                }
            }
        }
        
    }   

    const makeReq = () => {
        if (!date) {
            alert("Please select a date range");
            return;
        }
        if (selectedItem.item.unavailList) {
            for (let i = 0; i < selectedItem.item.unavailList.length; i++) {
                let date1 = new Date(selectedItem.item.unavailList[i].startDate);
                let date2 = new Date(selectedItem.item.unavailList[i].endDate);
                
                if (inDateRange(date1, date[0], date[1]) || inDateRange(date2, date[0], date[1])) {
                    alert("Item is unavailable on this date");
                    return;
                }
            }
            
        } 
        fetch('http://localhost:8888/api/reservation/make-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {userId: authUser.user._id, 
                itemId: selectedItem.item._id, 
                startDate: date[0], 
                endDate: date[1]})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
        setDate(null);
        alert("Request sent!");
    }

    return (
        <div className='calendar-row'>
            <div>
            <Calendar
                onChange={setDate}
                value={date}
                selectRange={true}
                tileDisabled={itemUnavail}
            />
            </div>
            <div>
                <button onClick={reset}>Clear</button>
                <label>From: {date ? date[0].toLocaleDateString() : "None"}</label>
                <label>To: {date ? date[1].toLocaleDateString() : "None"}</label>
                <button onClick={makeReq}>Make Request</button>
            </div>
        </div>
    );
}

export default ItemCalendar;