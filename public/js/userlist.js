//点击修改
$('.table').on('click','.btn-primary', function(){
    $('.bs-example-modal-sm').modal('toggle');
    let username = $(this).parent().parent().children().eq(1).text();
    sessionStorage.setItem('username', username);
})


//修改密码
$('#submit').on('click', function(){
    $.ajax({
        type: "post",
        url: "/api/userlist/update",
        data: {
            username: sessionStorage.getItem('username'),
            oldPwd: $('#oldPwd').val(),
            newPwd: $('#newPwd').val()
        },
        dataType: "json",
        success: function (result) {
            console.log(result);
            if (result.code == 0) {
                alert(result.message);
                $('.bs-example-modal-sm').modal('toggle');
                location.reload() 
            }else {
                alert(result.message);
            }
        }
    });
})

//删除
$('.table').on('click','.btn-danger', function(){
    let username = $(this).parent().parent().children().eq(1).text();
    $.ajax({
        type: "post",
        url: "/api/userlist/del",
        data: {
            username: username
        },
        dataType: "json",
        success: function (result) {
            console.log(result);
            if (result.code == 0) {
                alert(result.message);
                location.reload() 
                // init();
            }
        }
    });
});

//搜索
$('#seach-btn').on('click', function () {
    $.ajax({
        type: "post",
        url: "api/seach",
        data: {
            keyword: $('#seach-v').val()
        },
        dataType: "json",
        success: function (response) {
            if (response.code == 0) {
                $('.table tbody').remove();
                let str = '';
                response.data.forEach(element => {
                    str = '<tr><td>'+ element._id +'</td><td>'+ element.username +'</td><td>'+ element.password +'</td><td><button class="btn btn-primary" type="submit">修改</button><button class="btn btn-danger" type="submit">删除</button></td></tr>';
                    $('.table').append(str);
                });
            } else {
                alert(response.message);
            }
        }
    });
});
