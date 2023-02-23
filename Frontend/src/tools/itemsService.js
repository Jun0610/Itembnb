class ItemService {
    static async postItem(item) {
        console.log(item);
        return new Promise((resolve, reject) => {
            fetch("http://localhost:8888/api/item/add-item", {
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

    static async getItem() {
        return new Promise((resolve, reject) => {
            fetch("http://localhost:8888/api/item/get-item-posts-1").then(res => res.json()).then((res) => {
                const data = res.data[0];
                console.log(data);
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static async getAllCategories() {
        return new Promise((resolve, reject) => {
            fetch("http://localhost:8888/api/item/categories").then(res => res.json()).then(
                (result) => {
                    resolve(result);
                }
            ).catch((err) => {
                reject(err);
            });
        });
    }

    static createItemPost(item) {
        console.log("create item post");
        console.log(item);
    }

}

export default ItemService;