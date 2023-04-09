import React, { useEffect, useState } from 'react'
import ItemService from '../tools/itemsService'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import Post from '../components/post';

const SearchResultsPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchString } = useParams();

    useEffect(() => {
        const search = async () => {
            const itemResults = await ItemService.serchItem(searchString)
            setItems(itemResults)
            setLoading(false)
        }
        search();

    }, [searchString])


    if (!loading) {
        if (items.length > 0) {
            return (
                <>
                    {
                        items.map((item) => (
                            <Post key={item._id} post={item} isRequest={false} />
                        ))
                    }
                </>

            )
        } else {
            return (
                <div>
                    No items matched that search!
                </div>
            )
        }

    } else {
        return <Loading />
    }

}

export default SearchResultsPage