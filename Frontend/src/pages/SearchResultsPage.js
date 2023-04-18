import React, { useEffect, useState } from 'react'
import ItemService from '../tools/itemsService'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import Post from '../components/post';
import '../styles/searchResultsPage.css'
import FilterPopUp from '../components/FilterPopUp';
import ReviewService from '../tools/reviewService';

const SearchResultsPage = () => {
    const [items, setItems] = useState([]);
    const [origItems, setOrigItems] = useState([])
    const [loading, setLoading] = useState(true);
    const [arrayContents, setArrayContents] = useState('none')
    const [sortingOrder, setSortingOrder] = useState('Default')
    const [filterState, setFilterState] = useState({ fromPrice: '', toPrice: '', rating: '', fromDate: '', toDate: '' })
    const [filterButtonState, setFilterButtonState] = useState('search-results-btn')
    const { searchString } = useParams();

    useEffect(() => {
        setLoading(true)
        setSortingOrder('Default')
        const search = async () => {
            const toSearch = searchString.split('+')[0]
            const itemResults = await ItemService.serchItem(toSearch)
            for (const item of itemResults) {
                const res = await ReviewService.getReviewByItem(item._id)
                const reviews = res.data;
                console.log("reviews", reviews);
                let sum = 0
                for (const review of reviews) {
                    sum += Number(review.review.rating)
                }
                let avg = sum / reviews.length
                item.rating = avg;
                console.log(item);
            }

            const copy = JSON.parse(JSON.stringify(itemResults))
            setOrigItems(copy)
            setItems(itemResults)
            setLoading(false)
        }
        search();

    }, [searchString])

    useEffect(() => {
        console.log(filterState);
        for (const key in filterState) {
            if (filterState[key] !== '') {
                setFilterButtonState('search-filter-on');
                return;
            }
            setFilterButtonState('search-results-btn')
        }
        console.log("TEST");
    }, [arrayContents, filterState])

    const openFilter = () => {
        const popUp = document.getElementById('filter-container');
        popUp.style.visibility = "visible";
    }

    const openSorting = () => {
        const sorting = document.querySelector('.sorting-dropdown')
        sorting.style.visibility = "visible";
    }


    const priceHighLow = () => {
        const sorted = items.sort((item1, item2) => {
            const price1 = Number(item1.price)
            const price2 = Number(item2.price)
            if (price1 < price2) {
                return 1;
            } else if (price1 > price2) {
                return -1;
            }
            return 0;
        })
        setItems(sorted);
        console.log(sorted);
        setArrayContents('SortedHighLow')
        setSortingOrder('Price: High to Low')
    }

    const priceLowHigh = () => {
        const sorted = items.sort((item1, item2) => {
            const price1 = Number(item1.price)
            const price2 = Number(item2.price)
            if (price1 < price2) {
                return -1;
            } else if (price1 > price2) {
                return 1;
            }
            return 0;
        })
        setItems(sorted);
        console.log(sorted);
        setArrayContents('SortedLowHigh')
        setSortingOrder('Price: Low to High')
    }

    const defaultOrder = () => {
        const copy = JSON.parse(JSON.stringify(origItems))
        setItems(copy);
        setArrayContents('SortedDefault')
        setSortingOrder('Default')
    }

    const latestListings = () => {
        const sorted = items.sort((item1, item2) => {
            if (!item1.dateCreated || !item2.dateCreated) {
                return 0;
            }
            const date1 = new Date(item1.dateCreated)
            const date2 = new Date(item2.dateCreated)
            if (date1 < date2) {
                return 1;
            } else if (date1 > date2) {
                return -1;
            }
            return 0;
        })
        setItems(sorted);
        console.log(sorted);
        setArrayContents('SortedLatest')
        setSortingOrder('Latest Listings')
    }

    const highlyRated = () => {
        setLoading(true)
        const sorted = items.sort((item1, item2) => {
            if ((item1.review && item1.review.length === 0) || (item2.review && item2.review.length === 0)) {
                return 0;
            }
            const rating1 = item1.rating
            const rating2 = item2.rating
            if (rating1 < rating2) {
                return 1;
            } else if (rating1 > rating2) {
                return -1;
            }
            return 0;
        })
        setItems(sorted);
        console.log(sorted);
        setArrayContents('SortedRating')
        setSortingOrder('Most Highly Rated')
        setLoading(false)
    }




    if (!loading) {
        if (items.length > 0) {
            return (
                <>
                    <FilterPopUp items={items} setItems={setItems} setArrayContents={setArrayContents} filterState={filterState} setFilterState={setFilterState} setOrigItems={setOrigItems} />
                    <div className='btn-container'>
                        <button className={filterButtonState} id='open-filter' onClick={openFilter}>Filter</button>
                        <button className='search-results-btn' id='open-sorting' onClick={openSorting}>Sort By: {sortingOrder}</button>
                        <div className='sorting-dropdown'>
                            <div className='sorting-dropdown-btn'>
                                <button onClick={defaultOrder} >Default</button>
                            </div>
                            <div className='sorting-dropdown-btn'>
                                <button onClick={priceHighLow}  >Price: High to Low</button>
                            </div>

                            <div className='sorting-dropdown-btn'>
                                <button onClick={priceLowHigh}  >Price: Low to High</button>
                            </div>

                            <div className='sorting-dropdown-btn'>
                                <button onClick={latestListings}  >Latest Listings</button>
                            </div>
                            <div className='sorting-dropdown-btn'>
                                <button onClick={highlyRated}  >Most Highly Rated</button>
                            </div>

                        </div>

                    </div>

                    <div className='search-results-container'>
                        {
                            items.map((item) => (
                                <Post key={item._id} post={item} isRequest={false} />
                            ))
                        }
                    </div>
                </>

            )
        } else {
            return (
                <>
                    <FilterPopUp items={items} setItems={setItems} setArrayContents={setArrayContents} />
                    <button className='search-results-btn' id='filter-btn' onClick={openFilter}>Filter</button>
                    <div className='sorting-dropdown'>
                        <button onClick={priceHighLow} className='search-results-btn'>Price High Low</button>
                        <button onClick={priceLowHigh} className='search-results-btn'>Price Low High</button>
                    </div>
                    <div className='search-results-container'>
                        No items match that search!
                    </div>
                </>

            )
        }

    } else {
        return <Loading />
    }

}

export default SearchResultsPage