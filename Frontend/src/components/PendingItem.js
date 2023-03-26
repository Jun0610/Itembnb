import React from 'react'
import StatusItem from './StatusItem'
import '../styles/pendingItem.css'

const PendingItem = ({ curUser, statusObject }) => {
    return (
        <div className='pending-item-container'>
            <StatusItem curUser={curUser} statusObject={statusObject} />
            <div>
                HII
            </div>
        </div>
    )
}

export default PendingItem