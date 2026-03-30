"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.getIO = getIO;
exports.initSocket = initSocket;
var socket_io_1 = require("socket.io");
exports.config = {
    api: {
        bodyParser: false,
    },
};
var io = null;
function getIO() {
    return io;
}
function initSocket(server) {
    if (io) {
        return io;
    }
    io = new socket_io_1.Server(server, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', function (socket) {
        console.log('Client connected:', socket.id);
        // Join user-specific room for private messages
        socket.on('join-user', function (userId) {
            socket.join("user:".concat(userId));
            console.log("User ".concat(userId, " joined their room"));
        });
        // Join conversation room
        socket.on('join-conversation', function (conversationId) {
            socket.join("conversation:".concat(conversationId));
            console.log("Joined conversation: ".concat(conversationId));
        });
        // Leave conversation room
        socket.on('leave-conversation', function (conversationId) {
            socket.leave("conversation:".concat(conversationId));
            console.log("Left conversation: ".concat(conversationId));
        });
        // Handle typing status
        socket.on('typing', function (_a) {
            var conversationId = _a.conversationId, userId = _a.userId;
            socket.to("conversation:".concat(conversationId)).emit('user-typing', { userId: userId });
        });
        socket.on('stop-typing', function (_a) {
            var conversationId = _a.conversationId, userId = _a.userId;
            socket.to("conversation:".concat(conversationId)).emit('user-stop-typing', { userId: userId });
        });
        // Handle message seen
        socket.on('message-seen', function (_a) {
            var conversationId = _a.conversationId, messageId = _a.messageId;
            socket.to("conversation:".concat(conversationId)).emit('message-seen', { messageId: messageId });
        });
        socket.on('disconnect', function () {
            console.log('Client disconnected:', socket.id);
        });
    });
    return io;
}
