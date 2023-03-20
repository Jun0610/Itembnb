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

    static async getActiveReservations(userId) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-active-reservation/user/${userId}`, request);
            const response = await res.json();
            response.status = res.status
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
        }
    }

}

export default ReservationService