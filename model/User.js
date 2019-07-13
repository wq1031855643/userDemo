/*
 * @Author: lyq 
 * @Date: 2019-07-11 17:35:08 
 * @Last Modified by: lyq
 * @Last Modified time: 2019-07-11 17:38:49
 */

const mongoose = require('mongoose');

//声明表结构
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//创建表模型
const model = mongoose.model('users', schema);


//向外输出表模型
module.exports = model;