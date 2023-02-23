class ItemService {
    static async getAllCategories() {
        return new Promise((resolve, reject) => {
            fetch("http://localhost:8888/api/item/categories").then(res => res.json()).then(
                (result) => {
                    console.log(result);
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