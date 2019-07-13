/*
 * @Author: lyq 
 * @Date: 2019-07-11 16:45:23 
 * @Last Modified by: lyq
 * @Last Modified time: 2019-07-13 08:53:20
 */

const express = require('express');
const querystring = require('querystring');

//创建路由对象
const router = new express.Router();

//首页
router.get('/', (req, res)=>{
    let userinfo = req.session.userinfo;
    res.render('index',{
        flag: 'index',
        username: userinfo ? userinfo.username : ''
    })
})

//注册
router.get('/regiester', (req, res)=>{
    res.render('regiester',{
        flag: 'reg'
    });
})

//登录
router.get('/login', (req, res)=>{
    res.render('login',{
        flag: 'login'
    });
})

//用户列表
router.get('/userlist', (req, res)=>{
    let userinfo = req.session.userinfo;
    let size = Number(req.query.size || 10);
    let page = Number(req.query.page || 1);
    const User = require('../model/User');

    //查询所有用户
    User.countDocuments().then((count) => {
        // 计算分页的页数
        let num = Math.ceil(count / size);

        // 查询对应页面的数据
        User.find().skip((page-1)*size).limit(size).then(data=>{
            // 展示页面
            res.render('userlist', {num, data, size, page, isShow: true, flag: 'user',  username: userinfo ? userinfo.username : '',});
        })
    }).catch((err) => {
        console.log(err);
    });
})

//向外输出路由对象
module.exports = router;