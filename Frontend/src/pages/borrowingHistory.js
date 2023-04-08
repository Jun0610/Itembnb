import React, {useState, useEffect, useContext} from 'react'
import {useNavigate} from "react-router-dom";
import ReservationService from '../tools/reservationService';
import userContext from '../contexts/userContext';
import Loading from '../components/Loading';

const BorrowingHistory = () => {
    const [borrowingHist, setBorrowingHist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minimize, setMinimize] = useState(false);
    const authUser = useContext(userContext);
    const nav = useNavigate();

    useEffect(() => {
        async function getAllBorrowingResv() {
            const data = await ReservationService.getAllPastBorrowingHistory(authUser.user.user._id);
            console.log("data: ", data)
            setBorrowingHist(data.data);
        }
        getAllBorrowingResv().then(() => setLoading(false));
    }, []);

  if (!loading) {
    return (
        <div>  
            <div className='m-3 flex gap-4'>
                <div className='text-xl font-bold text-yellow-400'>Borrowing History</div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" onClick={() => setMinimize(!minimize)}/>
                    <div class="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    <span class="ml-3 text-sm font-medium">Minimize Mode</span>
                </label>
            </div>
            {borrowingHist && borrowingHist.length !== 0 ? 
            <div>
                {borrowingHist.map((e, i) => (
                minimize ? 
                <div key={i} className='m-3 p-3 border-b-2 border-b-yellow-600 flex gap-4 justify-between'>
                    <div style={{cursor: "pointer"}} onClick={() => {nav(`/selected-item-post/${e.item._id}`)}}>
                        {e.item.name}
                    </div>  
                    <div>
                        from {new Date(e.reservation.startDate).toDateString()} to {new Date(e.reservation.endDate).toDateString()}
                    </div>    
                </div> :
                <div key={i} className='m-3 p-3 border-4 rounded-3xl border-yellow-400'>
                    <div className='grid grid-cols-3'>
                        <div>
                            <img onClick={() => {nav(`/selected-item-post/${e.item._id}`)}} src={e.item.images[0]} style={{cursor: "pointer"}} alt="pretty" className='h-32 object-scale-down'/>
                            <div>{e.item.name}</div>
                        </div>
                        <div>.
                            <img onClick={() => {nav(`/user/${e.lender._id}`)}} src={e.lender.profilePic} style={{cursor: "pointer"}} alt="pretty" className='h-32 object-scale-down'/>
                            <div>{e.lender.name}</div>
                        </div>
                        <div>
                            <div>From: {new Date(e.reservation.startDate).toDateString()}</div>
                            <div>To: {new Date(e.reservation.endDate).toDateString()}</div>
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