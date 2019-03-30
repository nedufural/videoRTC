const io = require('socket.io')(process.env.PORT || 3000);

const arrUserInfo = [];

io.on('connection', socket => {
    socket.on('FIRST_TIMER', user => {
        const isExist = arrUserInfo.some(e => e.name === user.name);
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('REAL_SCENERIO');
        arrUserInfo.push(user);
        socket.emit('ONLINE_USERS_LIST', arrUserInfo);
        socket.broadcast.emit('NEW_USER', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
        io.emit('DISCONNECTED', socket.peerId);
    });
});