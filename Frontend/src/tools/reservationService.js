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

    static async approveRequest(itemId, borrowerId) {
        return new Promise((resolve, reject) => {
            fetch(`${url}/approve-reservation/item/${itemId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            }).then(res => res.json()).then((res) => {
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async denyRequest(itemId, borrowerId) {
        return new Promise((resolve, reject) => {
            fetch(`${url}/deny-reservation/item/${itemId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            }).then(res => res.json()).then((res) => {
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async getAllReservationRequest(itemId) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-all-reservations/${itemId}`, request);
            const response = await res.json();
            response.status = res.status
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
        }
    }

}

export default ReservationService;