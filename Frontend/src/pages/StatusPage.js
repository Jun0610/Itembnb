import React from 'react'
import { useState, useEffect, useContext } from 'react'
import Loading from '../components/Loading';
import userContext from '../contexts/userContext';
import ReservationService from '../tools/reservationService'
import StatusTracker from '../components/StatusTracker'



const StatusPage = () => {
    const [activeReservations, setActiveReservations] = useState([]);

    const curUser = useContext(userContext);
    useEffect(() => {
        async function onLoad() {
            if (sessionStorage.getItem('curUser') === null) {
                return
            }

            try {
                curUser.login(JSON.parse(sessionStorage.getItem('curUser')));
                const userId = JSON.parse(sessionStorage.getItem('curUser'))._id;
                const res = await ReservationService.getActiveReservations(userId);
                if (res.data === null) {
                    setActiveReservations(null)
                } else {
                    setActiveReservations(res.data)
                }


            } catch (err) {
                console.log(err.message);
            }

        }

        onLoad();
    }, [])

    console.log(activeReservations);

    if (activeReservations === null) {
        return (
            <>
                <h1>
                    You have no active reservations yet!
                </h1>
            </>
        )
    }

    else if (activeReservations.length !== 0) {
        return (

            <>
                <div className='item-status-page-container'>
                    {activeReservations.map((status) => (
                        <StatusTracker key={status.reservation._id} statusObject={status} />
                    ))}
                </div>

            </>

        )
    }
    else {
        return <Loading />
    }

}

export default StatusPage