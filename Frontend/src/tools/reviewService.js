const url = "http://localhost:8888/api/review";

class ReviewService {
    static async getReviewByItem(id) {
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

    static async deleteReview(reviewId, itemId) {
        return new Promise((resolve, reject) => {
            fetch(`${url}/delete-review/review-id/${reviewId}/item-id/${itemId}`, {
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