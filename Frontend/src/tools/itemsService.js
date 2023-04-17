const url = "http://localhost:8888/api/item";
const review_url = "http://localhost:8888/api/review";

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

    static async getItemRating(itemId) {
        return new Promise((resolve, reject) => {
            fetch(`${review_url}/get-item-rating/${itemId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json()).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // getting minimalist item data (just name, description, first pic, price)
    // also getting the item's average rating
    static async getItemMin(itemId) {
        let itemMinData = new Promise((resolve, reject) => {
            fetch(`${url}/get-item-post-min/${itemId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json()).then((res) => {
                // const data = res.data;
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });

        let itemRating = ItemService.getItemRating(itemId);

        return Promise.all([itemMinData, itemRating]).then(([itemResult, ratingResult]) => {
            itemResult.data.rating = ratingResult.rating;
            return itemResult;
        });
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

    // getting 'all' item posts from database (actually limited to 20)
    static async getItemPosts() {
        return new Promise((resolve, reject) => {
            fetch(`${url}/get-item-posts`, {
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

    // Given array of item ids (itemList), returns an array of data jsons for each item in itemList
    static async getItemsFromList(itemList) {
        return Promise.all(itemList.map(async id => {
            const itemData = await ItemService.getItemMin(id);
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
}

export default ItemService;