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
}

export default ReviewService;