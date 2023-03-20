import React from 'react'
import '../styles/loading.css'

export const Loading = () => {
    return (
        <div className='img-container'>
            <img src={require('../resources/itembnb-website-favicon-color.png')} className='loading' alt='' />
        </div>

    )
}

export const LoadingSmall = () => {
    return (
        <div className='img-container-small'>
            <img src={require('../resources/itembnb-website-favicon-color.png')} className='loading' alt='' />
        </div>

    )
}

export default Loading;