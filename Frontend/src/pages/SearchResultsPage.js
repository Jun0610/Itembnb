import React, { useEffect, useState } from 'react'
import ItemService from '../tools/itemsService'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import Post from '../components/post';
import '../styles/searchResultsPage.css'
import FilterPopUp from '../components/FilterPopUp';

const SearchResultsPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [arrayContents, setArrayContents] = useState('none')
    const { searchString } = useParams();

    useEffect(() => {
        setLoading(true)
        const search = async () => {
            const toSearch = searchString.split('+')[0]
            const itemResults = await ItemService.serchItem(toSearch)
            setItems(itemResults)
            setLoading(false)
        }
        search();

    }, [searchString])

    useEffect(() => {
        console.log("test");
    }, [arrayContents])

    const openFilter = () => {
        const popUp = document.getElementById('filter-container');
        popUp.style.visibility = "visible";
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
    }



    if (!loading) {
        if (items.length > 0) {
            return (
                <>
                    <FilterPopUp items={items} setItems={setItems} setArrayContents={setArrayContents} />
                    <button className='open-filter' onClick={openFilter}>Filter</button>
                    <div className='sorting-dropdown'>
                        <button onClick={priceHighLow} className='popup-btn'>Price High Low</button>
                        <button onClick={priceLowHigh} className='popup-btn'>Price Low High</button>
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
                <div className='search-results-page-container'>
                    No items matched that search!
                </div>
            )
        }

    } else {
        return <Loading />
    }

}

export default SearchResultsPage