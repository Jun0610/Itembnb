const url = "http://localhost:8888/api/request";

class RequestService {
    static async postRequest(request) {
        console.log(request);

        // Date.now() gets converted to Unix timestamp (int?)
        // new Date() gets converted to string-formatted Date
        request.dateCreated = Date.now();

        return new Promise((resolve, reject) => {
            fetch(`${url}/add-request`, {
                method: 'post', 
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(request),
            }).then(res => res.json()).then((res) => {
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async getRequest(id) {
        return new Promise((resolve, reject) => {
            fetch(`/get-request-post/${id}`).then(res => res.json()).then((res) => {
                const data = res.data[0];
                console.log(data);
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }


    static async editRequest(request, user) {
        console.log("edit an request");
        return new Promise((resolve, reject) => {
            fetch(`${url}/edit-request/request-id/${request.id}/user-id/${user.id}`, {
                method: 'put', 
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(request),
            }).then(res => res.json()).then(
                (result) => {
                    resolve(result);
                }
            ).catch((err) => {
                reject(err);
            })
        })
    }

    static async deleteRequest(request, user) {
        console.log("delete an request");
        return new Promise((resolve, reject) => {
            fetch(`${url}/delete-request/request-id/${request.id}/user-id/${user.id}`, {
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