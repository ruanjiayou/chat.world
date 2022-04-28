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

// websocketUI必须放public下
app.use(express.static(config.ROOT_PATH + '/public'));
app.use(bodyParser.json({ limit: '3mb' }));

app.post('/admin/command', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'count') {
    const total = (await app.ws.of('/chat').in(data.in).allSockets()).size;
    res.json({ code: 0, data: { total } })
  } else if (type === 'system') {
    app.ws.of('/chat').to(data.to).emit('message', data);
    res.json({ code: 0 });
  }

})

// ws服务绑定到http服务
wsCreate(httpServer).then(ws => {
  app.ws = ws;
  httpServer.listen(config.PORT, function () {
    console.log(`server listening ${config.PORT}, ${process.env.NODE_ENV}`);
  });
});
