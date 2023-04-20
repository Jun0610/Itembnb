import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import userContext from '../contexts/userContext';
import ReservationService from '../tools/reservationService';
import { Loading } from '../components/Loading';
import { LendingResSmall, LendingResLarge } from '../components/reservationComponents';

const LendingHistory = () => {
    const [lendingHist, setLendingHist] = useState([]);
    const [items, setItems] = useState([]);
    const [OGLendingHist, setOGLendingHist] = useState([])
    const authUser = useContext(userContext);
    const [loading, setLoading] = useState(true);
    const [minimize, setMinimize] = useState(false);
    const [isAscD, setIsAscD] = useState(true);
    const [isAscN, setIsAscN] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        async function getAllLendingResv() {
            // use sessionUser instead of authUser since authUser + userEffect is unreliable
            const sessionUser = JSON.parse(sessionStorage.getItem('curUser'));
            if (sessionUser != null) {
                const data = await ReservationService.getAllPastLendingHistory(sessionUser._id);
                console.log(data.data)
                setLendingHist(data.data)
                setOGLendingHist(data.data)
                /*
                SocketService.connect();
                socket.emit('sendId', sessionUser.email);
                */
                const newI = []
                if (data.data) {
                    data.data.forEach(e => {
                        if (!newI.includes(e.item.name)) newI.push(e.item.name)
                    })
                }
                setItems(newI)
            }
        }
        getAllLendingResv().then(() => setLoading(false));
    }, []);

    if (authUser.user.user == null) {
        return nav("/login-required");
    }

    const changeOrder = (order) => {
        var newBH = [];
        if (order === 'date') {
            setIsAscN(true)
            if (isAscD)
                newBH = lendingHist.sort(function (a, b) {
                    return new Date(a.reservation.startDate) - new Date(b.reservation.endDate)
                })
            else
                newBH = lendingHist.sort(function (a, b) {
                    return new Date(b.reservation.startDate) - new Date(a.reservation.endDate)
                })
            setIsAscD(!isAscD)
        } else {
            setIsAscD(true)
            if (isAscN)
                newBH = lendingHist.sort(function (a, b) {
                    var x = a.borrower.name.localeCompare(b.borrower.name)
                    if (x === 0) return new Date(a.reservation.startDate) - new Date(b.reservation.endDate)
                    else return x
                })
            else
                newBH = lendingHist.sort(function (a, b) {
                    var x = b.borrower.name.localeCompare(a.borrower.name)
                    if (x === 0) return new Date(a.reservation.startDate) - new Date(b.reservation.endDate)
                    else return x
                })
            setIsAscN(!isAscN)
        }
        setLendingHist([...newBH])
    }

    const onReset = () => {
        setLendingHist(OGLendingHist)
    }

    const onSelectItem = (name) => {
        setLendingHist(OGLendingHist.filter(e => e.item.name === name))
    }

    if (!loading) {
        return (
            <div>
                <div className='m-3 flex gap-4'>
                    <div className='text-xl font-bold text-yellow-400'>Lending History</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" onClick={() => setMinimize(!minimize)} />
                        <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[8px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        <span className="ml-3 text-sm font-medium">Minimize Mode</span>
                    </label>
                    <div onClick={() => changeOrder('date')} className='items-center font-medium text-sm p-2 bg-yellow-400 rounded-lg text-white' style={{ cursor: "pointer" }}>{isAscD ? 'List By Most Recent' : 'List by Least Recent'}</div>
                    <div onClick={() => changeOrder('name')} className='items-center font-medium text-sm p-2 bg-yellow-400 rounded-lg text-white' style={{ cursor: "pointer" }}>List By Alphabetical Order &nbsp; {isAscN ? '(A-Z)' : '(Z-A)'}</div>
                </div>
                {lendingHist === null || lendingHist === undefined || lendingHist.length === 0 ? <div className='text-xl font-bold m-3'>You don't have any lending history yet!</div>
                    : <div>
                        <div className="flex gap-3">
                            <div className='items-center p-2 text-medium font-bold text-yellow-400'>My items: </div>
                            {items.map((e, i) => (<div key={i} onClick={() => onSelectItem(e)} className='items-center font-medium text-sm p-2 bg-yellow-100 rounded-lg' style={{ cursor: "pointer" }}>{e}</div>))}
                            <div onClick={() => onReset()} className='items-center font-medium text-sm p-2 bg-yellow-100 rounded-lg' style={{ cursor: "pointer" }}>Reset</div>
                        </div>
                        {lendingHist.map((e, i) => (
                            minimize ?
                                <LendingResSmall e={e} key={i} nav={nav} /> :
                                <LendingResLarge e={e} key={i} nav={nav} showReviewButton={true} />
                        ))}
                    </div>}
            </div>
        )
    } else return <Loading />

}

export default LendingHistory