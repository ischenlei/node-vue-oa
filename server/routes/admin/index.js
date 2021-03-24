module.exports = app => {  //这里的app是一个形参
  const express = require('express')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const AdminUser = require('../../models/AdminUser')
  const Article = require('../../models/Article')
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
      if (req.Model.modelName === 'Article') {
        queryOptions.populate = 'categories'
      }

      const items = await req.Model.find().setOptions(queryOptions).limit(100)
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

    //3.返回token和用户信息
    const token = jwt.sign({id: user._id}, app.get('secret'))
    await AdminUser.update({
      token: token
    })
    const info = await AdminUser.findOne({
      username: username,
    })
    res.send({token, info})
  })


  //模糊查询文章
  app.post('/admin/api/search/article', async (req, res) => {
    const {name} = req.body
    let reg = new RegExp(name);
    console.log(reg)
    let item = await Article.find().where({
      title : {$regex : reg}
    });
    res.send(item)
  })

  //查询文章类型
  app.post('/admin/api/search/type', async (req, res) => {
    const {type} = req.body
    let item = await Article.find({
      categories: type
    }).populate('categories');
    res.send(item)
  })

  //置顶
  app.post('/admin/api/setTop', async (req, res) => {
    const {id} = req.body
    let item = await Article.findById(id)
    let isTop = item.isTop
    await Article.findByIdAndUpdate(id, {
      isTop: !isTop
    })
    let data = await Article.find().limit(100)
    res.send(data)
  })

  //获取管理员信息
  app.post('/admin/api/user', async (req, res) => {
    let {id} = req.body
    const data = await AdminUser.findOne({
      _id: id
    })
    res.send(data)
  })

  //收藏
  app.post('/admin/api/like', async (req, res) => {
    let {id, username} = req.body
    let exist = await AdminUser.findOne({likes: id})
    // console.log(exist)
    if (exist) {   //如果已经收藏，那么删除
      await AdminUser.updateOne(
        {username: username},
        {$pull: { likes: id }}
      )
    } else {    //如果没有收藏，那么添加
      await AdminUser.updateOne(
        {username: username},
        {$addToSet: { likes: id }}
      )
    }
    let data = await AdminUser.findOne({username: username})
    res.send(data.likes)
  })

  //取消收藏
  // app.post('/admin/api/unlike', async (req, res) => {
  //   let {id, username} = req.body
  //
  //   let data = await AdminUser.findOne({username: username})
  //   res.send(data.likes)
  // })

  //错误处理
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode).send({
      message: err.message
    })
  })
}
