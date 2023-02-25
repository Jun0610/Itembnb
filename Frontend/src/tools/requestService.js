const url = "http://localhost:8888/api/request";

class requestService {
    static async postRequest(request) {
        console.log(request);
        return new promise((resolve, reject) => {
            fetch(`${url}/add-request`, {
                method: 'post', 
                headers: { 'content-type': 'application/json' },
                body: json.stringify(request),
            }).then(res => res.json()).then((res) => {
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async getRequest(id) {
        return new promise((resolve, reject) => {
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
        return new promise((resolve, reject) => {
            fetch(`${url}/edit-request/request-id/${request.id}/user-id/${user.id}`, {
                method: 'put', 
                headers: { 'content-type': 'application/json' },
                body: json.stringify(request),
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
        return new promise((resolve, reject) => {
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

export default requestService;