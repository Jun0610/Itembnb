import React, {useState, useEffect, useContext} from 'react'
import {useNavigate} from "react-router-dom";
import ReservationService from '../tools/reservationService';
import userContext from '../contexts/userContext';
import Loading from '../components/Loading';

const BorrowingHistory = () => {
    const [borrowingHist, setBorrowingHist] = useState([]);
    const [loading, setLoading] = useState(true);
    const authUser = useContext(userContext);
    const nav = useNavigate();

    useEffect(() => {
        async function getAllBorrowingResv() {
            const data = await ReservationService.getAllPastBorrowingHistory(authUser.user.user._id);
            setBorrowingHist(data.data);
        }
        getAllBorrowingResv().then(() => setLoading(false));
    }, []);

  if (!loading) {
    return (
        <div>  
            <div>BorrowingHistory</div>
            {borrowingHist && borrowingHist.length !== 0 ? 
            <div>
                {borrowingHist.map((e, i) => (<div key={i} className='m-3 p-3 border-4 rounded-3xl border-yellow-400'>
                    <div className='grid grid-cols-2'>
                        <div>
                            <img onClick={() => {nav(`/selected-item-post/${e.item._id}`)}} src={e.item.images[0]} style={{cursor: "pointer"}} alt="pretty" className='h-32 object-scale-down'/>
                            <div>{e.item.name}</div>
                        </div>
                        <div>
                            <div>{e.reservation.startDate}</div>
                            <div>{e.reservation.endDate}</div>
                        </div>
                    </div>
                </div>))}
            </div> : 
            <div>You have no borrowing history yet!</div>}
        </div>
    )
  } else return <Loading />
}

export default BorrowingHistory