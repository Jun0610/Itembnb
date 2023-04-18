import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import '../styles/filterPopUp.css'
import ItemService from '../tools/itemsService';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const FilterPopUp = ({ items, setItems, setArrayContents, filterState, setFilterState, setOrigItems }) => {
    const { searchString } = useParams();
    const [loading, setLoading] = useState(false);
    const [fromPrice, setFromPrice] = useState(JSON.stringify(filterState.fromPrice))
    const [toPrice, setToPrice] = useState(JSON.stringify(filterState.toPrice))
    const [fromDate, setFromDate] = useState(JSON.stringify(filterState.fromDate))
    const [toDate, setToDate] = useState(JSON.stringify(filterState.toDate))
    const [rating, setRating] = useState(JSON.stringify(filterState.rating))


    window.onclick = (e) => {

        if (!e.target.matches("#filter-popup") && !e.target.matches("#filter-popup div") && !e.target.matches('#open-filter') && !e.target.matches('.popup-btn') && !e.target.matches('.filter-input')) {
            // const inputs = document.querySelectorAll(".filter-input")
            // inputs.forEach(input => input.value = "");
            closePopUp();
        }

        if (!e.target.matches(".sorting-dropdown") && !e.target.matches(".sorting-dropdown div") && !e.target.matches("#open-sorting")) {
            closeSorting();
        }

        const dropDown = document.querySelector(".drop-down-container")
        const notifBar = document.querySelector('.notification-bar')
        if (dropDown === null || notifBar === null) {
            return;
        }
        if (dropDown.classList.contains('open') && !e.target.matches('.nav-img')) {

            dropDown.classList.remove('open');
        }
        if (notifBar.classList.contains('open') && e.target.namespaceURI !== "http://www.w3.org/2000/svg") {

            notifBar.classList.remove('open');
        }
    }

    const closePopUp = () => {
        const popUp = document.getElementById('filter-container');
        if (popUp === null) {
            return
        }
        popUp.style.visibility = "hidden";
    }

    const closeSorting = () => {
        const sorting = document.querySelector('.sorting-dropdown')
        if (sorting === null) {
            return;
        }
        sorting.style.visibility = "hidden";
    }



    const handleSubmit = async () => {

        //filter by price range
        let fromPrice = 0
        let toPrice = Number.MAX_VALUE;

        if (document.getElementById('from-price').value !== '') {
            fromPrice = document.getElementById('from-price').value
        }

        if (document.getElementById('to-price').value !== '') {
            toPrice = document.getElementById('to-price').value
        }


        if (toPrice < fromPrice) {
            alert("Please enter a valid price range!")
            return;
        }

        //filter by rating
        let rating = 0;
        if (document.getElementById('rating').value !== '') {
            rating = document.getElementById('rating').value
        }

        if (rating < 0 || rating > 5) {
            alert("Please enter a rating between 0 and 5!");
            return;
        }

        //filter by unavailability date

        let fromDate;
        if (document.getElementById('from-date').value === '') {
            fromDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
        } else {
            fromDate = new Date(document.getElementById('from-date').value)
        }


        let toDate;
        if (document.getElementById('to-date').value === '') {
            toDate = new Date(fromDate.getTime() + 1000 * 60 * 60 * 24 * 93);
        } else {
            toDate = new Date(document.getElementById('to-date').value)
        }
        const docFromDate = document.getElementById('from-date').value;
        const docToDate = document.getElementById('to-date').value;
        if ((document.getElementById('from-date').value !== '' && document.getElementById('to-date').value === '')) {
            alert("Please enter a valid end date!");
            return;
        }
        if (document.getElementById('from-date').value === '' && document.getElementById('to-date').value !== '') {
            alert("Please enter a valid start date!");
            return;
        }

        if (fromDate <= new Date()) {
            alert("Items can only be booked at least one day in advance")
            return;
        }

        if (toDate < fromDate) {
            alert("Please enter a valid date range!");
            return;
        }

        //get days of week that are not available
        let copyFromDate = new Date(fromDate);
        const days = new Set()
        while (copyFromDate < toDate) {
            days.add(copyFromDate.getDay())
            copyFromDate.setDate(copyFromDate.getDate() + 1)

        }
        setFilterState({
            fromPrice: document.getElementById('from-price').value,
            toPrice: document.getElementById('to-price').value,
            rating: document.getElementById('rating').value,
            fromDate: document.getElementById('from-date').value,
            toDate: document.getElementById('to-date').value
        })
        console.log(filterState);

        setLoading(true)
        //first get unfiltered array from db
        const toSearch = searchString.split('+')[0]
        const unfiltered = await ItemService.serchItem(toSearch);

        //handle filtering dates first
        let filterDate = unfiltered;
        if (docFromDate !== '' && docToDate !== '') {
            filterDate = unfiltered.filter(item => {
                for (const unavailability of item.unavailList) {
                    if ((toDate < new Date(unavailability.startDate)) || (fromDate > new Date(unavailability.startDate))) {
                        if (unavailability.day) {
                            if (days.has(unavailability.day)) {
                                return false
                            }
                        }
                        return true;
                    }
                }
                return true;
            });
        }

        console.log(filterDate);

        //handle filtering the rest
        const filtered = filterDate.filter(item => {
            let check = Number(item.price) >= fromPrice && Number(item.price) <= toPrice;
            if (item.rating) {
                check = check & (Number(item.rating) >= rating);
            }
            return check
        });
        setItems(filtered);
        setOrigItems(filtered);
        setArrayContents('filtered')
        setLoading(false);

        closePopUp();


    }

    const handleClear = () => {
        setFromPrice('')
        setToPrice('')
        setFromDate('')
        setToDate('')
        setRating('')
        setFilterState({
            fromPrice,
            toPrice,
            rating,
            fromDate,
            toDate
        })
        console.log(filterState);
    }


    if (!loading) {
        return (
            <div id='filter-container'>
                <div id='filter-popup'>
                    <button className='close-filter-btn' onClick={closePopUp}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <div className='price-container'>
                        <div className='filter-label' id='price-range'>
                            Price Range
                        </div>
                        <input value={fromPrice} onChange={(e) => setFromPrice(e.target.value)} type="number" id='from-price' className='filter-input' placeholder='From Price $' />
                        <div style={{ justifySelf: "center", alignSelf: "center", fontSize: "2rem" }}>
                            &#8211;
                        </div>
                        <input value={toPrice} onChange={(e) => setToPrice(e.target.value)} type="number" className='filter-input' id='to-price' placeholder='To Price $' />

                    </div>

                    <div className='filter-label'>
                        Rating of at least
                    </div>
                    <input value={rating} onChange={(e) => setRating(e.target.value)} type="number" className='filter-input' id='rating' placeholder='Rating (0-5)' />

                    <div className='date-container'>
                        <div className='filter-label' id='avail-date'>
                            Available Dates
                        </div>
                        <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" id='from-date' className='filter-input' />
                        <div style={{ justifySelf: "center", alignSelf: "center", fontSize: "2rem" }}>
                            &#8211;
                        </div>
                        <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" id='to-date' className='filter-input' />

                    </div>

                    <button onClick={handleSubmit} className='popup-btn'>Submit</button>
                    <button onClick={handleClear} className='popup-btn'>Clear</button>
                </div>
            </div>
        )
    } else {
        return <Loading />
    }

}

export default FilterPopUp