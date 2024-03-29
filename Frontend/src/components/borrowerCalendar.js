import Calendar from 'react-calendar';
import React, { useContext, useEffect } from 'react';
import userContext from '../contexts/userContext';
import '../styles/calendar.css';
import SocketService, { socket } from '../tools/socketService';
import EmailService from '../tools/emailService';

const inDateRange = (date, startDate, endDate) => {
    if ((date.getFullYear() > startDate.getFullYear() && date.getFullYear() < endDate.getFullYear()) ||
        (date.getFullYear() === startDate.getFullYear() && date.getMonth() > startDate.getMonth() && date.getFullYear() < endDate.getFullYear()) ||
        (date.getFullYear() === startDate.getFullYear() && date.getMonth() === startDate.getMonth() && date.getDate() >= startDate.getDate() && date.getFullYear() < endDate.getFullYear()) ||
        (date.getFullYear() > startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() < endDate.getMonth()) ||
        (date.getFullYear() > startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() === endDate.getMonth() && date.getDate() <= endDate.getDate()) ||
        (date.getFullYear() === startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() > startDate.getMonth() && date.getMonth() < endDate.getMonth()) ||
        (date.getFullYear() === startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() === startDate.getMonth() && date.getDate() >= startDate.getDate() && date.getMonth() < endDate.getMonth()) ||
        (date.getFullYear() === startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() > startDate.getMonth() && date.getDate() <= endDate.getDate() && date.getMonth() === endDate.getMonth()) ||
        (date.getFullYear() === startDate.getFullYear() && date.getFullYear() === endDate.getFullYear() && date.getMonth() === startDate.getMonth() && date.getMonth() === endDate.getMonth() && date.getDate() >= startDate.getDate() && date.getDate() <= endDate.getDate())
    )
        return true;
    return false;
}

const ItemCalendar = ({ selectedItem, setReservSuccess, itemOwner }) => {
    const [date, setDate] = React.useState(null);
    //const selectedItem = useContext(itemContext);
    const authUser = useContext(userContext);

    useEffect(() => {
        console.log(selectedItem);
        console.log(authUser);
    }, []);

    const reset = () => {
        setDate(null);
    }

    const itemUnavail = ({ date, view }) => {
        if (view === 'month') {
            if (date.getTime() < Date.now())
                return true;
            let ret = false;
            if (selectedItem.unavailList) {
                for (let i = 0; i < selectedItem.unavailList.length; i++) {
                    if (selectedItem.unavailList[i].startDate !== "1970-01-01T00:00:00.000Z" && selectedItem.unavailList[i].endDate !== "1970-01-01T00:00:00.000Z") {
                        let date1 = new Date(selectedItem.unavailList[i].startDate);
                        let date2 = new Date(selectedItem.unavailList[i].endDate);
                        if (inDateRange(date, date1, date2))
                            ret = true; // calculated this way because getTime() precision is in milliseconds, and we want to compare by day only
                    } else if (selectedItem.unavailList[i].day !== null) {
                        if (date.getDay() === selectedItem.unavailList[i].day)
                            ret = true;
                    } else {
                        let except = new Date(selectedItem.unavailList[i].exception);
                        if (date.getFullYear() === except.getFullYear() && date.getMonth() === except.getMonth() && date.getDate() === except.getDate())
                            ret = false;
                    }
                }
            }
            return ret;
        }
    }

    const makeReq = () => {
        if (!date) {
            alert("Please select a date range");
            return;
        }
        let invalid = false;
        if (selectedItem.unavailList) {
            let d2 = new Date(date[1].getFullYear(), date[1].getMonth(), date[1].getDate());
            for (var d = new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate()); d <= d2; d.setDate(d.getDate() + 1)) {
                invalid = itemUnavail({ date: d, view: 'month' });
                if (invalid) break;
            }
            if (invalid) {
                alert("Item is unavailable on some dates in the selected range");
                return;
            }
        }
        fetch('http://localhost:8888/api/reservation/make-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    borrowerId: authUser.user.user._id,
                    itemId: selectedItem._id,
                    startDate: date[0],
                    endDate: date[1]
                })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
        setDate(null);

        // send live or email notification to the lender
        SocketService.emit('emitMsg', { type: 'toLender', owner: itemOwner.email, itemId: selectedItem._id, borrower: authUser.user.user.name });
        socket.on('emitBackB', (response) => {
            if (response !== 'success') {
                EmailService.sendEmailRedirection(authUser, itemOwner, `${authUser.user.user.name} has requested a reservation for your item!`, `http://localhost:3000/display-item-post/itemId/${selectedItem._id}/ownerId/${itemOwner._id}`);
            }
        });

        alert("Request sent!");
        setReservSuccess(true);
    }

    const userIsOwner = () => {
        return authUser != undefined &&
            authUser.user.user != null &&
            itemOwner._id === authUser.user.user._id;
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
            <div className='calendar-column'>
                <div className='price-calc'>
                    <span className='price-span'>Total Price: </span>
                    <span className='price-span price-larger'>${date ? Math.ceil((date[1].getTime() - date[0].getTime()) / (1000 * 3600 * 24) * selectedItem.price) : 0}</span>
                </div>
                <div className='calendar-row-2'>
                    <div>

                        <label className='calendar-column-label' >From: {date ? date[0].toLocaleDateString() : "None"}</label>
                        <label className='calendar-column-label' >To: {date ? date[1].toLocaleDateString() : "None"}</label>
                    </div>
                    <div>
                        <button className='calendar-column-btn' onClick={reset}>Clear</button>

                        {userIsOwner() ?
                            <div className='calendar-column-btn' style={{ "background-color": "#888888", "color": "#bbbbbb" }}>Make Request</div> :
                            <button className='calendar-column-btn' onClick={makeReq}>Make Request</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemCalendar;