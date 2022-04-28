module.exports = (ctx, uid, msg) => {
  ctx.socket.to(uid).emit('2Msg', msg);
}