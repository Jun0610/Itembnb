import React from 'react'

const BorrowingRequestList = ({brList}) => {
  console.log("brlist: ", brList);
  return (
    <div>
      <div>BorrowingRequestList</div>
      <div class="h-48 overflow-auto grid grid-rows-auto">
      {brList.map((e, i) => (
        <div key={i} className="grid grid-cols-2 bg-red-300 m-3">
          <div className='col-start-1'>
            <div>Start date: {e.start_date}</div>
            <div>End date: {e.end_date}</div>
            <div>Borrower: {e.borrower.name}</div>
            <div>Borrower email: {e.borrower.email}</div>
          </div>
          <img style={{borderRadius: "50%", height: "70%", width: "auto"}} src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" alt=""/>
        </div>))}
      </div>
    </div>
  )
}

export default BorrowingRequestList