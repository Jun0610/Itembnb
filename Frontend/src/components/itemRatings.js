import React from 'react'
import {useNavigate} from "react-router-dom";

const ItemRatings = ({itemReviews, onDeleteReview, onInputChange, editOwnerReview, authUser, editReviewIdx, rating, review, filterStar, resetFilter}) => {
    const nav = useNavigate();

    const stars = [1, 2, 3, 4, 5]

    const searchStar = (i) => {
        filterStar(i)
    }

  return (
    <div>
        <div className="font-bold">
            Reviews
        </div>
        <div className='flex gap-4'>
            {stars.map((e, i) => (<div onClick={() => searchStar(e)} style={{cursor: "pointer"}}>{e}-star</div>))}
            <div onClick={resetFilter} style={{cursor: "pointer"}}>Reset</div>
        </div>
        <div className="m-3 h-48 overflow-auto grid grid-rows-auto rounded-lg">
            {itemReviews.map((e, i) => (
                <div key={i} className="grid border-2 rounded-3xl border-yellow-400 m-2 p-2">
                    <div className="grid grid-cols-3 justify-start">
                        <div>
                            <img onClick={() => {nav(`/user/${e.user._id}`)}} src={e.user.profilePic} alt="" className="object-scale-down h-16" style={{ cursor: "pointer" }}/>
                        </div>
                        <div className="grid grid-rows-2 ml-2">    
                            <div>   
                                {e.user.name}
                            </div>
                            <div>   
                                {new Date(e.review.dateModified).toDateString()}
                            </div>
                        </div>
                        {
                            e.user._id === authUser.user.user._id && editReviewIdx === i ? 
                            <div>
                                <input id="rating" className="mt-1 border border-slate-300 py-2 rounded-md" type="number" min="1" max="5" value={rating} onChange={onInputChange} />
                            </div>
                            : 
                            <div className="justify-self-end">   
                                    {e.review.rating}/5
                            </div>
                        }
                    </div>
                    {
                        e.user._id === authUser.user.user._id && editReviewIdx === i ? 
                        <div>
                            <input id="review" className="mt-1 block border border-slate-300 w-full py-2 rounded-md" type="text" value={review} onChange={onInputChange} />
                        </div>
                        : 
                        <div className="mt-3"> 
                            {e.review.reviewTxt}
                        </div>
                    }
                    {e.user._id === authUser.user.user._id ? 
                    <div className="flex justify-end gap-4">
                        <i className="fa-solid fa-trash mt-1 icon-3x" style={{ cursor: "pointer" }} onClick={() => {onDeleteReview(i)}}></i>
                        <i className={editReviewIdx && editReviewIdx === i ? "place-self-end fa-solid fa-save mt-1 icon-3x" : "place-self-end fa-solid fa-pencil mt-1 icon-3x"} style={{ cursor: "pointer" }} onClick={() => editOwnerReview(i)}></i>
                    </div>
                        : <div></div>}
                </div>))}
        </div>
    </div>
  )
}

export default ItemRatings