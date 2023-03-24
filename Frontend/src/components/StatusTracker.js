import React, { useEffect } from 'react'
import { useState } from 'react'
import "../styles/statusTracker.css"
import ReservationService from '../tools/reservationService';

const StatusTracker = ({ statusObject }) => {

    const [status, setStatus] = useState(statusObject.reservation.status);
    const [approved, setApporved] = useState('')
    const [received, setReceived] = useState('none')
    const [returned, setReturned] = useState('none')
    useEffect(() => {
        if (status === "approved") {
            setApporved('approved')

        } else if (status === "active") {
            setApporved('approved')
            setReceived('received')
        } else {
            setApporved('approved')
            setReceived('received')
            setReturned('returned')
        }
    }, [status])

    const handleItemReceived = async () => {
        console.log(statusObject.reservation._id);
        await ReservationService.itemReceived(statusObject.reservation._id)
        const res = await ReservationService.getReservation(statusObject.reservation._id);
        const reservation = res.data;
        setStatus(reservation.status)
    }

    return (
        <>
            <div className='progress-bar-container'>
                <ul className='progress-bar'>
                    <li className={approved}>Reservation Approved</li>
                    <li className={received}><button className='stat-btn' onClick={handleItemReceived}>Item Received</button></li>
                    <li className={returned}>Item Returned</li>
                </ul>
            </div>

        </>
    )
}

export default StatusTracker