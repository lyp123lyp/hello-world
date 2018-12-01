$(function(){
    var host="http://localhost:3000";
    $(".nc-register-mode ul").on("click","li",function(e){
        e.preventDefault();
        var $li=$(this);
        
        if($li.hasClass("one")){
            var k=$(".tabs-content.default").css({
                'left':0,
                "z-index":100,
                opacity:1
            }).siblings().css({
                'left':-540,
                "z-index":98,
                opacity:0
            });
            $(".tabs-content dl").attr("class","").find("label").hide();
        }else{
            $(".tabs-content.default").css({
                'left':-540,
                "z-index":98,
                opacity:0
            }).siblings().css({
                'left':0,
                "z-index":100,
                opacity:1
            })
        }
        $li.children("a").addClass("tabulous_active").parent().siblings().children("a").removeClass("tabulous_active");
    });
    var yzmCode={};//接受验证码
    $('.default_register').on("focus",'input',function(){
        var input=$(this);
        if(input.val()==input.attr("tipmsg"))
        input.val("").css("color","#333");
        input.parents("dl").addClass("focus");
        
    }).on("blur","#user_name,#password,#password_confirm,#email",function(){
        var input=$(this);
        var $id=input.prop("id");
        var val=input.val().trim();
        var ibj=`<i class="icon-exclamation-sign"></i>`;
        var regExp1=new RegExp(/^[a-zA-Z][a-zA-Z0-9_]{2,14}$/) ;
        if($id=="user_name"){
            if(val==""){
                input.next().html(`${ibj}用户名不能为空`).show().width("130").removeClass("success").parents("dl").addClass("error");
                return false;
            }
            if(val.length>15||val.length<3){
                input.next().html(`${ibj}用户名必须在3-15个字符内`).show().width("202").removeClass("success").parents("dl").addClass("error");
                return false;
            }else if(!regExp1.test(val)){
                    input.next().html(`${ibj}用户名只能是数字、字母、下划线`).show().width("240").removeClass("success").parents("dl").addClass("error");
                    return false;
               
            }else{
                //发送ajax请求,查询数据库是否已经注册过同样的用户名
                 $.ajax({
                     url:host+"/users/namerepeat",
                     type:"get",
                     dataType:"json",
                     data:{uname:val}
                    }
                 ).then(res=>{
                     if(res.code==1){
                        input.next().html(`${ibj}用户名已被占用`).show().width("130").removeClass("success").parents("dl").addClass("error");
                     }else{
                        input.next().html(`${ibj}用户名通过`).show().width("130").addClass("success").parents("dl").removeClass("error");
                     }
                 });
            }
        }else if($id=="password"){

            var regExp2=new RegExp(/^[a-zA-Z]\w{7,15}$/) ;
            if(val==""){
                input.next().html(`${ibj}密码不能为空`).show().width("115").removeClass("success").parents("dl").addClass("error");
                return false;
            }
            if(val.length>16||val.length<8){
                input.next().html(`${ibj}用户名必须在8-16个字符内`).show().width("202").removeClass("success").parents("dl").addClass("error");
                return false;
            }else if(!regExp1.test(val)){
                input.next().html(`${ibj}密码只能是数字、字母、下划线`).show().width("230").removeClass("success").parents("dl").addClass("error");
                return false;
            }else{
                
                input.next().html(`${ibj}密码通过`).show().width("130").addClass("success").parents("dl").removeClass("error");
            }
        }else if($id=="password_confirm"){
            if(val==$(".default_register #password").val()&&val!==""){
                input.next().html(`${ibj}两次密码一样`).show().width("130").addClass("success").parents("dl").removeClass("error");
            }else{
                input.next().html(`${ibj}两次密码不一样`).show().removeClass("success").parents("dl").addClass("error");
            }
        }else if($id=="email"){
            var regExp3=new RegExp(/^[A-Za-z0-9_\-\.]+@[a-zA-Z0-9]+(\.[a-zA-Z]+)+$/);
            if(input.val()==""){
                input.val(input.attr("tipmsg")).next().hide().parents("dl").removeClass("error").removeClass("focus");
                return false;
            }
            if(!regExp3.test(val)){
                input.next().html(`${ibj}邮箱地址不正确`).show().removeClass("success").parents("dl").addClass("error");
            }else{
                input.next().html(`${ibj}邮箱通过`).show().width("130").addClass("success").parents("dl").removeClass("error");
            }
        }
    }).on("click","[type=checkbox],.submit",function(){
        var $btn=$(this);
        if(($btn.attr("type")=="checkbox")){
            $btn.siblings("label").toggleClass("error");
        }else if($btn.hasClass("submit")){
            var $email=$("#email");
            var emailval=$email.val().trim();
            var tipmsg=$email.attr("tipmsg");
            if(emailval==tipmsg){
                $('.default_register').find("input").not(".email").blur();
            }else{
                console.log(emailval,tipmsg);
                $('.default_register').find("input").blur();
            }
           if($(".default_register dl").hasClass("error")){
              alert("注册失败");
           }else{
               var uname=$("#user_name").val().trim();
               var upwd=$("#password").val().trim();
               var email=$('#email').val().trim();
               var reg=/^[A-Za-z0-9_\-\.]+@[a-zA-Z0-9]+(\.[a-zA-Z]+)+$/;
               if(!reg.test(email)){
                    email='';   
               }
               $.ajax({
                   url:host+"/users/register",
                   //url:host+"/register/",//跨域请求的路径，要写全才能访问
                   type:"POST",
                  // dataType:"jsonp",//不需要跨域的时候不要用,默认掉用的方式是get
                  dataType:"json",
                   data:{
                        uname,
                        upwd,
                        email
                   },
                   'content-Type': "application/x-www-form-urlencoded"
               }).then((res)=>{
                   if(res.code=="ok"){
                       var url=window.location.search;
                       if(url.startsWith("?back=")){
                            location.href= host +"/login.html"+url;
                       }else{
                            location.href=host+"/login.html";
                       }
                  
                   }else{
                    alert("注册失败");
                   }
               });
             
           }
        }    
    });
    $('#mobile').on("focus",'input[type=text]',function(){
        var input=$(this);
        if(input.val()==input.attr("tipmsg"))
        input.val("").css("color","#333");
        input.parents("dl").addClass("focus");
    }).on("blur","[type=text]",function(){
        var regExp1=/^(\+86\s*)?[1][3-9]\d{9}$/;
        var $input=$(this);
        var ibj=`<i class="icon-exclamation-sign"></i>`;
        var val=$input.val().trim()||$input.html();
        if($input.hasClass("phone")){
            if(regExp1.test(val)&&val!=""){
                $input.next().html(`${ibj}输入正确`).show().removeClass("error").addClass("success").parents("dl").addClass("focus").removeClass("error");
            }else{
                if(val==""){
                    $input.next().html(`${ibj}手机号码不能为空`).show().width("170").removeClass("success").addClass("error").parents("dl").removeClass("focus").addClass("error");
                    return ;
                }
                $input.next().html(`${ibj}请输入的手机号码有误`).show().width("170").removeClass("success").addClass("error").parents("dl").removeClass("focus").addClass("error");
            }
        }else if($input.hasClass('image_captcha')){
            var yzm=yzmCode.code;
            
            if(val.toLowerCase()==yzm.toLowerCase()){
                $input.next().addClass("success").parents("dl").addClass("focus");
            }else{
                $input.next().addClass("error").parents("dl").addClass("error").removeClass("focus");
            }
        }else if($input.hasClass('sms_captcha')){
            if(val=="undefined"){
                $input.next().html(`${ibj}输入正确`).show().removeClass("error").addClass("success").parents("dl").addClass("focus").removeClass("error");
            }else{
                $input.next().html(`${ibj}输入错误`).show().removeClass("success").addClass("error").parents("dl").addClass("error").removeClass("focus");
            }
        }
    }).on("click","a.makecode,a.getPhoneCode,#submitBtn",function(){
        var $btn=$(this);
        if($btn.hasClass('makecode')){
            yanzm(); 
        }
        if($btn.hasClass("getPhoneCode")){
            var count=60;
            var timer=setInterval(function(){
                count--;
                if(count>0){
                    $btn.html(`发送中(${count})`);
                }
                else{
                    $btn.html("重新发送");
                    clearInterval(timer);
                }
            },1000);
            
        }else if($btn.prop("id")=="submitBtn"){
            var $dl=$btn.parent().siblings();
            $dl.find("input:not(:submit)").blur();
            var len=$dl.find('label.success').length;
            if(len==3){
                alert("注册成功");
            }else{
                alert('红色框属于必填');
            }
        }
    }).on("keyup","input#image_captcha",function(){
        $btn=$(this);
        if($btn.hasClass("image_captcha")){
            var val=$btn.val();
            var yzm=yzmCode.code;
            if(val.length>3){
                if(val.toLowerCase()==yzm.toLowerCase()){
                    $btn.next().addClass("success").removeClass("error").parents("dl").addClass("focus").removeClass("error");
                }else{
                    $btn.next().addClass("error").removeClass("success").parents("dl").removeClass("focus").addClass("error");
                }
            }
           
        }
    });
    /*模拟验证码 */
    function yanzm(){
        var c3=$("<canvas width='120' height='52'></canvas>");
        // $('body').append(c3);
         var ctx=c3[0].getContext("2d");
         //随机颜色函数
         var rgb_fn=function(min,max){
             var r=num_fn(min,max);
             var g=num_fn(min,max);
             var b=num_fn(min,max);
             return `rgb(${r},${g},${b})`;
         }
         //随机数函数
         var num_fn=function(min,max){
             return Math.floor(Math.random()*(max-min))+min;
         }
         //1:创建矩形作为验证码的背景色
         ctx.fillStyle=rgb_fn(180,233)
         ctx.fillRect(0,0,120,56);
         var str="abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
         var yzm="";
         for(var i=0,len=str.length;i<4;i++){
             //2:创建随机文字4个绘制在背景上
             var c=str[num_fn(0,len)];
             yzm+=c;
             ctx.fillStyle=rgb_fn(30,180);
             //看不见文字是因为基线和颜色问题
             ctx.textBaseline="top";
             ctx.font=num_fn(28,50)+"px SimHei";//font一定要和字体一起复制
             ctx.fillText(c,i*25+5,5);
         };
         //3: 创建5条干扰线
        for(var k=0;k<5;k++){
            ctx.beginPath();
            ctx.moveTo(num_fn(0,120),num_fn(0,56));
            ctx.lineTo(num_fn(0,120),num_fn(0,56));
            ctx.strokeStyle=rgb_fn(0,255);
            ctx.closePath();
            ctx.stroke();
        }
         //4:创建20个干扰点
         for(var j=0;j<20;j++){
             ctx.beginPath();
             ctx.filltyle=rgb_fn(0,255);
             ctx.arc(num_fn(0,120),num_fn(0,30),1,0,2*Math.PI);
             ctx.fill();
             ctx.closePath();
         }
        var imgsrc= c3[0].toDataURL("yz.png");
        $("#sms_codeimage").attr("src",imgsrc);
        yzmCode.code=yzm;
    }
    yanzm();
   
    
});
