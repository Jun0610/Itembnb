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

    static async turnOnNotifications(userId) {
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        }
        try {
            const res = await fetch(`${url}/turn-on-notifications/${userId}`, request);
            const response = await res.json();
            response.status = res.status
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async turnOffNotifications(userId) {
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        }
        try {
            const res = await fetch(`${url}/turn-off-notifications/${userId}`, request);
            const response = await res.json();
            response.status = res.status
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async getNotificationStatus(userId) {
        console.log("getting user data");
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/get-notification-status/${userId}`, request);
            const response = await res.json();
            response.status = res.status
            return response
        } catch (err) {
            console.log(err);
        }
    }

    static async addNotification(userId, message) {
        console.log(`userId: ${userId}, message: ${message}`)
        const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        }
        try {
            const res = await fetch(`${url}/add-notification/${userId}`, request);
            const response = await res.json();
            response.status = res.status
            console.log(response);
            return response
        } catch (err) {
            console.log(err);
        }
    }

    // getting minimalist user data (just name, profile pic, description)
    static async getUserDataMin(userId) {
        console.log("getting user data");
        const request = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            const res = await fetch(`${url}/user-data-min/${userId}`, request);
            const response = await res.json();
            response.status = res.status

            if (response.data.profileDesc && response.data.profileDesc.length > 15) {
                response.data.profileDesc = response.data.profileDesc.slice(0, 12) + "...";
            }

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