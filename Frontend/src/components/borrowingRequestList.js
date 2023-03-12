import React from 'react';
import ReservationService from '../tools/reservationService';

const BorrowingRequestList = ({brList, item}) => {

  const [selectedUser, setSelectedUser] = React.useState(null);

  const handleUserRedirect = () => {
    alert("Bring user to another page");
  }

  const handleRequestClick = (borrowerId) => {
    confirmAlert({
      title: 'Approve/Deny Borrowing Request',
      message: "Do you want to approve or deny this borrowing request?",
      buttons: [
          {
              label: 'Approve',
              onClick: async () => { 
                await ReservationService.approveRequest(item.itemId, borrowerId).then(() => alert("Successfully approved!")); 
                // handle email notification or live notification here
              }

          },
          {
              label: 'Deny',
              onClick: async () => {
                 await ReservationService.denyRequest(item.itemId, borrowerId).then(() => alert("Successfully denied!"));
                 // handle email notification or live notification here
            },
          }
      ],
  });
  }

  const highlightUser = (i) => {
    setSelectedUser(i);
  }

  const removeHighlightUser = () => {
    setSelectedUser(null);
  }

  return (
    <div>
      <div className='font-bold text-4xl m-3'>Borrowing Request List</div>
      <div class="h-48 overflow-auto grid grid-rows-auto">
      {brList.map((e, i) => (
        <div key={i+1} onMouseEnter={() => highlightUser(i+1)} onMouseLeave={removeHighlightUser} className={selectedUser && (i+1) == selectedUser ? 'bg-lime-300 m-3 p-3' : 'bg-red-300 m-3 p-3'}>
          <div onClick={() => handleRequestClick(e.borrower.id)} style={{cursor: "pointer"}} className='font-semibold text-lg'>Request {i+1}</div>
          <div className="flex">
            <div className='h-auto w-5/6 object-center'>
              <div>Start date: {e.start_date}</div>
              <div>End date: {e.end_date}</div>
              <div>Borrower: {e.borrower.name}</div>
              <div>Borrower email: {e.borrower.email}</div>
            </div>
            <div className='object-center mt-2'>
              <img onClick={handleUserRedirect}  className="flex-none object-scale-down h-20" style={{borderRadius: "50%",  width: "auto", cursor: "pointer"}} src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" alt=""/>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default BorrowingRequestList