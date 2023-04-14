import React from 'react'
import "../styles/searchBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const SearchBar = ( ) => {

    const nav = useNavigate();

    const handleSearch = async () => {
        if (document.getElementById('search').value === '') {
            alert("Cannot have empty search string!")
            return;
        }

        const searchString = document.getElementById('search').value + '+' + Math.floor(Math.random() * (10000));
        nav(`/search-results/${searchString}`)

    }

    const handleClear = () => {
        document.getElementById('search').value = '';
        const clear = document.getElementById('clear-button');
        clear.style.visibility = 'hidden';
    }

    const onKeyDownHandler = (e) => {
        const clear = document.getElementById('clear-button');
        clear.style.visibility = 'visible';

        if (e.key == "Enter") {
            handleSearch();
        }
    }


    return (
        <div className='search-bar-container'>
            <input type="text" placeholder='Search here' className='search-bar' id='search' onKeyDown={onKeyDownHandler} />
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