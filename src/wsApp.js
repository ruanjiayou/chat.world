
const { Server } = require("socket.io");
const { instrument, RedisStore } = require("@socket.io/admin-ui");
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const config = require('./config/config');
const dispatch = require('./events/dispatch')
const middleware = require('./middleware');

module.exports = async function (httpServer) {

  const redisClient = createClient({
    url: config.REDIS_URL,
    // username: '',
    password: config.REDIS_PASS,
  });
  const subClient = redisClient.duplicate();

  const io = new Server(httpServer, {
    path: '/content',
    cors: {
      origin: ["http://localhost:3322"],
      allowedHeaders: ["X-ws-authorization"],
      credentials: true
    }
  });

  // 管理后台设置
  instrument(io, {
    namespaceName: '/manage',
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
  io.of('/chat').on('connection', function (socket) {
    console.log(`ws: ${socket.id} connected!`);
    const room = socket.handshake.query.room;
    // 字段设计: name,type,room?,signin,
    if (room) {
      socket.data.room = room;
      socket.join(room);
    } else {
      // socket.disconnect();
    }
    // 中间件.未登录不能发消息
    socket.use((argv, next) => {
      middleware({ io, socket }, argv, next);
    });

    socket.on('message', function (data) {
      dispatch(io, socket, data);
    });

    socket.on("error", (err) => {
      console.log(err.message);
    });

    socket.on('disconnect', function () {
      console.log('socket disconnect');
    })
  });
  await Promise.all([redisClient.connect(), subClient.connect()])
  io.adapter(createAdapter(redisClient, subClient));
  return io;
}