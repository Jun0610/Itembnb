import React, {useState, useEffect, useContext} from 'react'
import ReservationService from '../tools/reservationService';
import userContext from '../contexts/userContext';
import Loading from '../components/Loading';
import {useNavigate} from 'react-router-dom';

const LendingHistory = () => {
    const [lendingHist, setLendingHist] = useState([]);
    const authUser = useContext(userContext);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        async function getAllLendingResv() {
            console.log(authUser)
            const data = await ReservationService.getAllPastLendingHistory(authUser.user.user._id);
            setLendingHist(data.data);
        }
        getAllLendingResv().then(() => setLoading(false));
    }, []);


  if (!loading) {
    return (
        <div>  
            <div>LendingHistory</div>
            {lendingHist === null || lendingHist === undefined || lendingHist.length === 0 ? <div>You don't have any lending history yet!</div>
            : <div>
            {lendingHist.map((e, i) => (<div key={i}>
                <div className='grid grid-cols-5'>
                    <div>{e.item.name}</div>
                    <div>{e.reservation.startDate}</div>
                    <div>{e.reservation.endDate}</div>
                    <div>{e.borrower.name}</div>
                    <img src={e.borrower.profilePic} alt="" className="owner-img" onClick={() => nav(`/user-profile/${e.borrower._id}`)} />
                </div>
                </div>))}
            </div>}
        </div>
      )
  } else return <Loading />
  
}

export default LendingHistory