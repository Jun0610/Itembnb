import React from 'react';
import ReservationService from '../tools/reservationService';
import { confirmAlert } from 'react-confirm-alert';
import { socket } from '../tools/socketService';
import SocketService from '../tools/socketService';
import emailjs from '@emailjs/browser';
import userContext from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';

const service_id = 'service_44uw7yq';
const template_id = 'template_88gvtrr';
const public_key = 'GOFeOE5aTFGzBv1A2';

const BorrowingRequestList = ({brList, item, onChangeResvList}) => {

  const [selectedUser, setSelectedUser] = React.useState(null);
  const authUser = React.useContext(userContext);
  const nav = useNavigate();

  const handleUserRedirect = (borrowerId) => {
    nav(`/user/${borrowerId}`);
  }

  const handleRequestClick = (resv, borrower) => {
    confirmAlert({
      title: 'Approve/Deny Borrowing Request',
      message: "Do you want to approve or deny this borrowing request?",
      buttons: [
          {
              label: 'Approve',
              onClick: async () => { 
                console.log("Approve!");
                // call backend api here
                await ReservationService.approveRequest(resv._id, resv.startDate, resv.endDate, item._id).then(() => {
                  // handle email notification or live notification here
                  SocketService.emit('emitBruh', {name: authUser.user.user.name, recipient: borrower.email, msg: "approved"});
                  socket.on('emitBack', (response) => {
                    if (response !== 'success') {
                      const body = {
                        to_name: borrower.name,
                        from_name: authUser.user.user.name,
                        reply_to: authUser.user.user.email,
                        message: `${authUser.user.user.name} has approved your borrowing request!`,
                        to_email: borrower.email,
                      }
                      emailjs.send(service_id, template_id, body, public_key).then((result) => {
                        console.log(result.text);
                      }, (error) => {
                          console.log(error.text);
                      });
                    }
                  });
                }).then(() => {
                  onChangeResvList(brList.filter(e => e._id != resv._id));
                  alert("Successfully approved!");
                });
              }

          },
          {
              label: 'Deny',
              onClick: async () => {
                 // call backend api here
                 await ReservationService.denyRequest(resv._id, resv.startDate, resv.endDate, item._id).then(() => {
                  // handle email notification or live notification here
                  SocketService.emit('emitBruh', {name: authUser.user.user.name, recipient: borrower.email, msg: "denied"});
                  socket.on('emitBack', (response) => {
                    if (response === 'success') {
                      console.log("Live notification success!")
                    } else {
                      const body = {
                        to_name: borrower.name,
                        from_name: authUser.user.user.name,
                        reply_to: authUser.user.user.email,
                        message: `${authUser.user.user.name} has denied your borrowing request!`,
                        to_email: borrower.email,
                      }
                      emailjs.send(service_id, template_id, body, public_key).then((result) => {
                        console.log(result.text);
                      }, (error) => {
                          console.log(error.text);
                      });
                    }
                  });
                }).then(() => {
                  onChangeResvList(brList.filter(e => e._id != resv._id));
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
      <div className='font-bold text-4xl m-3'>Borrowing Request List</div>
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
    </div>
  )
}

export default BorrowingRequestList