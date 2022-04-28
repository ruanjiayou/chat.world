function throttleFn(name, option = { maxItems: 30, maxMS: 200 }, cb) {
  if (!throttleFn.fns[name]) {
    const data = {
      option,
      items: [],
      timer: null,
    }
    throttleFn.fns[name] = (item) => {
      data.items.push(item);
      // 达到上限触发执行
      if (data.items.length >= option.maxItems) {
        clearTimeout(data.timer)
        data.timer = null;
        cb && cb(data.items);
        data.items = [];
      } else if (!data.timer) {
        // 达到时限触发执行
        data.timer = setTimeout(() => {
          clearTimeout(data.timer)
          data.timer = null;
          cb && cb(data.items);
          data.items = [];
        })
      }
    }
  }
  return throttleFn.fns[name];
}
throttleFn.fns = {};

// data: from,action,data,to
module.exports = async (io, socket, body) => {
  console.log(body)
  const { type, from, to, data } = body;
  // group/private
  if (type === 'message') {
    const fn = throttleFn(to, { maxItems: 30, maxMS: 200 }, (items) => {
      socket.to(to).emit('messages', items);
    });
    fn({ from: { username: socket.data.username, uid: socket.id }, type: 'message', data })
    // socket.to(to).emit('message', { from: { username: socket.data.username, uid: socket.id }, type: 'message', data });
  } else if (type === 'login') {
    if (data.username.startsWith('test')) {
      socket.data.username = data.username;
      socket.data.login = true;
      socket.emit('message', { type: 'alert', content: 'login success' });
    } else {
      socket.emit('message', { type: 'alert', content: 'login fail' });
    }
  }
}