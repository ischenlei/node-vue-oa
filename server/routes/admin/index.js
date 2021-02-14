module.exports = app => {  //这里的app是一个形参
  const express = require('express')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const AdminUser = require('../../models/AdminUser')
  const router = express.Router({
    mergeParams: true
  })
  // const Category = require('../../models/Category')
  //添加
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  //更新
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  //删除
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  //登陆校验中间件
  const authMiddleware = require('../../middleware/auth')

  //资源列表
  router.get('/', authMiddleware(), async (req, res) => {
      const queryOptions = {}
      if (req.Model.modelName === 'Category') {
        queryOptions.populate = 'parent'
      }

      const items = await req.Model.find().setOptions(queryOptions).limit(10)
      res.send(items)
    })
  //资源详情
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  //资源中间件
  const resMiddleware = require('../../middleware/resource')

  app.use('/admin/api/rest/:resource', authMiddleware(), resMiddleware(), router)

  //上传图片
  const multer = require('multer')
  const upload = multer({dest: __dirname + '/../../uploads'})
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  //登陆
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    //1.根据用户名找用户
    const user = await AdminUser.findOne({
      username: username
    }).select('+password')

    assert(user, 422, '用户不存在')
    // if (!user){
    //   return res.status(422).send({
    //     message: '用户不存在'
    //   })
    // }

    //2.校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码错误'
    //   })
    // }

    //3.返回token
    const token = jwt.sign({id: user._id}, app.get('secret'))
    res.send({token})

  })

  //错误处理
  app.use(async (err, req, res, next) => {
    console.log(err.statusCode)
    res.status(err.statusCode).send({
      message: err.message
    })
  })
}
