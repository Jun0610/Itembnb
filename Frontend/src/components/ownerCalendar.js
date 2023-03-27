import Calendar from "react-calendar"
import React, { useContext, useEffect } from "react"
import userContext from "../contexts/userContext"


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

const OwnerCalendar = ( {selectedItem} ) => {
    const [date, setDate] = React.useState(null);
    const authUser = useContext(userContext);;

    useEffect(() => {
        console.log(selectedItem);
    }, [])

    const reset = () => {
        setDate(null)
    }

    const itemUnavail = ({ date, view }) => {
        if (view === 'month') {
            if (date.getTime() < Date.now())
                return 'background-red';
            if (selectedItem.unavailList) {
                for (let i = 0; i < selectedItem.unavailList.length; i++) {
                    if (selectedItem.unavailList[i].startDate && selectedItem.unavailList[i].endDate) {
                        let date1 = new Date(selectedItem.unavailList[i].startDate);
                        let date2 = new Date(selectedItem.unavailList[i].endDate);
                        if (inDateRange(date, date1, date2))
                            return "background-red";
                    } else if (selectedItem.unavailList[i].day) {
                        if (date.getDay() === selectedItem.unavailList[i].day)
                            return "background-red";
                    } else {
                        let except = new Date(selectedItem.unavailList[i].exception);
                        if (date.getFullYear() === except.getFullYear() && date.getMonth() === except.getMonth() && date.getDate() === except.getDate())
                            return null;
                    }
                }
            }
        }
    }

    const makeExcep = () => {
        fetch('http://localhost:8888/api/item/mark-unavail', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedItem._id,
                startDate: null,
                endDate: null,
                day: null,
                exception: date[0]
            })
        })
    }

    const makeRecur = () => {
        fetch('http://localhost:8888/api/item/mark-unavail', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedItem._id,
                startDate: null,
                endDate: null,
                day: date[0].getDay(),
                exception: null
            })
        })
    }

    const makeUnavail = () => {
        fetch('http://localhost:8888/api/item/mark-unavail', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedItem._id,
                startDate: date[0],
                endDate: date[1],
                day: null,
                exception: null
            })
        })
    }

    return (
        <div>
            <h1 className="font-bold">Item Calendar</h1>
            <div className="calendar-row">
                <Calendar
                    onChange={setDate}
                    value={date}
                    selectRange={true}
                    tileClassName={itemUnavail}
                />
                <button onClick={reset}>Reset</button>
                <button onClick={makeExcep}>Add exception</button>
                <button onClick={makeRecur}>Add recurrent unavailability</button>
                <button onClick={makeUnavail}>Add unavailability</button>
            </div>
        </div>
    )
}

export default OwnerCalendar;