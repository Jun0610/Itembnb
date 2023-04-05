import React, {useState, useEffect, useContext} from 'react'
import ReservationService from '../tools/reservationService';
import userContext from '../contexts/userContext';

const LendingHistory = () => {
    const [lendingHist, setLendingHist] = useState([]);
    const authUser = useContext(userContext);

    useEffect(() => {
        async function getAllLendingResv() {
            const data = await ReservationService.getAllPastLendingHistory(authUser.user.user._id);
            setLendingHist(data.data);
        }
        getAllLendingResv();
    });


  return (
    <div>  
        <div>LendingHistory</div>
        <div>
            {lendingHist.map((e, i) => (<div>{e.item.name}</div>))}
        </div>
    </div>
  )
}

export default LendingHistory