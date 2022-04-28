module.exports = (ctx, argv, next) => {
  // 登录验证
  // const token = socket.handshake.auth.token;
  if (argv[0] === 'message' && !ctx.socket.data.login && argv[1].type !== 'login') {
    return next(new Error("NEED_LOGIN"));
  }
  next();
}