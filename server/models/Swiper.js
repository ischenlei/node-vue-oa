const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {type: String, default: 'swiper'},
  items: [{
    image: {type: String},
  }]
})

module.exports = mongoose.model('Swiper', schema)
