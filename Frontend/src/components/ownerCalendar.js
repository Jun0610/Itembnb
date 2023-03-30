import Calendar from "react-calendar"
import React, {useEffect} from "react"


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


const OwnerCalendar = ({ selectedItem,  selectedResv, setRefresh, refresh }) => {
    const [date, setDate] = React.useState(null);

    const reset = () => {
        setDate(null)
    }

    useEffect(() => {
        console.log("selectedResv: ", selectedResv);
        if (selectedResv) {
            var endDate = new Date(selectedResv.endDate)
            setDate([new Date(selectedResv.startDate), endDate])
        } else {
            setDate(null)
        }
    }, [selectedResv])

    const itemUnavail = ({ date, view }) => {

        if (view === 'month') {
            if (date.getTime() < Date.now())
                return 'background-red';
            let ret = null;
            if (selectedItem.unavailList) {
                for (let i = 0; i < selectedItem.unavailList.length; i++) {
                    if (selectedItem.unavailList[i].startDate !== "1970-01-01T00:00:00.000Z" && selectedItem.unavailList[i].endDate !== "1970-01-01T00:00:00.000Z") {
                        let date1 = new Date(selectedItem.unavailList[i].startDate);
                        let date2 = new Date(selectedItem.unavailList[i].endDate);
                        if (inDateRange(date, date1, date2))
                            ret = "background-red";
                    } else if (selectedItem.unavailList[i].day !== null) {
                        if (date.getDay() === selectedItem.unavailList[i].day)
                            ret = "background-red";
                    } else {
                        let except = new Date(selectedItem.unavailList[i].exception);
                        console.log(except + " " + date);
                        if (date.getFullYear() === except.getFullYear() && date.getMonth() === except.getMonth() && date.getDate() === except.getDate()) {
                            console.log("except:" + except);
                            ret = null;
                        }

                    }
                }
            }
            if (selectedItem.pendingList && ret === null) {
                for (let i = 0; i < selectedItem.pendingList.length; i++) {
                    if (selectedItem.pendingList[i].startDate !== "1970-01-01T00:00:00.000Z" && selectedItem.pendingList[i].endDate !== "1970-01-01T00:00:00.000Z") {
                        let date1 = new Date(selectedItem.pendingList[i].startDate);
                        let date2 = new Date(selectedItem.pendingList[i].endDate);
                        if (inDateRange(date, date1, date2))
                            ret = "background-blue";
                    }
                }
            }
            return ret;
        }
    }

    const makeExcep = async () => {
        if (!date) {
            alert("Please select a date range");
            return;
        } else if (date[0].getFullYear() !== date[1].getFullYear() || date[0].getMonth() !== date[1].getMonth() || date[0].getDate() !== date[1].getDate()) {
            alert("Please select a single date");
            return;
        }
        await fetch('http://localhost:8888/api/item/mark-unavail', {
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

        setRefresh(refresh + 1);
        alert("successfully added exception")
        window.location.reload(false);
    }

    const makeRecur = async () => {
        if (!date) {
            alert("Please select a date range");
            return;
        } else if (date[0].getFullYear() !== date[1].getFullYear() || date[0].getMonth() !== date[1].getMonth() || date[0].getDate() !== date[1].getDate()) {
            alert("Please select a single date");
            return;
        }
        await fetch('http://localhost:8888/api/item/mark-unavail', {
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

        setRefresh(refresh + 1);
        alert("successfully added recurrent unavailability")
        window.location.reload(false);
    }

    const makeUnavail = async () => {
        if (!date) {
            alert("Please select a date range");
            return;
        }
        await fetch('http://localhost:8888/api/item/mark-unavail', {
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

        setRefresh(refresh + 1);
        alert("successfully added unavailability")
        window.location.reload(false);
    }

    return (
        <div>
            <h1 className="font-bold">Item Calendar</h1>
            <div className="calendar-owner-row">
                <Calendar
                    onChange={setDate}
                    value={date}
                    selectRange={true}
                    tileClassName={itemUnavail}
                />
                <div className="calendar-owner-row">
                    <div>
                        <button className="calendar-column-btn" onClick={reset}>Reset</button>
                        <button className="calendar-column-btn" onClick={makeExcep}>Add exception</button>
                        <button className="calendar-column-btn" onClick={makeRecur}>Add recurrent unavailability</button>
                        <button className="calendar-column-btn" onClick={makeUnavail}>Add unavailability</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerCalendar;