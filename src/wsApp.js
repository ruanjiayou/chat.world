
const { Server } = require("socket.io");
const { instrument, RedisStore } = require("@socket.io/admin-ui");
const { createClient } = require('redis');
const config = require('./config/config');

module.exports = function (httpServer) {

  const redisClient = createClient({
    url: config.REDIS_URL,
    // username: '',
    password: config.REDIS_PASS,
  });

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3322"],
      allowedHeaders: ["X-ws-authorization"],
      credentials: true
    }
  });

  // 管理后台设置
  instrument(io, {
    // auth: false
    auth: {
      type: 'basic',
      username: 'admin',
      password: '$2b$10$hWXiRqTqhV1M5.sJvviITeRp8gIJRjajWyu79jh6XNDnmjcqwFKD6'
    },
    // readonly: true,
    // 一台机器上有多个ws服务器的话要指定进程id
    // serverId: `${require("os").hostname()}#${process.pid}`,
    // session持久化
    // store: new RedisStore(redisClient),
  });

  // 默认空间
  io.of('/').on('connection', function (socket) {
    console.log(`ws: ${socket.id} connected!`);
    const room = socket.handshake.query.room;
    // socket.rooms
    // 字段设计: name,type,room?,signin,
    // socket.data.username = 'test';
    if (room) {
      socket.join(room);
      // socket.to(room).emit('system', { from: 'system', message: '?加入放假' });
    }
    // 中间件使用
    // 未登录不能发消息
    socket.use((argv, next) => {
      // console.log(socket, argv, 'use');
      // 登录验证
      // const token = socket.handshake.auth.token;
      if (argv[0] === 'message' && !socket.data.login) {
        return next(new Error("NEED_LOGIN"));
      }
      next();
    });
    // 登录
    socket.on('login', async (data) => {
      console.log(data, 'login');
      if (data.user === 'test' && data.pass === '123456') {
        socket.data.login = true;
        socket.data.username = 'guest001';
        socket.emit('loginCB', { code: 0 })
        const sockets = await io.in(room).fetchSockets();
        socket.to(room).emit('system', { from: 'system', message: socket.data.username + ' 加入房间', total: sockets.length });
        socket.emit('system', { from: 'system', message: socket.data.username + ' 加入房间' });
      } else {
        socket.emit('loginCB', { code: -1 })
      }
    })
    socket.on("error", (err) => {
      console.log(err.message);
    });

    // 点对点通信
    socket.on("private message", (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit("private message", socket.id, msg);
    });

    socket.on('message', function (msg) {
      socket.broadcast.emit('message', { from: 'user', message: msg, })
    });

    socket.on("disconnecting", (reason) => {
      // for (const room of socket.rooms) {
      //   if (room !== socket.id) {
      //     socket.to(room).emit("user has left", socket.id);
      //   }
      // }
      if (socket.handshake.query.room) {
        socket.leave(socket.handshake.query.room);
      }
    });
    socket.on('disconnect', function () {
      console.log('socket disconnect');
    })
  });

  // io.of(/^\/dynamic-\d+$/)

  // 管理用户空间
  io.of('/admin').on('connection', socket => {

  })
  return io;
}