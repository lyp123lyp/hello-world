
$(function () {
    var host = 'http://localhost:3000'
    var $clocation = $(".w-main .c-location");
    var pid = location.search.split("=")[1];
    var $shopInfo = $(".w-main .shopinfo .pdinfo-summary");//商品信息
    var $pdInfoStatus = $(".pd-info-status");//商品规格等...
    var $previewBox = $('.preview-box .sm_md_lg');//放大镜部分
    var $ncsGoodsMain = $(".ncs-goods-main");//商品详情介绍
    var $cityDetails = $(".cityDetails");//配送地址
    var addFlag = false;//判断商品是否添加过了
    var status = {};
    $.ajax({
        url: host + "/products/productDetails",
        type: "get",
        dataType: "json",
        data: { pid }
    }).then(function (res) {

        var { name, category, shop_address, price, product_id, subtitle, stock_count,old_price,src } = res.product;
        //商品的浏览记录的储存
        var late=new Late();
        var obj=`{"pid":${product_id},`
            obj+=`"title":"${name}",`
            obj+=`"src":"${src}",`
            obj+=`"old_price":${old_price},`
            obj+=`"price":${price}}`;
        late.set(obj);
        var chtml = `<a class="a-grey" href="./index.html">首页</a><span>&gt;</span>
                    <a class="a-grey" href="./products.html?keywords=${category}" target="_blank">${category}</a><span>&gt;</span>
                    ${name}`;
        $clocation.html(chtml);
        $(".ncs-info .title a").html(shop_address);//商店名称

        $shopInfo.prev().find("h1").html(name).next().html(subtitle).parent().next("ul").find("li:first-child .f-orange")
            .html(`￥${price.toFixed(2)}`);
        var chooseType = "";
        $("#p_count").html(`（${stock_count}）`);
        for (var i = 0, len = res.specs.length; i < len; i++) {
            var { spec } = res.specs[i];
            var pid = res.specs[i].product_id;
            chooseType += `<div class="item ${product_id == pid ? 'selected' : ''}">
                            <a href="javascript:;" title="${spec}" id="goodsSpec28752" data-pid="${pid}">${spec}</a>
                            <b></b>
                        </div>`;
        }
        $pdInfoStatus.find(".choose-type .dd:eq(0)").html(chooseType).parents("li")
            // .siblings(".buycart-btn").fins("").parents("li")
            .siblings(".shopName").find("a").html(`${shop_address}`);
        //放大镜部分的数据
        var jschgImg_html = '';
        for (var j = 0, len1 = res.pics.length; j < len1; j++) {

            var { sm, md, lg } = res.pics[j];
            jschgImg_html += `<li class="js-chgImg">
                                <a href="javascript:void(0);">
                                    <img src="./picture/${sm}" width="60" height="60" data-src='{"md":"./picture/${md}","lg":"./picture/${lg}"}'>
                                </a>
                            </li>`;
        }
        $previewBox.find(".spec-items ul").html(jschgImg_html).children(":eq(0)").addClass("hover");
        $previewBox.find(".spec-img img").attr("src", `./picture/${res.pics[0].md}`);
        $previewBox.find(".bigImg img").attr("src", `./picture/${res.pics[0].lg}`);
        //商品详情的图片
        var shop_img_html = "";
        var details = res.product.details.slice(1, -1).split("'").join("").split(",");
        for (var si = 0, slen = details.length; si < slen; si++) {
            var src = details[si];
            shop_img_html += `<img src="./picture/${src}" data-src='./picture/${src}'>`;
        };
        var k = $ncsGoodsMain.find(".ncs-goods-info-content .default").html(shop_img_html);
        // console.log(k);
    });
    var option = `<option value='-1'>--请选择--</option>`;
    $.ajax({
        url: host + "/city/province",
        type: 'get',
        dataType: "json"
    }).then(res => {
        for (var item of res) {
            option += `<option value='${item.code_p}'>${item.name}</option>`
        };
        $cityDetails.find(".cityDetails1").html(option);
    });
    //$cityDetails.find(".cityDetails1")
    //三级联动，显示地区
    $cityDetails.on("change", "select", function () {
        var $select = $(this);
        if ($select.hasClass("cityDetails1")) {
            var url = host + "/city/city";
            select_option($select, url);
        } else if ($select.hasClass("cityDetails2")) {
            var url = host + "/city/area"
            select_option($select, url);
        }
    });
    function select_option($select, url) {
        if ($select.val() != -1) {
            var $next = $select.next().show();

            var option = "<option value='-1'>--请选择--</option>";
            $.ajax({
                url,
                type: 'get',
                dataType: "json"
            }).then(res => {
                console.log(res);
                for (var item of res) {
                    option += `<option value='${item.code_p}'>${item.name}</option>`
                };
                $next.html(option);
            });
        } else {
            $select.nextAll().hide()
        }

    }
    //随机获取商品
    $.ajax({
        url: host + "/products/random",
        dataType: "json",
        type: "get"
    }).then(res => {
        var len = 4;
        var length = res.length;
        var html1 = showHotClass(len, res, length);
        var $ncsSidebar = $(".ncs-sidebar");
        $ncsSidebar.find(".classShop ul").html(html1);
        var html2 = showHotClass(len, res, length);
        $ncsSidebar.find(".hotShop ul").html(html2);
    });
    //循环累加代码赋值
    function showHotClass(len1, res, length) {
        var html = "";
        for (var i = 0; i < len1; i++) {
            var random1 = Math.floor(Math.random() * length);
            var { price, name, src, title, product_id, spec } = res[random1];
            html += `<li>
                        <dl>
                            <dt class="goods-pic">
                                <a href="./productDetails.html?pid=${product_id}" target="_blank" title="${title}">
                                    <img src="./picture/${src}">
                                </a>
                            </dt>
                            <dd class="goods-name goods-name1">
                                    <a href="./productDetails.html?pid=${product_id}" target="_blank" title="${title}">${name}
                                        <em>${spec}</em>
                                    </a>
                                </dd>
                            <dd class="goods-price">¥${price.toFixed(2)}</dd>
                        </dl>
                    </li>`;
        };
        return html;
    }
    //放大镜的部分的动态效果
    var $mask = $previewBox.find(".mask");
    var $bigImg = $previewBox.find(".bigImg");
    var MSIZE = $mask.width(), maskUpW = $mask.prev().width();//mask的大小
    var MAX = maskUpW - MSIZE;//top和left的最大值
    var $bImg = $bigImg.find("img"), bImgW, bImgH;
    var bili1 = MSIZE / maskUpW, biliW, biliH;
    $previewBox.on("click", ".spec-items img", function () {
        var $img = $(this);
        var dsrc = JSON.parse($img.attr('data-src'));
        $img.parents("li").addClass("hover").siblings().removeClass("hover");
        $img.parents(".sm_md_lg").children(".spec-img").find("img").attr("src", dsrc.md).parents(".spec-img").next().find("img").attr("src", dsrc.lg);
    }).on("mouseenter", ".mask-up", function () {
        $mask.show();
        $bigImg.show();
        bImgH = $bImg.height();
        bImgW = $bImg.width();
        biliH = bImgH / bImgW;
        //$bigImg.height(biliH*360);
    }).on("mouseleave", ".mask-up", function () {
        $mask.hide();
        $bigImg.hide();
    }).on("mousemove", ".mask-up", function (e) {
        var left = e.offsetX - MSIZE / 2;
        var top = e.offsetY - MSIZE / 2;
        if (left < 0) left = 0;
        else if (left > MAX) left = MAX;
        if (top < 0) top = 0;
        else if (top > MAX) top = MAX;
        $mask.css({ left, top });
        $bImg.css({ "margin-left": `${-bImgW / 360 * left}px`, "margin-top": `${-bImgH / 360 * top}px` });
    });

    //商品规格，商品数量，加入购物车，立即购买

    $pdInfoStatus.on("click", "a", function (e) {
        $btn = $(this);
        var $parent = $btn.parent();
        if ($parent.hasClass("item")) {
            var pid = $btn.attr("data-pid");
            window.location.href = `./productDetails.html?pid=${pid}`;

        } else if ($parent.hasClass("choose-amount")) {
            var val = $parent.find("input").val();
            if ($btn.html() == "-" && val > 1) {
                $btn.next().val(--val);
            } else if ($btn.html() == "+" && val < 999) {

                $btn.prev().val(++val);
            }
        } else if ($parent.hasClass("buycart-btn")) {//添加购物车操作
            var pid = window.location.search.split("=")[1];
            var count = $parent.siblings(".choose-type2").find("input").val();
            isLogin(host);
            if (status.code != 1) {
                $("#myModal").css({
                    display: "block",
                    opacity: 1
                });
                return false;
            }

            if ($btn.hasClass("btn-buynow")) {
                if (!addFlag) {
                    addCart(host, pid, count);
                }
                window.location.href = "./cart.html";
            } else {
                if (addFlag) {
                    alert("购物车已经存在该商品");
                    return false;
                } else {
                    addCart(host, pid, count);
                    addFlag = true;
                }
            }
        }

    }).on("blur", "input", function () {
        console.log(1);
        var $input = $(this);
        if ($input.val() < 1) {
            $input.val("1");
        } else if ($input.val() > 999) {
            $input.val("999");
        }
    });
    //红色按钮添加商品
    var $addcart = $(".add-cart.cart02 .addcart");
    $addcart.on("click", function () {
        var pid = window.location.search.split("=")[1];
        var count = $("#minimumOrder").val();
        isLogin(host);
        if (status.code != 1) {
            $("#myModal").css({
                display: "block",
                opacity: "1"
            })
            return false;
        }
        if (addFlag) {
            alert("购物车已经存在该商品");
            return false;
        } else {
            addCart(host, pid, count);
        }

    });
    var $mainNH = $("#main-nav-holder");
    $mainNH.on("click", "#categorymenu li", function () {
        var $li = $(this).addClass("current");
        var index = $li.index();
        $li.siblings().removeClass("current");
        var $ncsIntro = $li.parents(".tabbar").siblings();
        $ncsIntro.hide().eq(index).show();

    }).on("click", "#comment_tab li", function () {
        var $li = $(this);
        var index = $li.index();
        if (!$li.hasClass("current")) {
            $li.addClass("current").siblings().removeClass("current");
        }
    });

    //判断是否登录
    function isLogin(host) {
        $.ajax({
            url: host + "/users/islogin",
            type: "get",
            dataType: "json"
        }).then(res => {
            status = res;

        });

    }
    isLogin(host);
    function addCart(host, pid, count) {

        $.ajax({
            url: `${host}/cart/add`,
            data: { pid: pid, count: count },
            dataType: "json",
            type: "get"
        }).then(res => {
            if (res.code == 1) {
                var $cartTitle = $("<div class='cartTitle' id='cartTitle'>添加成功</div>").appendTo($("body"));
                productCount(host);

                var timer = setInterval(function () {
                    $("#cartTitle").remove();
                    clearInterval(timer);
                }, 600);

            } else {
                alert("购买失败");
                return false;
            }
        });

    }
    function productCount(host) {
        console.log(0);
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
    
    //商品浏览记录记载
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
});

