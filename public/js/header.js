$(function () {
    var host = "http://localhost:3000";
    //页面跳转共用函数
    function backToURL(host){
        var url=location.href;
        location.href=host+"/login.html?back="+url;
    }
    //页面登录状态封装
    //页面头部从后台加载够来
    $.ajax({
        url: host + "/head.html",
        type: "get",
    }).then(res => {
        var $header = $("#header");
        $header.replaceWith(res);
        // 搜索框
        var $Keywords = $("#searchKeywords");
        var $search = $(".search-tab>.search-form");

        $search.on("click", "#searchBtn", function (e) {
            var $val = $Keywords.val().trim();
            var $btn = $(this);
            if ($val == "") {
                alert("你没有输入的搜索的关键字");
                return;
            } else {
                var hostURL = `${host}/products.html?keywords=${$val}`;
                window.location.href = hostURL;
            }
        }).on("keyup", "#searchKeywords", function (e) {
            if (e.keyCode == "13") {
                $("#searchBtn").click();
            }
        });
        //跳转到首页的判断
        if (window.location.href != host + "/index.html") {
            var params = window.location.search;
            if (params) {
                if(params.split("=")[0].indexOf("keywords")!=-1){
                    var kw = params.split("=")[1];
                    $Keywords.val(decodeURI(kw));
                }
            } else {
                // window.location.href=host+"/index.html";
                //return false;

            }
        }
        $(".top-nav .navleft").on("mouseenter", "li", function () {
            var $li = $(this);
            $li.find(".catetwo").show();
            $li.siblings().find(".catetwo").hide();
        }).on("mouseleave", "li", function () {
            var $li = $(this);
            $li.find(".catetwo").hide();
        });
        $("#header .hd-toplt0").on("click",".loginout",function(){
            $.ajax({
                url: host+"/users/signout",
                type:"get",
                dataType:"json"
            }).then(res=>{
                if(res.code==0){
                    $(".hd-top .hd-toplt1").show().siblings(".hd-toplt0").hide();
                }
            });
        })
       
    });
    //页面底部加载
    $.ajax({
        url: host + "/foot.html",
        type: "get"
    }).then(res => {
        var $footer = $("#footer");
        $footer.replaceWith(res);
        /*友链*/
        $("[data-toggle='fl-tab']").mouseenter(function () {
            $(this).parent().addClass("active").siblings().removeClass("active");
            var href = $(this).attr("href");
            $(href).show().siblings().hide();
        }).click(function () { return false; });
        var mbtn = '<p class="ft-l-m">查看更多<i class="c-icon"></i></p>', $ftlinkTab = $('.j-linkTab');
        $ftlinkTab.filter(function () { if ($(this).height() > 54) { return true; } }).children().addClass('s-more').parent().append(mbtn);
        var $recMore = $('.ft-link .ft-l-m'), curheight = $ftlinkTab.find('ul').height();
        $recMore.toggle(function () {
            $(this).html('收起<i class="c-icon"></i>').addClass('ft-l-re');
            var autoheight = $(this).siblings('.j-linkTab ul').css('height', 'auto').height();
            $(this).siblings('.j-linkTab ul').height(curheight).stop(true, false).animate({ height: autoheight });
        }, function () { $(this).html('查看更多<i class="c-icon"></i>').removeClass('ft-l-re'); $(this).siblings('.j-linkTab ul').stop(true, false).animate({ height: curheight }); });
        //登录提示确认,跳转购物车
        $("#myModal .modal-footer").find("button").on("click",function(){
            backToURL(host);
        });
       
        $("#bar-user-login").click(function(){
            
            backToURL(host);
        });
        //用户头像跳转登陆页面
        $("#bar-user-info").click(function(){
            backToURL(host);
        });
       

    });
    //购物侧数据和用户登录状态切换
   $.ajax({
       url:host+"/users/islogin",
       dataType: "json",
       type:"get"
   }).then(res=>{
       
       if(res.code==1){
           $(".hd-top .hd-toplt1").hide().siblings(".hd-toplt0").show().find(".username").html(" "+res.uname+" ");
           productCount(host);
           
       }else{
           $(".hd-top .hd-toplt1").show().siblings(".hd-toplt0").hide()
       }
   });
   function productCount(host){
        $.ajax({
            url:host+"/cart/productCount",
            dataType:"json",
            type:'get'
        }).then(res=>{
            var count=res[0].c||0;
            $("#buynum").html(" "+count+" ");
            $("#rtoobar_cart_count").html(count);
        });
   }


 
});