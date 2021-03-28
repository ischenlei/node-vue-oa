module.exports = app => {
  const router = require('express').Router()
  const mongoose = require('mongoose')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const Article = require('../../models/Article') //相对路径引用方式
  const Category = require('../../models/Category') //相对路径引用方式
  const Swiper = require('../../models/Swiper') //相对路径引用方式
  const User = require('../../models/User')
  // const Article = mongoose.model('Article')
  // const Category = mongoose.model('Category')  //报错，未找到解决方案

  //倒入文章数据，仅测试使用
  // router.get('/news/init', async (req, res) => {
  //   const parent = await Category.findOne({
  //     name: '新闻分类'
  //   })
  //   const cats = await Category.find().where({
  //     parent: parent
  //   }).lean()   //取纯粹的js对象
  //   const newsTitles = ["春和景明柳垂莺娇，峡谷好礼随春报到", "3月16日全服不停机更新公告", "3月13日体验服不停机更新公告", "3月12日体验服停机更新公告", "3月12日体验服停机更新公告", "王者荣耀合作第十四届全国运动会组委会新闻宣传部、陕西广电融媒体集团推广全民全运！", "虎牙直播大腿杯S4梦幻选秀震撼来袭！！！", "大神云集！虎牙孤影杯总决赛即将开始", "继飞天、九色鹿后，第三款王者荣耀敦煌文化皮肤要来啦！", "王者全国大赛「樱花主题海选赛」周六武汉启动，现场攻略请查收！"]
  //   const newsList = newsTitles.map(title => {
  //     const randomCats = cats.slice(0).sort((a,b) => Math.random() - 0.5)
  //     return {
  //       categories: randomCats.slice(0, 2),
  //       title: title
  //     }
  //   })
  //   await Article.deleteMany({})
  //   await Article.insertMany(newsList)
  //   res.send(newsList)
  // })

  //登陆校验中间件
  const authMiddleware = require('../../middleware/auth')

  //登陆
  app.post('/web/api/login', async (req, res) => {
    const { username, password } = req.body
    console.log(req.body)
    //1.根据用户名找用户
    const user = await User.findOne({
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
    await User.update({
      token: token
    })
    const info = await User.findOne({
      username: username,
    })
    res.send({token, info})
  })

  //获取用户信息
  app.post('/web/api/user', async (req, res) => {
    let {id} = req.body
    const data = await User.findOne({
      _id: id
    })
    res.send(data)
  })

  //获取新闻资讯
  router.get('/news/list', authMiddleware('user'), async (req, res) => {
    // const parent = await Category.findOne({
    //   name: '新闻分类'
    // }).populate({
    //   path: 'children',
    //   populate: {
    //     path: 'newsList'
    //   }
    // }).lean()
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    const cats = await Category.aggregate([
      {$match: {parent: parent._id}},
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'categories',
          as: 'newsList'
        }
      },
      {
        $addFields: {
            newsList: {$slice: ['$newsList', 5]}
        }
      }
    ])
    const subCats = cats.map(v => v._id)
    cats.unshift({
      name: '热门',
      newsList: await Article.find().where({
        categories: {$in: subCats}
      }).populate('categories').limit(5).lean()
    })

    cats.map(cat => {
      cat.newsList.map( news => {
        news.cateGoryName = cat.name === '热门'
          ? news.categories.name : cat.name
        return news
      })
      return cat
    })

    res.send(cats)
  })

  //获取文章详情
  router.get('/articles/:id', authMiddleware('user'), async (req, res) => {
    const data = await Article.findById(req.params.id).lean()
    res.send(data)
  })

  //获取swiper
  router.get('/swiper/list', authMiddleware('user'), async (req, res) => {
    const data = await Swiper.findOne().where({
      name: 'swiper'
    })
    res.send(data.items)
  })

  //获取所有置顶文章
  app.get('/web/api/articles/top', authMiddleware('user'), async (req, res) => {
    const data = await Article.find().where({
      isTop: true
    }).populate('categories')
    res.send(data)
  })

  //获取所有收藏文章
  app.get('/web/api/articles/likes', async (req, res) => {
    const user = await User.findOne()
    let data = []
    console.log(user)
    for (let like of user.likes) {
      let item = await Article.findOne({
        _id: like
      }).populate('categories')
      data.push(item)
    }
    res.send(data)
  })

  // 增加阅读量
  app.post('/web/api/read', async (req, res) => {
    let {id} = req.body
    await Article.updateOne(
      {_id: id},
      {$inc: {read: +1}}
    )
  })

  //收藏
  app.post('/web/api/like', async (req, res) => {
    let {username, likes} = req.body
    await User.updateOne(
      {username: username},
      {likes: likes}
    )
  })

  app.use('/web/api', router)

  //错误处理
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode).send({
      message: err.message
    })
  })
}