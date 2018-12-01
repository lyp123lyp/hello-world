$(function () {
    //根据搜索款的关键字去数据库产品列表模糊查询，获取数据
    var host = "http://localhost:3000";
    var $wwiModule = $(".wwi-module.wwi-padding25");

    var keywords = window.location.search.split("=")[1].trim();
    keywords = decodeURIComponent(keywords);
    var pno = 0;//分页查询的起始页，初始值
    // if(!keywords){
    //window.location.href=host+"/index.html";
    //return false;
    //  }
    var result = null,benzhires=null;
    $.ajax({
        url: host + '/products/products?',
        data: { keywords, pno },
        type: "get",
        dataType: "json"
    }).then((res) => {
        result = res;
        var keya=JSON.stringify(res)
        //console.log(keya);
        benzhires=JSON.parse(keya);
        var length = 0;
        // console.log(res);
        pno = res.pno;
        if (res.length == "0") {
            length = 0;
        } else {

            length = res.length;
        }
        //搜索到商品情况
        var html = `<div class="title" style="border-bottom: 1px solid #eee;">
                <h3>
                    <em>${keywords}</em>
                    &nbsp;&nbsp;&nbsp;&nbsp;搜索到<b>${length}</b>件相关商品</h3>
            </div>`;
        $wwiModule.html(html);
        //标签页
        var $pagelist = $(".pagination ul.page_list");
        var li_html = `<li class="disabled"><span>首页</span></li>
                    <li  class="disabled"><span>上一页</span></li>`;
        for (var j = 0; j < res.pageCount; j++) {
            li_html += `<li><span class="${res.pno == j ? 'currentpage' : ''}">${j + 1}</span></li>`;
        }
        //分页查询
        li_html += `<li class="disabled"><span>下一页</span></li>
                  <li class="disabled" ><span>末页</span></li>`;
        $pagelist.html(li_html)
        //此函数是商品列表
        productsList(res);
        //给商品列表中的添加购物车，添加点击事件

        //标签页的点击事件
        $pagelist.on("click", "span", function () {
            var $span = $(this);
            var text = $span.text();
            if (text != pno + 1 && Number(text)) {
                pno = text - 1;
                $.ajax({
                    url: host + "/products/products?",
                    data: { keywords, pno },
                    type: "get",
                    dataType: "json"
                }).then(res => {
                    pno = res.pno;
                    productsList(res);
                });
            } else if (text == "上一页" || text == "首页") {
                if (pno > 0) {
                    if (text == "上一页")
                        pno -= 1;
                    else
                        pno = 0;
                    $.ajax({
                        url: host + "/products/products?",
                        data: { keywords, pno },
                        type: "get",
                        dataType: "json"
                    }).then(res => {
                        pno = res.pno;
                        productsList(res);
                    });
                }

            } else if (text == "下一页" || text == "末页") {

                if (pno < res.pageCount - 1) {
                    if (text == "下一页")
                        pno += 1;
                    else
                        pno = res.pageCount - 1;
                    $.ajax({
                        url: host + "/products/products?",
                        data: { keywords, pno },
                        type: "get",
                        dataType: "json"
                    }).then(res => {
                        pno = res.pno;
                        productsList(res);
                    });
                }
            }
        });
        //热销商品推荐
        var hotHTML = "";
        if (res.products.length >= 7) {
            len2 = 8;
        } else {
            len2 = res.products.length;
        }
        //console.log(len2);
        for (var i = 0; i < len2; i++) {

            var { product_id, name, title, price, old_price, src, is_onsale, hot } = res.products[i];
            // var onsale=res.products[i].is_onsale;
            if (is_onsale == 1 && hot > 0) {
                hotHTML += `<li nctype_goods="103751" nctype_store="160">
                    <div class="goods-pic">
                    <a href="./productDetails.html?pid=${product_id}" target="_blank" title="${title}">
                        <img src="./picture/${src}" title="${title}" alt="${title}">
                    </a> 
                    </div>
                    <div class="goods-name">
                    <a href="${name}" target="_blank" title="${name}">${name}</a>
                    </div>
                    <div class="goods-price" title="商品价格：¥${price.toFixed(2)}">${price.toFixed(2)}
                    <em class="market-price" title="市场价：¥${old_price.toFixed(2)}">¥${old_price.toFixed(2)}</em>
                    </div>
                </li>`;
            }

        }
        //热销商品变量
        var $hotBox = $("#shopClassify");
        $hotBox.find("h3 b").html(keywords);
        $hotBox.find("ul").html(hotHTML);

    });
    //商品列表函数
    function productsList(res) {
        var html = "";
        for (var i = 0, len = res.products.length; i < len; i++) {

            var { name, title, product_id, price, old_price, src } = res.products[i];

            var notes = {
                pid: product_id,
                title,
                src,
                old_price,
                price
            };
            var note = JSON.stringify(notes);
            html += `<li class="item" data-notes='${note}'>
                        <div class="goods-content" nctype_goods=" 103974" nctype_store="10">
                            <div class="goods-pic">
                                <a href="./productDetails.html?pid=${product_id}" target="_blank" title="${title}">
                                    <img shopwwi-url="./picture/${src}" src="./picture/${src}" title="${title}" alt="${title}" style="display: inline;">
                                </a>
                            </div>         
                            <div class="goods-info">
                                    <div class="goods-price">
                                    <em class="sale-price" title="商城价：¥${price.toFixed(2)}">
                                        <i>¥ </i>${price.toFixed(2)}</em> 
                                    <em class="market-price" title="市场价：¥${old_price.toFixed(2)}">
                                        <i>¥</i>${old_price.toFixed(2)}</em>
                            </div>
                                <div class="goods-name">
                                    <a href="productDetails.html?pid=${product_id}" target="_blank" title="${title}">${name}</a>
                                </div>
                                <div class="add-cart">
                                <a href="./productDetails.html?pid=${product_id}" nctype="add_cart" class="ct" data-pid="${product_id}">
                                    <i class="icon-shopping-cart"></i>查看详情</a>                  
                                <a href="javacript:;" nctype="add_cart" class="ct p_addCart" data-pid="${product_id}" data-add="0">
                                    <i class="icon-shopping-cart"></i>加入购物车</a>                  
                                </div>
                            </div>
                        </div>
                    </li>`;

        }
        //渲染商品列表加浏览记录，应当在商品详情页去获取数据
        $(".squares .list_pic.clearfix").html(html)//.on("click", 'a', function () {
        // var $li = $(this).parents("li");
        // var obj = $li.attr("data-notes");
        // console.log(obj);
        //localStorage 储存
        // var late = new Late();
        // late.set(obj);  
        //});
        var $pagelist = $(".pagination ul.page_list");
        var $span = $pagelist.find("span");

        if (res.length == 0 && res.pageCount == 0) {
            $pagelist.find("li").addClass('disabled');
        } else if (res.pageCount == 1) {
            $pagelist.find(":not(li:nth-child(3))").addClass('disabled');
        } else if (res.pageCount > 1) {
            for (var i = 0, len = res.pageCount; i < len; i++) {
                if (pno == i) {
                    $span.eq(i + 2).addClass("currentpage");
                    if (pno == 0) {
                        $span.parent(":lt(2)").addClass("disabled")
                            .siblings(":last-child()").removeClass("disabled").prev().removeClass("disabled");
                    } else if (pno == len - 1) {
                        $span.parent().removeClass("disabled")
                            .siblings(":last-child()").addClass("disabled").prev().addClass("disabled");
                    } else {
                        $span.parent().removeClass("disabled");
                    }
                } else {
                    $span.eq(i + 2).removeClass('currentpage');
                }
            };
        }
    }
    function Late() {
        this.storage = {},
            this.isinit = 0,
            this.maxnum = 10,
            this.key = 'vestigial'
    };
    Late.prototype._init = function () {//赋值方式值会留在原地，变量提升
        if (this.isinit === 1) {
            return true;
        } else if (this.isinit === 0 && window.localStorage) {
            this.isinit = 1;
            this.storage = window.localStorage;
            return true;
        } else {
            return false;
        }
    };
    Late.prototype.get = function () {
        if (this._init()) {
            var data = this.storage.getItem(this.key);
            return JSON.parse(data);
        } else {
            return false;
        }
    };
    Late.prototype.set = function (value) {
        if (this._init()) {
            var data = this.storage.getItem(this.key);
            data = JSON.parse(data);
            if (data === null) {
                data = [];
            }
            if (data.length === this.maxnum) {
                data.shift();
            }
            if (data.indexOf(value) == -1 && value != '') {
                data.push(value);
            }
            data = JSON.stringify(data);
            this.storage.setItem(this.key, data);
            return true;
        } else {
            return false;
        }
    };
    //显示浏览记录函数
    function show_guesslike() {
        var late = new Late();
        var each = late.get() || {};
        //  console.log(each);
        if (each.length == undefined) {
            each.length = 0;
        }
        var eachlength = each.length;

        var $wwiSidebarViewe = $("#wwiSidebarViewed").parents('.s3-module');
        if (eachlength == 0) {
            $wwiSidebarViewe.hide();
        } else {
            $wwiSidebarViewe.show();
        }
        var guesslike_html = '';
        for (i = 0; i < eachlength; i++) {
            var { pid, price, title, src, old_price } = JSON.parse(each[i]);
            guesslike_html += `<li nctype_goods="103751" nctype_store="160">
                <div class="goods-pic imgpd">
                    <a href="./productDetails.html?pid=${pid}" target="_blank" title="${title}">
                    <img src="./picture/${src}" title="${title}" alt="${title}">
                    </a> 
                </div>
                <div class="goods-name">
                    <a href="./productDetails.html?pid=${pid}" target="_blank" title="${title}">${title}</a>
                </div>
                <div class="goods-price" title="商品价格：¥${price.toFixed(2)}">${price.toFixed(2)}
                    <em class="market-price" title="市场价：¥$${old_price.toFixed(2)}">¥${old_price.toFixed(2)}</em>
                </div>
            </li>`;
        }
        $wwiSidebarViewe.find("ul").html(guesslike_html);
    }
    show_guesslike();
    function addCart(host, pid, count) {
        $.ajax({
            url: `${host}/cart/add`,
            data: { pid: pid, count: count },
            dataType: "json",
            type: "get"
        }).then(res => {
            if (res.code == 1) {
                var $cartTitle = $("<div class='cartTitle' id='cartTitle'>添加成功</div>").appendTo($("body"));
                var timer = setInterval(function () {
                    $("#cartTitle").remove();
                    clearInterval(timer);
                }, 600);
                productCount(host);
            } else {
                alert("购买失败");
                return false;
            }
        });
    }
    $(".squares .list_pic").on("click", ".p_addCart", function () {
        var $a = $(this);
        var pid = $a.attr("data-pid");
        var add = $a.attr("data-add");
        if (add == 0) {
            addCart(host, pid, 1);
            $a.attr("data-add", 1);


        } else {
            var $cartTitle = $("<div class='cartTitle' id='cartTitle'>购物车已经存在该商品</div>").appendTo($("body"));
            var timer = setInterval(function () {
                $("#cartTitle").remove();
                clearInterval(timer);
            }, 600);
        }

    });

    //加入购物车
    function productCount(host) {
        $.ajax({
            url: host + "/cart/productCount",
            dataType: "json",
            type: 'get'
        }).then(res => {
            var count = res[0].c;
            $("#buynum").html(" " + count + " ");
            $("#rtoobar_cart_count").html(count);
        });

    }
    $sortbar = $(".sortbar-array");
    $sortbar.on("click", "a", function () {
        var $a = $(this);
        var data = $a.attr("data-list");
        if (data == "normal") {
            var res = benzhires;
            productsList(res);
            var $a1= $a.parent().siblings().find("a");
           var stra= $a1.attr("data-list");
           $a1.attr("data-list",stra.slice(0,-1)+"1");
        } else if (data == "count1" || data == "hot1" || data == "price1") {
            $a.attr("data-list",data.slice(0,-1)+"2");
            var res1 = result;
            //console.log(result);
            var pdt = result.products, len = pdt.length;
            var arr = [];
            for (var i = 0; i < len; i++) {
                arr[i] = pdt[i].price;
            }
            var arr1 = arr.sort(function (a, b) {
                return a - b;
            });
            arr = [];//清空数组
            for (var k = 0; k < len; k++) {
                for (var i = 0; i < len; i++) {
                    if (arr1[k] == pdt[i].price) {
                        if(arr.indexOf(pdt[i])==-1){
                            arr[k]=pdt[i];
                            break;
                        }
                    }
                }
            }
            result.products=arr;
           var res=result;
           productsList(res);

        }else{
            //$a.attr("data-list",data.slice(0,-1)+"1");
        }
        $a.parent().addClass("selected").siblings().removeClass("selected");
    });
});