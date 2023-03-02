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

    static async deleteRequest(request, userId) {
        console.log("delete an request");
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

}

export default RequestService;