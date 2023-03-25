import React from 'react';
import ReservationService from '../tools/reservationService';
import { confirmAlert } from 'react-confirm-alert';
import { socket } from '../tools/socketService';
import SocketService from '../tools/socketService';
import userContext from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import EmailService from '../tools/emailService';

const BorrowingRequestList = ({brList, item, onChangeResvList}) => {

  const [selectedUser, setSelectedUser] = React.useState(null);
  const authUser = React.useContext(userContext);
  const nav = useNavigate();

  const handleUserRedirect = (borrowerId) => {
    nav(`/user/${borrowerId}`);
  }

  const greaterAndEqualThan = (dateA, dateB) => {
    const a_yr = dateA.substring(0, 4);
    const a_mth = dateA.substring(5, 7);
    const a_day = dateA.substring(8, 10);
    const b_yr = dateB.substring(0, 4);
    const b_mth = dateB.substring(5, 7);
    const b_day = dateB.substring(8, 10);
    console.log(`(A) ${a_yr}, ${a_mth}, ${a_day}`);
    console.log(`(B) ${b_yr}, ${b_mth}, ${b_day}`);
    if (a_yr === b_yr) {
      if (a_mth === b_mth) {
        if (a_day === b_mth) return true
        else return a_day.localeCompare(b_day) === 1
      } else return a_mth.localeCompare(b_mth) === 1
    } else return a_yr.localeCompare(b_yr) === 1
  }

  const handleRequestClick = (resv, borrower) => {
    confirmAlert({
      title: 'Approve/Deny Borrowing Request',
      message: "Do you want to approve or deny this borrowing request?",
      buttons: [
          {
              label: 'Approve',
              onClick: async () => { 
                
                // check dates
                const current_start = resv.startDate.substring(0, 10);
                const current_end = resv.endDate.substring(0, 10);
                var result = "";
                const conflictResvs = [];
                const conflictIds = [];
                for (const e of brList) {
                  if (e._id !== resv._id) {
                    const e_start = e.startDate.substring(0, 10);
                    const e_end = e.endDate.substring(0, 10);
                    // conflict if this reserv's end date is between, or this reserv's start date is between
                    if ((greaterAndEqualThan(e_end, current_end) && greaterAndEqualThan(current_end, e_start)) || (greaterAndEqualThan(current_start, e_start) && greaterAndEqualThan(e_end, current_start)) || (greaterAndEqualThan(current_end, e_end) && greaterAndEqualThan(e_end, current_start)) || (greaterAndEqualThan(e_start, current_start) && greaterAndEqualThan(current_end, e_start))) {
                      // conflict
                      console.log("conflict")
                      result += `${e.borrower.name} | `;
                      conflictResvs.push(e);
                      conflictIds.push(e._id);
                    }
                  }
                }

                // must make sure there's no conflict in scheduling
                if (result.length === 0) {
                  // no conflicts
                  await ReservationService.approveRequest(resv._id, resv.startDate, resv.endDate, item._id).then(() => {
                  
                  // handle email notification or live notification here
                  SocketService.emit('emitMsg', {type: 'toBorrower', name: authUser.user.user.name, recipient: borrower.email, msg: "approved", itemId: item._id});
                  socket.on('emitBackL', (response) => {
                    if (response !== 'success') {
                      EmailService.sendEmail(authUser, borrower, `${authUser.user.user.name} has approved your borrowing request!`);
                    }
                  });
                }).then(() => {
                  onChangeResvList(brList.filter(e => e._id !== resv._id));
                  alert("Successfully approved!");
                });
                } else {
                  // there are conflicts; must ask for second confirmation
                  if (window.confirm(`There are conflicts with these other requests:- ${result}. Accepting this request means the other reservations will be deleted. Do you want to proceed?`)) {
                    // accepting current confirmation; must deny all others on the conflictId array
                    for (const conflictResv of conflictResvs) {

                      await ReservationService.denyRequest(conflictResv._id, conflictResv.startDate, conflictResv.endDate, item._id).then(() => {
                        // handle email notification or live notification here
                        SocketService.emit('emitMsg', {type: 'toBorrower', name: authUser.user.user.name, recipient: conflictResv.borrower.email, msg: "denied"});
                        socket.on('emitBackL', (response) => {
                          if (response === 'success') {
                            EmailService.sendEmail(authUser, borrower, `${authUser.user.user.name} has denied your borrowing request!`);
                          }
                        });
                      })
                    }

                    await ReservationService.approveRequest(resv._id, resv.startDate, resv.endDate, item._id).then(() => {
                  
                      // handle email notification or live notification here
                      SocketService.emit('emitMsg', {type: 'toBorrower', name: authUser.user.user.name, recipient: borrower.email, msg: "approved", itemId: item._id});
                      socket.on('emitBackL', (response) => {
                        if (response !== 'success') {
                          EmailService.sendEmail(authUser, borrower, `${authUser.user.user.name} has approved your borrowing request!`);
                        }
                      });
                    });

                    onChangeResvList(brList.filter(e => !conflictIds.includes(e._id) || e._id !== resv._id))
                    alert("Okay!")
                  }
                }
              }

          },
          {
              label: 'Deny',
              onClick: async () => {
                 // call backend api here
                 await ReservationService.denyRequest(resv._id, resv.startDate, resv.endDate, item._id).then(() => {
                  // handle email notification or live notification here
                  SocketService.emit('emitMsg', {type: 'toBorrower', name: authUser.user.user.name, recipient: borrower.email, msg: "denied"});
                  socket.on('emitBackL', (response) => {
                    if (response === 'success') {
                      EmailService.sendEmail(authUser, borrower, `${authUser.user.user.name} has denied your borrowing request!`);
                    }
                  });
                }).then(() => {
                  onChangeResvList(brList.filter(e => e._id !== resv._id));
                  alert("Successfully denied!");
              });
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
      <button onClick={onTest}>Testing</button>
      <div className='font-bold text-4xl m-3'>Borrowing Request List</div>
      {brList.length === 0 ? 
        <div className='m-3 text-xl font-semibold'>
        You currently have no pending borrowing request for this item to view.
        </div> : 
        <div className="h-48 overflow-auto grid grid-rows-auto">
        {brList.map((e, i) => (
          <div key={i+1} onMouseEnter={() => highlightUser(i+1)} onMouseLeave={removeHighlightUser} className={selectedUser && (i+1) === selectedUser ? 'bg-lime-300 m-3 p-3' : 'bg-red-300 m-3 p-3'}>
            <div onClick={() => handleRequestClick(e, e.borrower)} style={{cursor: "pointer"}} className='font-semibold text-lg'>Request {i+1}</div>
            <div className="flex">
              <div className='h-auto w-5/6 object-center'>
                <div>Start date: {e.startDate.substring(0, 10)}</div>
                <div>End date: {e.endDate.substring(0, 10)}</div>
                <div>Borrower: {e.borrower.name}</div>
                <div>Borrower email: {e.borrower.email}</div>
              </div>
              <div className='object-center mt-2'>
                <img onClick={() => handleUserRedirect(e.borrower._id)}  className="flex-none object-scale-down h-20" style={{borderRadius: "50%",  width: "auto", cursor: "pointer"}} src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" alt=""/>
              </div>
            </div>
          </div>
          ))}
        </div>
        }
    </div>
  )
}

export default BorrowingRequestList