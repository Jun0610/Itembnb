const url = "http://localhost:8888/api/request";

class RequestService {
    static async postRequest(request, id) {
        console.log(request);

        // new Date() gets converted to string-formatted Date through JSON.stringify
        request.dateCreated = new Date();

        return new Promise((resolve, reject) => {
            fetch(`${url}/add-request/user-id/${id}`, {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(request),
            }).then(res => res.json()).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async getRequest(id) {
        return new Promise((resolve, reject) => {
            fetch(`${url}/get-request-post/${id}`).then(res => res.json()).then((res) => {
                console.log("response", res);
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async editRequest(request, userId) {
        console.log("edit an request", request);
        return new Promise((resolve, reject) => {
            fetch(`${url}/edit-request/request-id/${request._id}/user-id/${userId}`, {
                method: 'put',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(request),
            }).then(res => res.json()).then(
                (result) => {
                    console.log("edit res", result);
                    resolve(result);
                }
            ).catch((err) => {
                reject(err);
            })
        })
    }

    static async addRecommendedItems(request, itemsToAdd) {
        // Remove already recommended items to avoid dupes
        itemsToAdd = itemsToAdd.filter(x => !request.recommendedItems.includes(x));

        return Promise.all(itemsToAdd.map(async itemId => {
            return new Promise((resolve, reject) => {
                fetch(`${url}/add-recommended-item/request/${request._id}`, {
                    method: 'put',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ "itemId": itemId }),
                }).then(res => res.json()).then(
                    (result) => {
                        console.log("add 1 item", result);
                        resolve(result);
                    }
                ).catch((err) => {
                    reject(err);
                });
            });
        }));
    }

    static async deleteRecommendedItems(request, itemsToRemove) {
        // Remove already non-recommended items to avoid dupes
        itemsToRemove = itemsToRemove.filter(x => request.recommendedItems.includes(x));

        return Promise.all(itemsToRemove.map(async itemId => {
            return new Promise((resolve, reject) => {
                fetch(`${url}/remove-recommended-item/request/${request._id}`, {
                    method: 'put',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ "itemId": itemId }),
                }).then(res => res.json()).then(
                    (result) => {
                        console.log("remove 1 item", result);
                        resolve(result);
                    }
                ).catch((err) => {
                    reject(err);
                });
            });
        }));
    }

    static async deleteRequest(request, userId) {
        console.log("delete an request", request, userId);
        return new Promise((resolve, reject) => {
            fetch(`${url}/delete-request/request-id/${request._id}/user-id/${userId}`, {
                method: 'delete',
                headers: { 'content-type': 'application/json' },
            }).then(res => res.json()).then(
                (result) => {
                    resolve(result);
                }
            ).catch((err) => {
                reject(err);
            })
        })
    }

    // Given array of request ids (requestList), returns an array of data jsons for each request in requestList
    static async getRequestsFromList(requestList) {
        return Promise.all(requestList.map(async id => {
            const request = await RequestService.getRequest(id);
            return request;
        }));
    }
}

export default RequestService;