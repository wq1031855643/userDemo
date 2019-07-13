$('#confirm').on('click', function(){
    $.ajax({
        type: "post",
        url: "/api/login",
        data: {
            username: $('#user').val(),
            password: $('#pwd').val()
        },
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.code == 0) {
                //登录成功,跳转到首页
                location.href = "/";
            }else {
                alert(response.message);
            }
        }
    });
})
