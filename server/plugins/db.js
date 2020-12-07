module.exports = app => {
  const mongoose = require('mongoose')

  mongoose.connect('mongdb://172.0.0.1:27017/node-vue-moba', {
    useNewUrlParser: true
  })
}
