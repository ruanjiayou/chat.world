
const { createClient } = require('redis');

createClient({
  url: 'redis://localhost:6379',
  password: 'phoenixtv2017'
}).connect().then(() => {
  console.log('connected')
}).catch(err => {
  console.log(err)
})