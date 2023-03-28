const url = "http://localhost:8888/api/reservation";


class ReservationService {
    static async getUserReservation(itemId, userId) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-user-reservation/user/${userId}/item/${itemId}`, request);
            const response = await res.json();
            response.status = res.status
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async getActiveBorrowerReservations(userId) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-active-reservation/borrower/${userId}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async getActiveLenderReservations(userId) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-active-reservation/lender/${userId}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async getReservation(reservId) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-reservation-by-id/${reservId}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }

    }

    static async itemReceived(reservId) {
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: reservId })
        }
        try {
            const res = await fetch(`${url}/item-received`, request);
            const response = await res.json();
            response.status = res.status
            if (response.status !== 201) {
                throw new Error(response.data)
            }
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async itemReturned(reservId) {
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: reservId })
        }
        try {
            const res = await fetch(`${url}/item-returned`, request);
            const response = await res.json();
            response.status = res.status
            if (response.status !== 201) {
                throw new Error(response.data)
            }
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async approveRequest(reservId, startDate, endDate, itemId) {
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: reservId, startDate: startDate, endDate: endDate, itemId: itemId })
        }
        try {
            const res = await fetch(`${url}/approve-reservation`, request);
            const response = await res.json();
            response.status = res.status
            if (response.status !== 201) {
                throw new Error(response.data)
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async denyRequest(reservId, startDate, endDate, itemId) {
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: reservId, startDate: startDate, endDate: endDate, itemId: itemId })
        }
        try {
            const res = await fetch(`${url}/deny-reservation`, request);
            const response = await res.json();
            response.status = res.status
            if (response.status !== 201) {
                throw new Error(response.data)
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getPendingReservations(itemId) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-pending-reservations/${itemId}`, request);
            const response = await res.json();
            response.status = res.status;
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async getPendingReservationsForUser(userId) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-pending-reservations-of-user/${userId}`, request);
            const response = await res.json();
            response.status = res.status;
            return response;
        } catch (err) {
            console.log(err);
        }
    }

}

export default ReservationService;