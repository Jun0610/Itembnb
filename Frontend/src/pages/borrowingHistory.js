import React, {useState, useEffect, useContext} from 'react'
import ReservationService from '../tools/reservationService';
import userContext from '../contexts/userContext';
import Loading from '../components/Loading';

const BorrowingHistory = () => {
    const [borrowingHist, setBorrowingHist] = useState([]);
    const [loading, setLoading] = useState(true);
    const authUser = useContext(userContext);

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
            <div>
                {borrowingHist.map((e, i) => (<div key={i}>
                    <div className='grid grid-cols-3'>
                        <div>{e.item.name}</div>
                        <div>{e.reservation.startDate}</div>
                        <div>{e.reservation.endDate}</div>
                    </div>
                    </div>))}
            </div>
        </div>
    )
  } else return <Loading />
}

export default BorrowingHistory