
    //添加购物车
    function addCart(host,pid,count){
        $.ajax({
            url:`${host}/cart/add`,
            data:{pid:pid,count:count},
            dataType:"json",
            type:"get"
        }).then(res=>{
            if(res.code==1){
                var $cartTitle=$("<div class='cartTitle' id='cartTitle'>添加成功</div>").appendTo($("body"));
                var timer= setInterval(function(){
                        $("#cartTitle").remove();
                        clearInterval(timer);
                    },400);
            }else{
                alert("购买失败");
                return false;
            }
        });
    }
    //页面跳转共用函数
    function backToURL(host){
        var url=location.href;
        location.href=host+"/login.html?back="+url;
    }
    
    

