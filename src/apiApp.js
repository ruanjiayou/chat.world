const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config/config');
const wsCreate = require('./wsApp');

// 创建https如下:
// const { readFileSync } = require('fs');
// const { createServer } = require('https');
// const httpServer = createServer({
//   key: readFileSync('/path/to/key.pem'),
//   cert: readFileSync('/path/to/cert.pem'),
// });
// 必须要这一步
const httpServer = require("http").Server(app);
// ws服务绑定到http服务
const ws = wsCreate(httpServer);

// websocketUI必须放public下
app.use(express.static(config.ROOT_PATH + '/public'));
app.use(bodyParser.json({ limit: '3mb' }));

app.post('/admin/command', async (req, res) => {
  const sockets = await ws.of('/admin').fetchSockets()
  console.log(sockets.length, req.body);
  ws.of('/').emit('message', req.body);
  res.json({ code: 0 });
})

httpServer.listen(config.PORT, function () {
  console.log(`server listening ${config.PORT}, ${process.env.NODE_ENV}`);
});