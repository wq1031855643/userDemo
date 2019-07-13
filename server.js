/*
 * @Author: lyq 
 * @Date: 2019-07-11 16:25:57 
 * @Last Modified by: lyq
 * @Last Modified time: 2019-07-13 08:47:41
 */

const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const mainRouter = require('./routers/mainRouter');
const apiRouter = require('./routers/apiRouter');
const session = require('express-session');
// const Cookies = require('cookies');
const MongoDBStore  = require('connect-mongodb-session')(session);

//创建服务
const server = express();

var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/myproject',//连接数据库的路径
    collection: 'sessions'//session存放表格的名字
});
// Catch errors
store.on('error', function(error) {
    console.log(error);
});

//配置sesstion
server.use(session({
    secret:'keyboard cat', //加密字符串也可以写数组
    name: 'USER',       //cookie name
    resave: false,     //强制保存session 建议设置成false
    rolling: true, //动态刷新页面cookie存放时间
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 //保存时效 1 week
    }, 
    store: store
}))

// 使用模板引擎ejs  处理模板（html文件）
server.set('view engine', 'html');
server.engine('html', ejs.renderFile);
server.set('views', './view');

//处理静态资源
server.use('/static', express.static(__dirname + '/public'));

//处理页面跳转
server.use('/', mainRouter);

//处理http请求
server.use('/api', apiRouter);


//连接数据库
mongoose.connect('mongodb://localhost:27017/myproject', {
    useNewUrlParser: true
}, (error) => {
    !error && console.log('连接数据库成功');

    // mockData();
    
    //监听服务
    server.listen(8080, (error) => {    
        !error && console.log('启动成功');
    });
})

//mock.js往数据库生成模拟数据
function mockData(){
    const {mock} = require('mockjs');
    let data = mock({
        'arr|50' : [{
            'first': '@cfirst',
            'last': '@clast',
            username: '@first@last',
            password: '@string(6,10)'
        }]
    });
    const User = require('./model/User');
    data.arr.forEach(element => {
        new User({
            username: element.username,
            password: element.password
        }).save()
    });
}