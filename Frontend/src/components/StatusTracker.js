import React, { useEffect } from 'react'
import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert';
import "../styles/statusTracker.css"
import EmailService from '../tools/emailService';
import ReservationService from '../tools/reservationService';
import StatusItem from './StatusItem';
import UserService from '../tools/userService';

const StatusTracker = ({ statusObject, curUser, user, activeLenderReservations, setActiveLenderReservations }) => {

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

    const isOneDayDiff = (firstDate, secondDate) => {
        if (firstDate.getFullYear() == secondDate.getFullYear()) {
            if (firstDate.getMonth() == secondDate.getMonth()) {
                if ((secondDate.getDate() - firstDate.getDate()) == 1 || (secondDate.getDate() - firstDate.getDate()) == 0) {
                    console.log("diff: ", secondDate.getDate() - firstDate.getDate())
                    return true
                }
                else return false
            } else return false
        } else return false
    }

    const handleItemReceived = async () => {
        const result = await ReservationService.itemReceived(statusObject.reservation._id);
        if (result.data === "received" || result.status === 201) {
            setStatus("active")

            console.log("user: ", curUser)
            console.log("notification: ", curUser.isNotification)
            if (curUser.isNotification) {
                // check if the reservation is within a day
                const targetDate = new Date()
                const resvDate = new Date(statusObject.reservation.endDate)
                console.log(`targetDate: ${targetDate}, resvDate: ${resvDate}`)
                if (resvDate - targetDate < 2 * 86399000) {
                    console.log("it is one day diff!")
                    resvDate.setDate(resvDate.getDate() - 1)
                    EmailService.sendEmailBorrow(curUser, `Remember to return ${statusObject.item.name} on ${resvDate.toISOString().substring(0, 10)}!`, `http://localhost:3000/selected-item-post/itemId/${statusObject.item._id}/ownerId/${curUser._id}`)
                    alert(`Remember to return ${statusObject.item.name} on ${resvDate.toISOString().substring(0, 10)}!`)
                    await UserService.addNotification(curUser._id, `Remember to return ${statusObject.item.name} on ${resvDate.toISOString().substring(0, 10)}!`)
                }
            }
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
                <div className='status-tracker-container'>
                    <div className='status-item'>
                        <StatusItem statusObject={statusObject} curUser={curUser} />
                    </div>

                    <div className='progress-bar-container'>
                        <ul className='progress-bar borrower'>
                            <li className={approved}>Reservation Approved</li>
                            <li className={received}><button className='stat-btn' onClick={handleItemReceived}>Item Received</button></li>
                            <li className={returned}>Item Returned</li>
                        </ul>
                    </div>
                </div>

            </>
        )
    } else if (user === "lender") {
        return (
            <>
                <div className='status-tracker-container'>
                    <div className='status-item'>
                        <StatusItem statusObject={statusObject} curUser={curUser} />
                    </div>
                    <div className='progress-bar-container'>
                        <ul className='progress-bar lender'>
                            <li className={approved}>Reservation Approved</li>
                            <li className={received}>Item Given</li>
                            <li className={returned}><button className='stat-btn' onClick={handleItemReturned}>Item Returned</button></li>
                        </ul>
                    </div>

                </div>


            </>
        )

    }


}

export default StatusTracker