import Calendar from 'react-calendar';
import React from 'react';

import '../styles/calendar.css';

const ItemCalendar = () => {
    const [date, setDate] = React.useState(new Date());
    
    return (
        <div>
        <Calendar
            onChange={setDate}
            value={date}
            selectRange={true}
        />
        </div>
    );
}

export default ItemCalendar;