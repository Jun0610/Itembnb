import React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'
import Loading from '../components/Loading';
import userContext from '../contexts/userContext';
import ReservationService from '../tools/reservationService'
import StatusTracker from '../components/StatusTracker'
import { useNavigate } from 'react-router-dom';
import "../styles/statusPage.css"




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

    // console.log(activeBorrowerReservations);
    console.log(activeLenderReservations);

    const borrowerStatus = () => {
        if (activeBorrowerReservations === null) {
            return (
                <>
                    <h1>
                        You have no active borrower reservations yet!
                    </h1>
                </>
            )
        }

        else if (activeBorrowerReservations.length !== 0) {
            return (

                <>
                    <div className='borrower-status-container'>
                        {activeBorrowerReservations.map((status) => (
                            <StatusTracker key={status.reservation._id} statusObject={status} user={"borrower"} />
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
                    <h1>
                        You have no active lender reservations yet!
                    </h1>
                </>
            )
        }

        else if (activeLenderReservations.length !== 0) {
            return (

                <>
                    <div className='lender-status-container'>
                        {activeLenderReservations.map((status) => (
                            <StatusTracker key={status.reservation._id} statusObject={status} user={"lender"} activeLenderReservations={activeLenderReservations} setActiveLenderReservations={setActiveLenderReservations} />
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