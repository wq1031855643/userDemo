$('#confirm').on('click', function(){
    if ($('#pwd').val() !== $('#rePwd').val()) {
        alert('两次输入不一致,请重新输入')
        $('#pwd').val('');
        $('#rePwd').val('');
        return;
    }

    $.ajax({
        type: "post",
        url: "/api/regiester",
        data: {
            username: $('#user').val(),
            password: $('#pwd').val()
        },
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.code == 0) {
                //注册成功
                alert(response.message);
                location.href = "/login";
            }else {
                alert(response.message);
            }
        }
    });
})


