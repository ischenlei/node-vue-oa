module.exports = options => {
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const AdminUser = require('../models/AdminUser')
  const User = require('../models/User')

  return async (req, res, next) => {
    const token = req.headers.authorization
    assert(token, 401, '请登录')

    const {id} = jwt.verify(token, req.app.get('secret'))
    assert(id, 401, '请登录')

    if (options === 'user') {
      req.user = await User.findById(id)
      assert(req.user, 401, '登陆')
    } else {
      req.user = await AdminUser.findById(id)
      assert(req.user, 401, '请登陆')
    }

    await next()
  }
}