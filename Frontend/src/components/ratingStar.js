import React from 'react';

export const RatingStar = ({ rating }) => {
    if (rating === -1) {
        return <span className="grayText">No Rating</span>
    }

    return <span style={{ color: "#ffc740" }}>{rating}/5</span>
}

export default RatingStar;