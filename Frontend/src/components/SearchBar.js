import React from 'react'
import "../styles/searchBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
const SearchBar = () => {
    return (
        <div className='search-bar-container'>
            <input type="text" placeholder='Search here' className='search-bar' />
            <button className='search-button'>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div >
    )
}

export default SearchBar