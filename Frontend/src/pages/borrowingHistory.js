import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import userContext from '../contexts/userContext';
import ReservationService from '../tools/reservationService';
import { BorrowingResSmall, BorrowingResLarge } from '../components/reservationComponents';
import { Loading } from '../components/Loading';

const BorrowingHistory = () => {
    const [borrowingHist, setBorrowingHist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minimize, setMinimize] = useState(false);
    const [isAscD, setIsAscD] = useState(true);
    const [isAscN, setIsAscN] = useState(true);
    const authUser = useContext(userContext);
    const nav = useNavigate();

    useEffect(() => {
        async function getAllBorrowingResv() {
            if (authUser.user.user != null) {
                const data = await ReservationService.getAllPastBorrowingHistory(authUser.user.user._id);
                setBorrowingHist(data.data);
            }
        }
        getAllBorrowingResv().then(() => setLoading(false));
    }, []);

    const changeOrder = (order) => {
        var newBH = [];
        if (order === 'date') {
            setIsAscN(true)
            if (isAscD)
                newBH = borrowingHist.sort(function (a, b) {
                    return new Date(a.reservation.startDate) - new Date(b.reservation.endDate)
                })
            else
                newBH = borrowingHist.sort(function (a, b) {
                    return new Date(b.reservation.startDate) - new Date(a.reservation.endDate)
                })
            setIsAscD(!isAscD)
        } else {
            setIsAscD(true)
            if (isAscN)
                newBH = borrowingHist.sort(function (a, b) {
                    var x = a.item.name.localeCompare(b.item.name)
                    if (x === 0) return new Date(a.reservation.startDate) - new Date(b.reservation.endDate)
                    else return x
                })
            else
                newBH = borrowingHist.sort(function (a, b) {
                    var x = b.item.name.localeCompare(a.item.name)
                    if (x === 0) return new Date(a.reservation.startDate) - new Date(b.reservation.endDate)
                    else return x
                })
            setIsAscN(!isAscN)
        }
        setBorrowingHist([...newBH])
    }

    if (authUser.user.user == null) {
        return nav("/login-required");
    }

    if (!loading) {
        return (
            <div>
                <div className='m-3 flex gap-4'>
                    <div className='text-xl font-bold text-yellow-400'>Borrowing History</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" onClick={() => setMinimize(!minimize)} />
                        <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[8px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        <span className="ml-3 text-sm font-medium">Minimize Mode</span>
                    </label>
                    <div onClick={() => changeOrder('date')} className='items-center font-medium text-sm p-2 bg-yellow-400 rounded-lg text-white' style={{ cursor: "pointer" }}>{isAscD ? 'List By Most Recent' : 'List by Least Recent'}</div>
                    <div onClick={() => changeOrder('name')} className='items-center font-medium text-sm p-2 bg-yellow-400 rounded-lg text-white' style={{ cursor: "pointer" }}>List By Alphabetical Order &nbsp; {isAscN ? '(A-Z)' : '(Z-A)'}</div>
                </div>
                {borrowingHist && borrowingHist.length !== 0 ?
                    <div>
                        {borrowingHist.map((e, i) => (
                            minimize ?
                                <BorrowingResSmall e={e} key={i} nav={nav} /> :
                                <BorrowingResLarge e={e} key={i} nav={nav} showReviewButton={true} />
                        ))}
                    </div>
                    :
                    <div className='text-xl font-bold m-3'>You have no borrowing history yet!</div>}
            </div>);
    } else return <Loading />
}

export default BorrowingHistory