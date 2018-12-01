const express=require("express");
const pool=require("./pool.js");
const users=require("./routes/users.js");
//引入express-session模块，实现登录状态验证 ，这样使得cookie能携带session_id去服务器的session储存验证
const session = require('express-session');
const products =require('./routes/products.js');
const city =require("./routes/city.js");
const cart =require("./routes/cart");
//创建服务器
var app=express();
// app.all('*', function(req, res, next) {//跨域请求会导致页面html文件变成字符串
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

//post请求body-parser中间件
const bodyParser=require("body-parser");
//使用body-parser中间件
app.use(bodyParser.urlencoded({
    extended: false
}));
//应用session模块
app.use(session({
    secret: '128位随机字符串',
    resave: false,
    saveUninitialized: true,
}))
//侦听服务器
app.listen(3000,function(){
    console.log("侦听端口3000中");
});
//配置默认请求路径
//app.locals.resoucePath=["http://localhost:3000","*"];
//静态资源托管
app.use(express.static(__dirname+"/public"));
//挂载路由
app.use('/users',users);
app.use('/products',products);
app.use("/city",city);
app.use("/cart",cart)