import React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'
import Loading from '../components/Loading';
import userContext from '../contexts/userContext';
import ReservationService from '../tools/reservationService'
import StatusTracker from '../components/StatusTracker'
import { useNavigate } from 'react-router-dom';
import "../styles/statusPage.css"
import SocketService, { socket } from '../tools/socketService';


const StatusPage = () => {
    const [activeBorrowerReservations, setActiveBorrowerReservations] = useState([]);
    const [activeLenderReservations, setActiveLenderReservations] = useState([]);
    const nav = useNavigate();

    const curUser = useContext(userContext);
    useEffect(() => {
        async function onLoad() {
            if (sessionStorage.getItem('curUser') === null) {
                nav('/')
                return
            }

            try {
                curUser.login(JSON.parse(sessionStorage.getItem('curUser')));
                SocketService.connect();
                socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
                const userId = JSON.parse(sessionStorage.getItem('curUser'))._id;
                const borrowerRes = await ReservationService.getActiveBorrowerReservations(userId);
                if (borrowerRes.data === null) {
                    setActiveBorrowerReservations(null)
                } else {
                    setActiveBorrowerReservations(borrowerRes.data)
                }
                const lenderRes = await ReservationService.getActiveLenderReservations(userId);
                if (lenderRes.data === null) {
                    setActiveLenderReservations(null)
                } else {
                    setActiveLenderReservations(lenderRes.data)
                }


            } catch (err) {
                console.log(err.message);
            }

        }

        onLoad();
    }, [])

    useEffect(() => {
        console.log("re-rendering lender's list");
    }, [useRef(activeLenderReservations)])


    const borrowerStatus = () => {
        if (activeBorrowerReservations === null) {
            return (
                <>
                    <div className='borrower-status-container'>
                        <h3 className='status-page-title'>Items Borrowed</h3>
                        <h4 className='status-page-empty-reservation'>
                            You have no active borrower reservations yet!
                        </h4>
                    </div>
                </>
            )
        }

        else if (activeBorrowerReservations.length !== 0) {
            return (

                <>
                    <div className='borrower-status-container'>
                        <h3 className='status-page-title'>Items Borrowed</h3>
                        {activeBorrowerReservations.map((status) => (
                            <StatusTracker key={status.reservation._id} curUser={JSON.parse(sessionStorage.getItem('curUser'))} statusObject={status} user={"borrower"} />
                        ))}
                    </div>

                </>

            )
        }

    }

    const lenderStatus = () => {
        if (activeLenderReservations === null) {
            return (
                <>
                    <div className='lender-status-container'>
                        <h3 className='status-page-title'>Items Lent</h3>
                        <h4 className='status-page-empty-reservation'>
                            You have no active lender reservations yet!
                        </h4>
                    </div>

                </>
            )
        }

        else if (activeLenderReservations.length !== 0) {
            return (

                <>
                    <div className='lender-status-container'>
                        <h3 className='status-page-title'>Items Lent</h3>
                        {activeLenderReservations.map((status) => (
                            <StatusTracker key={status.reservation._id} statusObject={status} curUser={JSON.parse(sessionStorage.getItem('curUser'))} user={"lender"} activeLenderReservations={activeLenderReservations} setActiveLenderReservations={setActiveLenderReservations} />
                        ))}
                    </div>

                </>

            )
        }



    }

    if ((activeBorrowerReservations !== null && activeLenderReservations !== null) && (activeBorrowerReservations.length === 0 || activeLenderReservations.length === 0)) {
        return <Loading />
    } else {
        return (
            <>
                <div className="status-page-container">
                    {borrowerStatus()}
                    {lenderStatus()}
                </div>
            </>
        )
    }





}

export default StatusPage