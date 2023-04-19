import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReservationService from '../tools/reservationService';
import SocketService, { socket } from '../tools/socketService';
import PendingItem from '../components/PendingItem';
import { Loading } from '../components/Loading';

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
            SocketService.connect();
            socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
            const res = await ReservationService.getPendingReservationsForUser(JSON.parse(sessionStorage.getItem('curUser'))._id);
            setPendingReservations(res.data);
        }

        pageLoad();
    }, [])

    if (pendingReservations !== null && pendingReservations.length !== 0) {
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
    } else if (pendingReservations !== null && pendingReservations.length === 0) {
        return (
            <div className='pending-page-container'>
                <h3 className='pending-page-title'>
                    Pending Reservations
                </h3>
                <h4 className='no-pending-reservations'>
                    You have no pending reservations!
                </h4>
            </div>
        )

    }
    else {
        return <Loading />
    }

}

export default PendingPage