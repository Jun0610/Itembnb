import React from 'react';
import { NavLink } from "react-router-dom";

// expected: e contains full info of item, lender, and reservation objects
export const BorrowingResSmall = ({ e, key, nav }) => {
    return (
        <div key={key} className='m-3 p-3 border-b-2 border-b-yellow-600 flex gap-4 justify-between'>
            <div style={{ cursor: "pointer" }} onClick={() => { nav(`/selected-item-post/${e.item._id}`) }}>
                {e.item.name}
            </div>
            <div style={{ cursor: "pointer" }} onClick={() => { nav(`/user/${e.lender._id}`) }}>
                {e.lender.name}
            </div>
            <div>
                From {new Date(e.reservation.startDate).toDateString()} to {new Date(e.reservation.endDate).toDateString()}
            </div>
        </div>
    );
}

// expected: e contains full info of item, lender, and reservation objects
export const BorrowingResLarge = ({ e, key, nav, showReviewButton = false }) => {
    return (
        <div key={key} className='m-3 p-3 border-2 rounded-3xl border-yellow-400'>
            <div className='grid grid-cols-3'>
                <div>
                    <img onClick={() => { nav(`/selected-item-post/${e.item._id}`) }} src={e.item.images[0]} style={{ cursor: "pointer" }} alt="pretty" className='h-24 object-scale-down' />
                    <div class="flex gap-0 m-1">
                        <div class="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                            Item Name
                        </div>
                        <div class="bg-white/25 rounded-r-lg content-center p-1">
                            {e.item.name}
                        </div>
                    </div>
                </div>
                <div>
                    <img onClick={() => { nav(`/user/${e.lender._id}`) }} src={e.lender.profilePic} style={{ cursor: "pointer" }} alt="pretty" className='h-24 object-scale-down' />
                    <div class="flex gap-0 m-1">
                        <div class="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                            Lender Name
                        </div>
                        <div class="bg-white/25 rounded-r-lg content-center p-1">
                            {e.lender.name}
                        </div>
                    </div>
                </div>
                <div>
                    <span style={{ "font-weight": "bold", "color": "#f7a62a" }}>Borrowed</span>
                    <div class="flex gap-0 m-1">
                        <div class="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                            From
                        </div>
                        <div class="bg-white/25 rounded-r-lg content-center p-1">
                            {new Date(e.reservation.startDate).toDateString()}
                        </div>
                    </div>
                    <div class="flex gap-0 mt-2 m-1">
                        <div class="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                            To
                        </div>
                        <div class="bg-white/25 rounded-r-lg content-center p-1">
                            {new Date(e.reservation.endDate).toDateString()}
                        </div>
                    </div>

                    {showReviewButton &&
                        <NavLink to={`/create-item-review/` + e.reservation._id} style={{ "text-decoration": "inherit" }}><button className="defaultButton">Review this Item</button></NavLink>
                    }
                </div>
            </div>
        </div>
    );
}

// expected: e contains full info of item, borrower, and reservation objects
export const LendingResSmall = ({ e, key, nav }) => {
    return (
        <div key={key} className='m-3 p-3 border-b-2 border-b-yellow-600 flex gap-4 justify-between'>
            <div style={{ cursor: "pointer" }} onClick={() => nav(`/user/${e.borrower._id}`)}>
                {e.borrower.name}
            </div>
            <div>
                {e.item.name}
            </div>
            <div>
                From {new Date(e.reservation.startDate).toDateString()} to {new Date(e.reservation.endDate).toDateString()}
            </div>
        </div>
    );
}

// expected: e contains full info of item, borrower, and reservation objects
export const LendingResLarge = ({ e, key, nav, showReviewButton = false }) => {
    console.log(e);

    return (
        <div key={key} className='m-3 p-3 border-2 border-yellow-400 rounded-3xl'>
            <div className='grid grid-cols-3'>
                <img src={e.borrower.profilePic} alt="" style={{ cursor: "pointer" }} className="owner-img h-32" onClick={() => nav(`/user/${e.borrower._id}`)} />
                <div>
                    <div class="flex gap-0 m-1">
                        <div class="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                            Name
                        </div>
                        <div class="bg-white/25 rounded-r-lg content-center p-1">
                            {e.borrower.name}
                        </div>
                    </div>
                    <div class="flex gap-0 m-1">
                        <div class="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                            Borrowed
                        </div>
                        <div class="bg-white/25 rounded-r-lg content-center p-1">
                            {e.item.name}
                        </div>
                    </div>
                </div>
                <div>
                    <div class="flex gap-0 m-1">
                        <div class="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                            From
                        </div>
                        <div class="bg-white/25 rounded-r-lg content-center p-1">
                            {new Date(e.reservation.startDate).toDateString()}
                        </div>
                    </div>
                    <div class="flex gap-0 m-1">
                        <div class="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                            To
                        </div>
                        <div class="bg-white/25 rounded-r-lg content-center p-1">
                            {new Date(e.reservation.endDate).toDateString()}
                        </div>
                    </div>

                    {showReviewButton &&
                        <NavLink to={`/create-user-review/` + e.reservation._id} style={{ "text-decoration": "inherit" }}><button className="defaultButton">Review this Borrower</button></NavLink>
                    }
                </div>
            </div>
        </div>
    );
}