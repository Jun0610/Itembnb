import Calendar from "react-calendar"
import React, { useContext, useEffect } from "react"
import userContext from "../contexts/userContext"



const OwnerCalendar = ( {selectedItem} ) => {
    const [date, setDate] = React.useState(null);
    const authUser = useContext(userContext);;

    useEffect(() => {
        
    }, [])

    const reset = () => {
        setDate(null)
    }

    const itemUnavail = ({ date, view }) => {
        if (view === 'month') {
            if (date.getTime() < Date.now())
                return true;
            
        }
    }

    const makeReq = () => {
        console.log(authUser);
    }

    return (
        <div>
            <h1 className="font-bold">Item Calendar</h1>
            <div className="calendar-row">
                <Calendar
                    onChange={setDate}
                    value={date}
                    tileDisabled={itemUnavail}
                />
                <button onClick={reset}>Add exception</button>
                <button onClick={reset}>Add recurrent unavailability</button>
                <button onClick={makeReq}>Add unavailability</button>
            </div>
        </div>
    )
}

export default OwnerCalendar;