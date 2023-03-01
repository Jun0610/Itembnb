const url = "http://localhost:8888/api/user";

export const favoritingItem = async (itemId, userId) => {
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

export const unfavoritingItem = async (itemId, userId) => {
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

export const getUserData = async (userId) => {
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


