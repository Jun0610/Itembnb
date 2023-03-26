import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReservationService from '../tools/reservationService';
import PendingItem from '../components/PendingItem';
import Loading from '../components/Loading';
import "../styles/pendingPage.css"

const PendingPage = () => {
    const nav = useNavigate();
    const [pendingReservations, setPendingReservations] = useState(null);

    useEffect(() => {
        const pageLoad = async () => {
            if (sessionStorage.getItem('curUser') === null) {
                nav('/')
                return
            }

            const res = await ReservationService.getPendingReservationsForUser(JSON.parse(sessionStorage.getItem('curUser'))._id);
            setPendingReservations(res.data);
        }

        pageLoad();
    }, [])

    console.log(pendingReservations);
    if (pendingReservations !== null) {
        return (

            <div className='pending-page-container'>
                <h3 className='pending-page-title'>
                    Pending Reservations
                </h3>
                {pendingReservations.map((statusObject) => (
                    <PendingItem key={statusObject.reservation._id} statusObject={statusObject} curUser={JSON.parse(sessionStorage.getItem('curUser'))} />)
                )}
            </div>
        )
    } else {
        return <Loading />
    }

}

export default PendingPage