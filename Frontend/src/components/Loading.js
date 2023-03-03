import React from 'react'
import '../styles/loading.css'
const Loading = () => {
    return (
        <div className='img-container'>
            <img src={require('../resources/itembnb-website-favicon-color.png')} className='loading' alt='' />
        </div>

    )
}

export default Loading