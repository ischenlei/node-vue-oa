module.exports = app => {
  const router = require('express').Router()
  const mongoose = require('mongoose')
  const Article = require('../../models/Article') //相对路径引用方式
  const Category = require('../../models/Category') //相对路径引用方式
  const Ad = require('../../models/Ad') //相对路径引用方式
  // const Article = mongoose.model('Article')
  // const Category = mongoose.model('Category')  //报错，未找到解决方案

  //倒入文章数据，仅测试使用
  router.get('/news/init', async (req, res) => {
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    const cats = await Category.find().where({
      parent: parent
    }).lean()   //取纯粹的js对象
    const newsTitles = ["春和景明柳垂莺娇，峡谷好礼随春报到", "3月16日全服不停机更新公告", "3月13日体验服不停机更新公告", "3月12日体验服停机更新公告", "3月12日体验服停机更新公告", "王者荣耀合作第十四届全国运动会组委会新闻宣传部、陕西广电融媒体集团推广全民全运！", "虎牙直播大腿杯S4梦幻选秀震撼来袭！！！", "大神云集！虎牙孤影杯总决赛即将开始", "继飞天、九色鹿后，第三款王者荣耀敦煌文化皮肤要来啦！", "王者全国大赛「樱花主题海选赛」周六武汉启动，现场攻略请查收！"]
    const newsList = newsTitles.map(title => {
      const randomCats = cats.slice(0).sort((a,b) => Math.random() - 0.5)
      return {
        categories: randomCats.slice(0, 2),
        title: title
      }
    })
    await Article.deleteMany({})
    await Article.insertMany(newsList)
    res.send(newsList)
  })

  //获取新闻资讯
  router.get('/news/list', async (req, res) => {
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
          ? news.categories[0].name : cat.name
        return news
      })
      return cat
    })

    res.send(cats)
  })

  //获取文章详情
  router.get('/articles/:id', async (req, res) => {
    const data = await Article.findById(req.params.id).lean()
    res.send(data)
  })

  //获取swiper
  router.get('/swiper/list', async (req, res) => {
    const data = await Ad.findOne().where({
      name: 'swiper'
    })
    res.send(data.items)
  })

  app.use('/web/api', router)
}