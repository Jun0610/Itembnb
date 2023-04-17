import React from 'react';

export const RatingStar = ({ rating }) => {
    if (rating === -1) {
        return <span className="grayText" style={{ "font-size": "0.6em" }}>No Rating</span>
    }

    return <span style={{
        "font-weight": "bold", color: "#ee7700"
    }}> {rating}/5</span >
}

export default RatingStar;