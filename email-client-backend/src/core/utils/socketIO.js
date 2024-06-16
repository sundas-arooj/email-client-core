class SocketIO {
    constructor() {
        this.socket = null;
    }

    setIO(io) {
        this.socket = io;
    }

    getIO() {
        return this.socket;
    }
}

module.exports = new SocketIO();