const url = "http://localhost:8888/api/review";

class ReviewService {
    static async getReview(id) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-review/${id}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async getReviewsForItem(id) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-item-review/${id}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async getReviewsForUser(id) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-user-review/${id}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async getReviewsByUser(id) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-reviews-made-by-user/${id}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async postReview(review, reservationId) {
        console.log(review);

        // new Date() gets converted to string-formatted Date through JSON.stringify
        review.dateCreated = new Date();
        review.dateModified = new Date();

        return new Promise((resolve, reject) => {
            fetch(`${url}/add-review/reservation-id/${reservationId}`, {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(review),
            }).then(res => res.json()).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async updateReview(review) {
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        }
        try {
            const res = await fetch(`${url}/update-review/${review._id}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteReview(reviewId) {
        return new Promise((resolve, reject) => {
            fetch(`${url}/delete-review/review-id/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json()).then(
                (result) => {
                    resolve(result);
                }
            ).catch((err) => {
                reject(err);
            })
        })
    }
}

export default ReviewService;