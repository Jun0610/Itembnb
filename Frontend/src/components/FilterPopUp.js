import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import '../styles/filterPopUp.css'
import ItemService from '../tools/itemsService';
import Loading from './Loading';

const FilterPopUp = ({ items, setItems, setArrayContents }) => {
    const { searchString } = useParams();
    const [loading, setLoading] = useState(false);
    window.onclick = (e) => {
        if (!e.target.matches("#filter-popup") && !e.target.matches('.open-filter') && !e.target.matches('.popup-btn')) {
            closePopUp();
        }
    }

    const closePopUp = () => {
        const popUp = document.getElementById('filter-container');
        if (popUp === null) {
            return
        }
        popUp.style.visibility = "hidden";
    }

    const filterSubmit = async () => {
        const toSearch = searchString.split('+')[0]
        const unfiltered = await ItemService.serchItem(toSearch);

        const filtered = unfiltered.filter(item => item.price > 13);
        setItems(filtered);
        setArrayContents('filtered')
        setLoading(false);
        closePopUp();
    }


    const submit = async () => {
        setLoading(true)
        await filterSubmit();
    }

    if (!loading) {
        return (
            <div id='filter-container'>
                <div id='filter-popup'>
                    <button onClick={submit} className='popup-btn'>Submit</button>
                </div>
            </div>
        )
    } else {
        return <Loading />
    }

}

export default FilterPopUp