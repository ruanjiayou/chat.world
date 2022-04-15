const path = require('path');
const dotenv = require('dotenv');
const devENV = dotenv.config({
  override: false,
}).parsed;
const prodENV = process.env;
const isProd = process.env.NODE_ENV === 'prod';

const ROOT_PATH = path.join(__dirname, '../../');

module.exports = {
  // 项目文件夹路径
  ROOT_PATH,
  PORT: isProd ? prodENV.PORT : devENV.PORT,
  REDIS_URL: isProd ? prodENV.REDIS_URL : devENV.REDIS_URL,
  REDIS_PASS: isProd ? prodENV.REDIS_PASS : devENV.REDIS_PASS,
}