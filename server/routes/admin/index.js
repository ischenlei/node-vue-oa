module.exports = app => {  //这里的app是一个形参
  const express = require('express')
  const router = express.Router()
  const Category = require('../../models/Category')
  router.post('/categories', async (req, res) => {
    const model = await Category.create(req.body)
    res.send(model)
  })

  app.use('/admin/api', router)
}
