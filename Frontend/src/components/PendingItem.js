import React, { useEffect, useState } from 'react'
import StatusItem from './StatusItem'
import '../styles/pendingItem.css'
import Loading from './Loading'
import UserService from '../tools/userService'

const PendingItem = ({ curUser, statusObject }) => {
    const [owner, setOwner] = useState(null)
    useEffect(() => {
        UserService.getUserData(statusObject.item.ownerId).then((res) => { setOwner(res.data) })
    }, [])


    if (owner !== null) {
        return (
            <div className='pending-item-container'>
                <StatusItem curUser={curUser} statusObject={statusObject} />
                <div className='pending-item-bot-container'>
                    <div className='pending-item-bot-details'>
                        Awaiting {owner.name}'s approval
                    </div>
                    <div className='pending-item-bot-features'>
                        More features for future sprints
                    </div>
                </div>
            </div>
        )
    } else {
        return <Loading></Loading>
    }

}

export default PendingItem