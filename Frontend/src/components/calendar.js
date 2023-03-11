import Calendar from 'react-calendar';
import React from 'react';

const ItemCalendar = () => {
    const [value, onChange] = React.useState(new Date());
    
    return (
        <div>
        <Calendar
            onChange={onChange}
            value={value}
        />
        </div>
    );
}

export default ItemCalendar;