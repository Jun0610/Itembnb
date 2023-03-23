import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8888';

export const socket = io(URL, {autoConnect: false});

class SocketService {
    static connect() {
        socket.connect();
    }

    static disconnect() {
        socket.disconnect();
    }

    static emit(eventName, msg) {
        console.log(`event: ${eventName}, msg: ${msg}`);
        socket.emit(`${eventName}`, msg);
        console.log("msg sent!");
    }
}

export default SocketService;