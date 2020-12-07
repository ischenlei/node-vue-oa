const express = require("express")

//创建网站服务器
const app = express()

app.use(require('cors')())
app.use(express.json())

require('./routes/admin')(app)  //app就是传入的实参. 这个app是express()方法创建的web服务器.
require('./plugins/db')(app)
/*等同于=
* var func = require('./app/routes.js');
* func(app);
* */

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
