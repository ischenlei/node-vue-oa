const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {type: String},
    categories: {type: mongoose.SchemaTypes.ObjectId, ref: 'Category'},
    body: {type: String},
    isTop: {type: Boolean, default: false},
    read: {type: Number, default: 0}
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Article', schema)
