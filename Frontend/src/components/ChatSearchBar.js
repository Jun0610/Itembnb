import React, {useState} from 'react'
import "../styles/searchBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const ChatSearchBar = ( {placeholderText, searchFunc} ) => {
    const [input, setInput] = useState('');

    const handleSearch = async () => {
        if (input === '') {
            alert("Cannot have empty search string!")
            return;
        }
        
        searchFunc(input);
    }

    const onKeyDownHandler = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }


    return (
        <div className='search-bar-container'>
            <input type="text" placeholder={placeholderText} className='search-bar' id='search' onKeyDown={onKeyDownHandler} onChange={(e) => setInput(e.target.value)}/>
            <button className='search-button' onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

        </div >
    )
}

export default ChatSearchBar