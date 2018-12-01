$(function(){
    var host="http://localhost:3000";
    //页面一加载过来，就去判断复选框是否选中
    var $checkbox=$(".handle-div .checkbox");
    if($checkbox.is(":checkbox")){
        
        var now = new Date().getTime();
        var old=localStorage.getItem("qm7days");
        var days7=7*24*60*60*1000;
        if(now-old>days7){
            $checkbox.next().hide();
            $checkbox.removeAttr("checked");
            localStorage.removeItem("qm_uname");
            localStorage.removeItem("qm_upwd");
        }else{
            $checkbox.next().show();
            $checkbox.attr("checked","checked");
            $("#user_name").val(localStorage.getItem("qm_uname"));
            $("#password").val(localStorage.getItem("qm_upwd"));
        } 
    }
    $(".nc-login-mode .tabs-content").on("focus","input",function(){
        var $input=$(this);
        $input.parents("dl").addClass("dl_success");
    }).on("blur",'input',function(){
        var reguname=/^[a-zA-Z][a-zA-Z0-9_]{2,14}$/;
        var reguphone=/^1[3-9][0-9]{9}$/;
        var regupwd=/^[a-zA-Z]\w{7,15}$/;
        var $input=$(this);
        var val=$input.val().trim();
        if($input.attr('type')=="text"){
            if(!reguname.test(val)){
                if(!reguname.test(val)){
                    $input.next().addClass("error").removeClass("success").html(`<i class="icon-exclamation-sign"></i>用户名不正确`).show().parents("dl").addClass("dl_error").removeClass("dl_success");
                    
                }else{
                    $input.next().addClass("success").removeClass("error").hide().parents("dl").addClass("dl_success").removeClass("dl_error");;
                }
            }else{
                $input.next().addClass("success").removeClass("error").hide().parents("dl").addClass("dl_success").removeClass("dl_error");
                
            }
        }else if($input.attr("type")=="password"){
            if(val.length<8||val.length>15){
                $input.next().addClass("error").removeClass("success").html(`<i class="icon-exclamation-sign"></i>密码8-15个字符`).width(135).show().parents("dl").addClass("dl_error").removeClass("dl_success");
                return;
            }
            if(!regupwd.test(val)){
                $input.next().addClass("error").removeClass("success").html(`<i class="icon-exclamation-sign"></i>密码不正确`).width(115).show().parents("dl").addClass("dl_error").removeClass("dl_success");
            }else{
                $input.next().addClass("success").removeClass("error").hide().parents("dl").addClass("dl_success").removeClass("dl_error");;
            }
        }
    }).on("click","[type=checkbox],input.submit",function(e){
        var $input=$(this);
        if($input.prop('type')=='checkbox'){
            if($input.is(":checked")){
                $input.next().addClass("show");
               
            }else{
                $input.next().removeClass("show");
               
            }
        }else if($input.hasClass("submit")){
            e.preventDefault();
            var $int=$(".nc-login-mode .tabs-content").find("input").blur();
            var err= $int.siblings("label").hasClass("error");
            if(err){
                return false;
            }else{
                //发送请求
                var uname=$("#user_name").val().trim();
                var upwd=$("#password").val().trim();
                $.ajax({
                    url:host+'/users/login',
                    data:{upwd,uname},
                    type:"post",
                    dataType:"json",
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                        console.log(request);
                    }
                }).then(res=>{
                   if(res.code=="ok"){
                      // alert("登录成功");
                        if($checkbox.is(":checked")){
                            localStorage.setItem("qm7days",new Date().getTime());
                            localStorage.setItem("qm_uname",uname);
                            localStorage.setItem('qm_upwd',upwd);
                        }else{
                            localStorage.removeItem("qm7days");
                            localStorage.removeItem("qm_uanme");
                            localStorage.removeItem("qm_upwd");
                        }
                        var url=window.location.search;
                        if(url.startsWith("?back=")){
                            window.location.href=url.slice(6)
                        }else{
                            window.location.href=host;
                        }
                       
                   }else{
                       // alert("用户名或密码错误");
                        $("#append_parent").show().find(".alert_error").html("用户名或密码错误").css("color","#F32613");
                   }
                });
            }
        }
        
    });
    $("#append_parent").on("click",function(){
        $(this).hide();
    });
    $.ajax({
        url:'http://localhost:3000/users/islogin',
        type:"get",

    }).then(res=>{
        console.log(res);
    });
});