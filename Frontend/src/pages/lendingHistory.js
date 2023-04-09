import React, { useState, useEffect, useContext } from 'react'
import { NavLink } from "react-router-dom";
import ReservationService from '../tools/reservationService';
import userContext from '../contexts/userContext';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const LendingHistory = () => {
    const [lendingHist, setLendingHist] = useState([]);
    const authUser = useContext(userContext);
    const [loading, setLoading] = useState(true);
    const [minimize, setMinimize] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        async function getAllLendingResv() {
            // use sessionUser instead of authUser since authUser + userEffect is unreliable
            const sessionUser = JSON.parse(sessionStorage.getItem('curUser'));
            const data = await ReservationService.getAllPastLendingHistory(sessionUser._id);
            setLendingHist(data.data);
            /*
            SocketService.connect();
            socket.emit('sendId', sessionUser.email);
            */
        }
        getAllLendingResv().then(() => setLoading(false));
    }, []);

    if (authUser.user.user == null) {
        return nav("/login-required");
    }
    if (!loading) {
        return (
            <div>
                <div>LendingHistory</div>
                <div onClick={() => setMinimize(!minimize)}>Minimize Mode</div>
                {lendingHist === null || lendingHist === undefined || lendingHist.length === 0 ? <div>You don't have any lending history yet!</div>
                    : <div>
                        {lendingHist.map((e, i) => (
                            minimize ?
                                <div key={i} className='m-3 p-3 border-b-2 border-b-yellow-600 flex gap-4 justify-between'>
                                    <div>
                                        {e.item.name}
                                    </div>
                                    <div style={{ cursor: "pointer" }} onClick={() => nav(`/user/${e.borrower._id}`)}>
                                        {e.borrower.name}
                                    </div>
                                    <div>
                                        from {new Date(e.reservation.startDate).toDateString()} to {new Date(e.reservation.endDate).toDateString()}
                                    </div>
                                </div> :
                                <div key={i} className='m-3 p-3 border-2 border-yellow-400 rounded-3xl'>
                                    <div className='grid grid-cols-5'>
                                        <div>{e.item.name}</div>
                                        <div>{new Date(e.reservation.startDate).toDateString()}</div>
                                        <div>{new Date(e.reservation.endDate).toDateString()}</div>
                                        <div>{e.borrower.name}</div>
                                        <img src={e.borrower.profilePic} alt="" style={{ cursor: "pointer" }} className="owner-img" onClick={() => nav(`/user/${e.borrower._id}`)} />
                                        <NavLink to={"/create-user-review/" + e.borrower._id} className="plainLink"><button className="defaultButton">Review This Borrower</button></NavLink>
                                    </div>
                                </div>))}
                    </div>}
            </div>
        )
    } else return <Loading />

}

export default LendingHistory