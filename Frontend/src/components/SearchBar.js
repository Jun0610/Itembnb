import React from 'react'
import "../styles/searchBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const SearchBar = () => {

    const nav = useNavigate();

    const handleSearch = async () => {
        if (document.getElementById('search').value === '') {
            alert("Cannot have empty search string!")
            return;
        }
        nav(`/search-results/${document.getElementById('search').value}`)
    }

    const handleClear = () => {
        document.getElementById('search').value = '';
        const clear = document.getElementById('clear-button');
        clear.style.visibility = 'hidden';
    }

    const showClear = () => {
        const clear = document.getElementById('clear-button');
        clear.style.visibility = 'visible';
    }


    return (
        <div className='search-bar-container'>
            <input type="text" placeholder='Search here' className='search-bar' id='search' onKeyDown={showClear} />
            <button className='search-clear-button' id='clear-button' onClick={handleClear}>
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <button className='search-button' onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

        </div >
    )
}

export default SearchBar