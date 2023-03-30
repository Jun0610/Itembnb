import React, { useEffect, useState } from 'react'
import '../styles/statusItem.css'
import Loading from './Loading';
import UserService from '../tools/userService';
import { useNavigate } from 'react-router-dom';

const StatusItem = ({ statusObject, curUser }) => {
    const [owner, setOwner] = useState(null)
    const [borrower, setBorrower] = useState(null)
    const nav = useNavigate();

    let startDate = '';
    let endDate = '';
    console.log("test");
    console.log("item: ", statusObject.item)
    if (statusObject.item && statusObject.item.unavailList) {
        for (const unavail of statusObject.item.unavailList) {
            if (statusObject.reservation._id === unavail.reservId) {
                startDate = new Date(unavail.startDate).toDateString().split(" ")
                endDate = new Date(unavail.endDate).toDateString().split(" ")
            }
        }
    }

    if (startDate === '') {
        if (statusObject.item && statusObject.item.pendingList) {
            for (const pending of statusObject.item.pendingList) {
                if (statusObject.reservation._id === pending.reservId) {
                    startDate = new Date(pending.startDate).toDateString().split(" ")
                    endDate = new Date(pending.endDate).toDateString().split(" ")
                }
            }
        }
    }


    //to get owner data
    useEffect(() => {
        UserService.getUserData(statusObject.reservation.borrowerId).then((success) => {
            setBorrower(success.data)
        })
        if (statusObject.item) {    
            UserService.getUserData(statusObject.item.ownerId).then((success) => {
                setOwner(success.data)
            })
        }
        console.log("test");
    }, [])

    const handleClickItem = () => {
        if (curUser._id === statusObject.item.ownerId) {
            nav(`/display-item-post/${statusObject.item._id}`)
        } else {
            nav(`/selected-item-post/${statusObject.item._id}`)
        }

    }

    const handleClickUser = () => {
        if (curUser._id === statusObject.item.ownerId) {
            nav(`/user/${borrower._id}`)
        } else {
            nav(`/user/${owner._id}`)
        }

    }



    if (owner === null || borrower === null) {
        return <Loading />
    } else {
        console.log(borrower);
        return (
            <div className='status-item-container'>
                <div className='status-item-img-container'>
                    <img src={statusObject.item.images[0] ? statusObject.item.images[0] : "../resources/logo-no-background.png"} alt="" className='status-item-img' onClick={handleClickItem} />
                </div>

                <div className='status-item-details-container'>
                    <h3 className='status-item-name' onClick={handleClickItem}>{statusObject.item.name}</h3>
                    <div className='status-item-more-info'>
                        <div className='status-item-date' onClick={handleClickItem}>
                            <span>{startDate[0]} {startDate[1]} {startDate[2]} &ndash; <br />{endDate[0]} {endDate[1]} {endDate[2]} <br /></span>
                            <span style={{ fontWeight: "600" }}>{endDate[3]}</span>
                        </div>
                        <div className='status-item-owner-container' onClick={handleClickUser}>
                            <span className='status-item-owner-name'>{curUser._id === statusObject.item.ownerId ? `Borrower: ${borrower.name}` : `Owner: ${owner.name}`}</span>
                            <img src={curUser._id === statusObject.item.ownerId ? borrower.profilePic : owner.profilePic} alt="" className='status-item-owner-img' />
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default StatusItem