const url = "http://localhost:8888/api/user";

class UserService {
    static async favoritingItem(itemId, userId) {
        console.log("favoriting an item");
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId: itemId })
        }
        try {
            const res = await fetch(`${url}/${userId}/favorite-item`, request);
            const response = await res.json();
            response.status = res.status
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async unfavoritingItem(itemId, userId) {
        console.log("unfavoriting an item");
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId: itemId })
        }
        try {
            const res = await fetch(`${url}/${userId}/unfavorite-item`, request);
            const response = await res.json();
            response.status = res.status
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
        }

    }

    static async getUserData(userId) {
        console.log("getting user data");
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/profile-data/${userId}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteUser(id) {
        return new Promise((resolve, reject) => {
            fetch(`${url}/delete-user/${id}`, {
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

    static async editProfile(newUserInfo, id) {
        console.log("edit a profile " + id);

        return new Promise((resolve, reject) => {
            fetch(`${url}/edit-profile/${id}`, {
                method: 'put',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newUserInfo),
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
}

export default UserService;