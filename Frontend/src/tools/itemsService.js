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

    static async editItem(item, userid) {
        console.log("edit an item");
        return new Promise((resolve, reject) => {
            fetch(`${url}/edit-item/item-id/${item._id}/user-id/${userid}`, {
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

    static async deleteItem(item, userid) {
        console.log("delete an item");
        return new Promise((resolve, reject) => {
            fetch(`${url}/delete-item/item-id/${item._id}/user-id/${userid}`, {
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

    // Given array of item ids (itemList), returns an array of data jsons for each item in itemList
    static async getItemsFromList(itemList) {
        return Promise.all(itemList.map(async id => {
            const itemData = await ItemService.getItem(id);
            if (itemData !== undefined && itemData.success) {
                // if this doesn't work check if object is in itemData or itemData.data
                // console.log("item data: ", itemData.data);
                if (itemData && itemData.data) return itemData.data;
            }
            // return "Error!"; // should NOT HAPPEN - happens if return new Promise is not used in ItemService.getItem ?
        }));
    }

    static async serchItem(searchString) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/search/${searchString}`, request);
            const response = await res.json();
            response.status = res.status
            return response.data
        } catch (err) {
            console.log(err);
        }
    }

    static async getItemByCategory(category) {
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-item-by-category/${category}`, request);
            const response = await res.json();
            response.status = res.status
            return response.data
        } catch (err) {
            console.log(err);
        }
    }
}

export default ItemService;