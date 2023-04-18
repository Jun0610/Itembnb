import React, { useEffect, useState } from 'react'
import Browsing from '../components/Browsing'
import Post from '../components/post';
import { useParams } from 'react-router-dom'
import ItemService from '../tools/itemsService';
import Loading from '../components/Loading';
import '../styles/categoryPage.css'

const CategoryPage = () => {
    const { category } = useParams();
    const [items, setItems] = useState();
    const [loading, setLoadiing] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoadiing(true)
            let response = [];
            switch (category) {
                case 'academic':
                    console.log("DSJHAUDHSAIUDHI");
                    response = await ItemService.getItemByCategory('ACADEMICS')
                    break;
                case 'household':
                    response = await ItemService.getItemByCategory('HOUSEHOLD')
                    break;
                case 'outdoor':
                    response = await ItemService.getItemByCategory('OUTDOOR')
                    break;
                case 'entertainment':
                    response = await ItemService.getItemByCategory('ENTERTAINMENT')
                    break;
                case 'electronic':
                    response = await ItemService.getItemByCategory('ELECTRONIC')
                    break;
                case 'misc':
                    response = await ItemService.getItemByCategory('MISC')
                    break;
                default:
            }
            console.log(response);
            setItems(response)
            setLoadiing(false)
        }

        load();
    }, [category])

    if (loading) {
        return <>
            <Browsing category={category} />
            <Loading />
        </>
    } else if (items.length !== 0) {
        return (
            <div>
                <Browsing category={category} />

                <div className='category-results-container'>
                    {
                        items.map((item) => (
                            <Post key={item._id} post={item} isRequest={false} />
                        ))
                    }
                </div>
            </div>
        )
    } else {
        return (
            <>
                <Browsing category={category} />
                <div className='category-results-container' style={{ fontSize: "20px" }}>
                    No items match that category!
                </div>
            </>
        )
    }


}

export default CategoryPage