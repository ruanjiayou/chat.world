module.exports = (ctx, data) => {
  const { socket } = ctx;
  console.log(data, 'login');
  if (data.user === 'test' && data.pass === '123456') {
    socket.data.login = true;
    socket.data.username = 'guest001';
    socket.emit('loginCB', { code: 0 })
    socket.to(socket.data.room).emit('system', { from: 'system', message: socket.data.username + ' 加入房间', total: sockets.length });
    socket.emit('system', { from: 'system', message: socket.data.username + ' 加入房间' });
  } else {
    socket.emit('loginCB', { code: -1 })
  }
}