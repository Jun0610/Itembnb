import Calendar from 'react-calendar';
import React from 'react';

import '../styles/calendar.css';

const itemUnavail = ({date, view}) => {
    if (view === 'month') {
        if (date.getTime() < Date.now()) 
            return true;
    }
        
}

const ItemCalendar = () => {
    const [date, setDate] = React.useState(null);
    
    const onChangePrint = (date) => {
        console.log("Date selected: ");
        console.log(date);
        setDate(date);
    }

    const reset = () => {
        setDate(null);
    }

    return (
        <div>
        <Calendar
            onChange={onChangePrint}
            value={date}
            selectRange={true}
            tileDisabled={itemUnavail}
        />
        <button onClick={reset}>Clear</button>
        </div>
    );
}

export default ItemCalendar;