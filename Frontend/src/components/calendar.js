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
    const [date, setDate] = React.useState(new Date());
    
    const onChangePrint = (date) => {
        console.log("Date selected: ");
        console.log(date);
        setDate(date);
    }

    return (
        <div>
        <Calendar
            onChange={onChangePrint}
            selectRange={true}
            tileDisabled={itemUnavail}
        />
        </div>
    );
}

export default ItemCalendar;