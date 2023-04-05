import React, {useState, useEffect, useContext} from 'react'
import ReservationService from '../tools/reservationService';
import userContext from '../contexts/userContext';

const BorrowingHistory = () => {
    const [borrowingHist, setBorrowingHist] = useState([]);
    const authUser = useContext(userContext);

    useEffect(() => {
        async function getAllBorrowingResv() {
            const data = await ReservationService.getAllPastBorrowingHistory(authUser.user.user._id);
            setBorrowingHist(data.data);
        }
        getAllBorrowingResv();
    });


  return (
    <div>  
        <div>BorrowingHistory</div>
        <div>
            {borrowingHist.map((e, i) => (<div>{e.item.name}</div>))}
        </div>
    </div>
  )
}

export default BorrowingHistory