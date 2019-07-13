/*
 * @Author: lyq 
 * @Date: 2019-07-11 16:51:42 
 * @Last Modified by: lyq
 * @Last Modified time: 2019-07-13 09:58:59
 */
const express = require('express');
const bodyParser = require('body-parser');
const User = require('../model/User');

//创建路由对象
const router = new express.Router();

//初始化bodyParser
router.use(bodyParser());

//注册api
router.post('/regiester', (req, res)=>{
    //解构赋值取出客户端传过来的值
    let {username, password} = req.body;

    //查询该用户是否存在
    User.findOne({username})
    .then((result) => {
        if (result) {
            //用户存在
            res.json({message: '用户名已存在,请重新输入',code: -1})
        }else{
            //用户名不存在
            new User({username , password}).save().then((result) => {
                //注册成功
                res.json({message: '注册成功',code: 0})
            }).catch((err) => {
                console.log(err);
                res.json({message:'未知错误,请联系管理员', code: -2})
            });
        }
    }).catch((err) => {
        console.log(err);
        res.json({message:'未知错误,请联系管理员', code: -2})
    });
})

//登录api
router.post('/login', (req, res)=>{
    //解构赋值取出客户端传过来的值
    let {username, password} = req.body;

    //校验用户名密码
    User.findOne({username,password})
    .then((result) => {
        if (result) {
            //验证账号密码通过
            //设置session保存用户登录信息
            req.session.userinfo = result;
            res.json({message: '登录成功',code: 0});
        }else{
            //未通过
            res.json({message: '用户名或密码错误',code: -1})
        }
    }).catch((err) => {
        console.log(err);
        res.json({message:'未知错误,请联系管理员', code: -2})
    });
})

//用户列表api
// router.get('/userlist', (req, res)=>{
//     //查询用户列表
//     User.find().then((result) => {
//         res.json(result);
//     }).catch((err) => {
//         res.json({message:'未知错误,请联系管理员', code: -2})
//     });
// })

//退出登录api
router.get('/exit', (req, res)=>{
    //清除session
    req.session.destroy();
    res.render('login',{
        flag: 'login'
    });
})

//修改密码api
router.post('/userlist/update', (req, res)=>{
    //解构赋值取出客户端传过来的值
    let {username, oldPwd, newPwd} = req.body;

    User.findOne({username: username}).then((result) => {
        //校验旧密码
        if (result.password == oldPwd) {
            User.updateOne({username: username},{password: newPwd}).then((result) => {
                res.json({message: '修改成功',code: 0})
            }).catch((err) => {
                res.json({message: '修改失败',code: -1})
            });
        }else {
            res.json({message: '旧密码不正确',code: -1})
        }
    }).catch((err) => {
        console.log(err);
        res.json({message:'未知错误,请联系管理员', code: -2})
    });
})

//删除用户api
router.post('/userlist/del', (req, res)=>{
    //解构赋值取出客户端传过来的值
    let {username} = req.body;
    User.deleteOne({username: username}).then((rusult)=>{
        res.json({message: '删除成功',code: 0});
    }).catch((err)=>{
        console.log(err)
        res.json({message:'未知错误,请联系管理员', code: -2})
    })
})

//搜索api
router.post('/seach', (req, res)=>{
    //解构赋值取出客户端传过来的值
    let {keyword} = req.body;
    if (keyword == '' || keyword == undefined) {
        User.countDocuments().then((count) => {
            let size = 10;
            let page = 1;
            // 计算分页的页数
            let num = Math.ceil(count / size);
    
            // 查询对应页面的数据
            User.find().skip((page-1)*size).limit(size).then((data) => {
                res.json({code: 0, data: data});
            })
        }).catch((err) => {
            console.log(err);
        });
    }else {
        //根据关键字查询数据
        User.find({username: {$regex: keyword,$options: 'x'}}).then((result) => {
            if (result.length > 0) {
                //数组有数据
                res.json({code: 0,data: result});
            } else {
                //没数据
                res.json({code: -1,message: '没有搜索到相关数据,请重试'});
            }
        }).catch((err) => {
            console.log(err);
            res.json({message:'搜索失败,请重试', code: -1})
        });
    }
})

//向外输出路由
module.exports = router;