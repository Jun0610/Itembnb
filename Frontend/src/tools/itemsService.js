const url = "http://localhost:8888/api/item";

class ItemService {
    static async postItem(item, userId) {
        console.log(item);
        return new Promise((resolve, reject) => {
            fetch(`${url}/add-item/user-id/${userId}`, {
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

    // static async getItem(id) {
    //     return new Promise((resolve, reject) => {
    //         fetch(`${url}/get-item-post/${id}`, {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //         }).then(res => res.json()).then((res) => {
    //             const data = res.data[0];
    //             console.log(data);
    //             resolve(data);
    //         }).catch((err) => {
    //             reject(err);
    //         })
    //     })
    // }

    static async getItem(itemId) {
        return new Promise((resolve, reject) => {
            fetch(`${url}/get-item-post/${itemId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json()).then((res) => {
                // const data = res.data;
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        })
    }


    static async getItemE() {
        return new Promise((resolve, reject) => {
            fetch(`${url}/get-item-posts-1`).then(res => res.json()).then((res) => {
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async getAllCategories() {
        return new Promise((resolve, reject) => {
            fetch(`${url}/categories`).then(res => res.json()).then(
                (result) => {
                    resolve(result);
                }
            ).catch((err) => {
                reject(err);
            });
        });
    }

    static async editItem(item, user) {
        console.log("edit an item");
        return new Promise((resolve, reject) => {
            fetch(`${url}/edit-item/item-id/${item.id}/user-id/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            }).then(res => res.json()).then(
                (result) => {
                    resolve(result);
                }
            ).catch((err) => {
                reject(err);
            })
        })
    }

    static async deleteItem(item, user) {
        console.log("delete an item");
        return new Promise((resolve, reject) => {
            fetch(`${url}/delete-item/item-id/${item.id}/user-id/${user.id}`, {
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

export default ItemService;