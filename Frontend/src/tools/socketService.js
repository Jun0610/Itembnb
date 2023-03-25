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

    static emit(eventName, packet) {
        console.log(`event: ${eventName}, msg: ${packet}`);
        socket.emit(`${eventName}`, packet);
    }
}

export default SocketService;