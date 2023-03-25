import React, { useEffect } from 'react'
import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert';
import "../styles/statusTracker.css"
import ReservationService from '../tools/reservationService';

const StatusTracker = ({ statusObject, user, activeLenderReservations, setActiveLenderReservations }) => {

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
        } else if (status === "completed") {
            setApporved('approved')
            setReceived('received')
            setReturned('returned')
        }
    }, [status])

    const handleItemReceived = async () => {
        console.log(statusObject.reservation._id);
        const result = await ReservationService.itemReceived(statusObject.reservation._id);
        if (result.data === "received" || result.status === 201) {
            setStatus("active")
        } else {
            alert(result.data)
        }

    }

    const handleItemReturned = async () => {
        if (status !== "active") {
            return;
        }
        const result = await ReservationService.itemReturned(statusObject.reservation._id)
        if (result.data === "returned" || result.status === 201) {
            setStatus("completed")
        } else {
            alert(result.data)
        }
        setTimeout(async () => {
            const response = await ReservationService.getReservation(statusObject.reservation._id);
            const reservation = response.data
            confirmAlert({
                title: 'Status Update',
                message: "You have completed this item transaction!",
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {
                            const newActiveReservations = activeLenderReservations.filter(statusObject => statusObject.reservation._id !== reservation._id)
                            if (newActiveReservations.length === 0) {
                                setActiveLenderReservations(null)
                            } else {
                                setActiveLenderReservations(newActiveReservations)
                            }
                        }

                    }
                ],
            })


        }, 1200)


    }

    if (user === 'borrower') {
        return (
            <>
                <div className='progress-bar-container'>
                    <ul className='progress-bar borrower'>
                        <li className={approved}>Reservation Approved</li>
                        <li className={received}><button className='stat-btn' onClick={handleItemReceived}>Item Received</button></li>
                        <li className={returned}>Item Returned</li>
                    </ul>
                </div>

            </>
        )
    } else if (user === "lender") {
        return (
            <>
                <div className='progress-bar-container'>
                    <ul className='progress-bar lender'>
                        <li className={approved}>Reservation Approved</li>
                        <li className={received}>Item Given</li>
                        <li className={returned}><button className='stat-btn' onClick={handleItemReturned}>Item Returned</button></li>
                    </ul>
                </div>

            </>
        )

    }


}

export default StatusTracker