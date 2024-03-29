import React, { useEffect, useState } from 'react';
import ReservationService from '../tools/reservationService';
import { confirmAlert } from 'react-confirm-alert';
import { socket } from '../tools/socketService';
import SocketService from '../tools/socketService';
import userContext from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import EmailService from '../tools/emailService';

const BorrowingRequestList = ({ endDates, brList, item, onChangeResvList, onChangeSelectedUser, selectedUser }) => {
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
                                SocketService.emit('emitMsg', { type: 'toBorrower', name: authUser.user.user.name, recipient: borrower.email, msg: "approved", itemId: item._id });
                                socket.on('emitBackL', async (response) => {
                                    console.log(response);
                                    if (response !== 'success') {
                                        await EmailService.sendEmailRedirection(authUser, borrower, `${authUser.user.user.name} has approved your borrowing request!`, `http://localhost:3000/item-status/${borrower._id}`).then(() => {
                                        });
                                    }
                                    window.location.reload(false);
                                });
                                onChangeResvList(brList.filter(e => e._id !== resv._id));
                                alert("Successfully approved!");
                            })
                        } else {
                            // there are conflicts; must ask for second confirmation
                            if (window.confirm(`There are conflicts with these other requests:- ${result}. Accepting this request means the other reservations will be denied. Do you want to proceed?`)) {
                                // accepting current confirmation; must deny all others on the conflictId array
                                for (const conflictResv of conflictResvs) {

                                    await ReservationService.denyRequest(conflictResv._id, conflictResv.startDate, conflictResv.endDate, item._id).then(() => {
                                        // handle email notification or live notification here
                                        SocketService.emit('emitMsg', { type: 'toBorrower', name: authUser.user.user.name, recipient: conflictResv.borrower.email, msg: "denied" });
                                        socket.on('emitBackL', async (response) => {
                                            if (response === 'success') {
                                                await EmailService.sendEmailNoRedirection(authUser, borrower, `${authUser.user.user.name} has denied your borrowing request!`);
                                            }
                                        });
                                    })
                                }

                                await ReservationService.approveRequest(resv._id, resv.startDate, resv.endDate, item._id).then(() => {

                                    // handle email notification or live notification here
                                    SocketService.emit('emitMsg', { type: 'toBorrower', name: authUser.user.user.name, recipient: borrower.email, msg: "approved", itemId: item._id });
                                    socket.on('emitBackL', async (response) => {
                                        if (response !== 'success') {
                                            await EmailService.sendEmailRedirection(authUser, borrower, `${authUser.user.user.name} has approved your borrowing request!`, `http://localhost:3000/item-status/${borrower._id}`).then(() => {
                                                alert("Okay!")

                                            });
                                        }
                                        window.location.reload(false);
                                    });
                                })

                                onChangeResvList(brList.filter(e => !conflictIds.includes(e._id) || e._id !== resv._id))


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
                            SocketService.emit('emitMsg', { type: 'toBorrower', name: authUser.user.user.name, recipient: borrower.email, msg: "denied" });
                            socket.on('emitBackL', async (response) => {
                                if (response !== 'success') {
                                    await EmailService.sendEmailNoRedirection(authUser, borrower, `${authUser.user.user.name} has denied your borrowing request!`).then(() => {

                                    });
                                }
                                window.location.reload(false);
                            });
                        })
                        onChangeResvList(brList.filter(e => e._id !== resv._id));
                        alert("Successfully denied!");

                    },
                }
            ],
        });
    }

    const highlightUser = (i) => {
        onChangeSelectedUser(i);
    }

    const removeHighlightUser = () => {
        onChangeSelectedUser(null);
    }

    return (
        <div>
            <div className='font-bold text-4xl m-3'>Borrowing Request List</div>
            {brList.length === 0 ?
                <div className='m-3 text-xl font-semibold'>
                    You currently have no pending borrowing request for this item to view.
                </div> :
                <div className="m-3 h-48 overflow-auto grid grid-rows-auto rounded-lg" style={{ backgroundColor: "#F7D65A" }}>
                    {brList.map((e, i) => (
                        <div key={i + 1} onMouseEnter={() => highlightUser(i + 1)} onMouseLeave={removeHighlightUser} className='rounded-lg m-2 p-3' style={selectedUser && (i + 1) === selectedUser ? { backgroundColor: "#f1f5f9" } : { backgroundColor: "white" }}>
                            <div onClick={() => handleRequestClick(e, e.borrower)} style={{ cursor: "pointer" }} className='bg-white rounded-lg p-2 font-bold text-lg'>Request {i + 1}</div>
                            <div className="flex">
                                <div className='h-auto w-2/6 object-center'>
                                    <div className="flex gap-0 m-1">
                                        <div className="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                                            Start date
                                        </div>
                                        <div className="bg-white/25 rounded-r-lg content-center p-1">
                                            {e.startDate.substring(0, 10)}
                                        </div>
                                    </div>
                                    <div className="flex gap-0 m-1">
                                        <div className="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                                            End date
                                        </div>
                                        <div className="bg-white/25 rounded-r-lg content-center p-1">
                                            {endDates[i]}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex gap-0 m-1">
                                        <div className="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                                            Borrower
                                        </div>
                                        <div className="bg-white/25 rounded-r-lg content-center p-1">
                                            {e.borrower.name}
                                        </div>
                                    </div>
                                    <div className="flex gap-0 m-1">
                                        <div className="rounded-l-lg content-center p-1 font-semibold text-white" style={{ backgroundColor: "#F7D65A" }}>
                                            Borrower email
                                        </div>
                                        <div className="bg-white/25 rounded-r-lg content-center p-1">
                                            {e.borrower.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-64"></div>
                                <div className='justify-end mt-2'>
                                    <img onClick={() => handleUserRedirect(e.borrower._id)} className="flex-none object-scale-down h-24" style={{ borderRadius: "50%", width: "auto", cursor: "pointer" }} src={e.borrower.profilePic && e.borrower.profilePic !== "" ? e.borrower.profilePic : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"} alt="" />
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