$(function () {
    loadCart();
    //loadCart() 开始
    async function loadCart() {//异步加载数据的函数
        //判断是否登录
        var res = await $.ajax({
            url: "http://localhost:3000/users/islogin",
            type: "get",
            dataType: "json"
        });
        if (res.code == 1) {
            var res = await $.ajax({
                url: "http://localhost:3000/cart/items",
                dataType: "json",
                type: "get"
            });
            var tatol = 0, html = "", len = 0, allTatol = 0, allCount = 0;
            for (var item of res) {
                var { md, title, price, product_id, count, cart_id, spec, is_checked } = item;
                tatol = count * price;
                //判断is_checked==1;
                if (is_checked == 1) {
                    len++;
                    allCount += count;
                    allTatol += tatol;
                }
                html += `<div class="row bg-white mb-3">
                        <div class="col-md-1 border text-center">
                        <img class="mt-5 check" style="padding:5px;cursor:pointer" src="./images/${is_checked == 1 ? 'product_true.png' : 'product_normal.png'}" data-iid="${cart_id}" alt="">
                        </div>
                        <div class="col-md-5 card flex-md-row box-shadow">
                        <a href="product_details.html?pid=${product_id}" class="d-flex p_sm_img">
                            <img class="card-img-left flex-auto d-none d-md-block mt-4" src="./picture/${md}" width="54" height="54">
                        </a>
                        <div class="card-body d-flex flex-column align-items-start">
                            <a class="text-dark small" href="product_details.html?pid=${product_id}">${title}</a>
                            <p class="card-text /*mb-auto*/ mt-2">
                            <span class="small">规格：</span>
                            <span class="color-desc small">${spec}</span>
                            </p>
                        </div>
                        </div>
                        <div class="col-md-2 border text-center pt-5 c_maxWidth">
                        <h6 class="text-primary small">会员专享价</h6>
                        <p>¥${price.toFixed(2)}</p>
                        </div>
                        <div class="col-md-1 border px-0 py-5 text-center c_minWidth">
                        <button class="btn btn-secondary p-0 py-0 border-1" type="button" data-iid='${cart_id}'>-</button>
                        <input type="text" class="p-0 m-0"value="${count}" data-value="${count}" >
                        <button class="btn btn-secondary p-0 py-0 border-1" type="button" data-iid='${cart_id}'>+</button>
                        </div>
                        <div class="col-md-2 border pt-5 text-center">
                        <span class="d-inline-block py-1">¥${tatol.toFixed(2)}</span>
                        </div>
                        <div class="col-md-1 border py-5">
                        <a class="btn btn-sm btn-link text-muted text-center small delete" href="#" data-iid="${cart_id}">删除</a>
                        </div>
                    </div>`;

            }
            //显示购买多少个商品项和总价格
            var navhtml = `<nav class="my-2 my-md-0 mr-md-3 allTatol">
                            <span class="p-2 text-dark small">已选</span>
                            <span class="p-2 text-primary font-weight-bold">${allCount}</span>
                            <span class="p-2 text-dark small">件商品 合计(不计运费)：
                            <span class="p-2 text-primary font-weight-bold tatols">¥${allTatol.toFixed(2)}</span>
                        </span>
                     </nav>`;
            var $nav = $("#main .allTatol");
            $nav.replaceWith(navhtml);
            var $theadBtn = $("table#cart>thead>tr>th>span:nth-child(even)");
            var $footBtn = $("#cart-footer>span>span:nth-child(even)");
            var src1 = "images/product_normal.png", src2 = "images/product_true.png";
            //给全选按钮设置是否选中样式
            if (len == res.length && len != 0) {
                $footBtn.prev().attr("src", src2);
                $theadBtn.prev().attr("src", src2);
            } else {
                $footBtn.prev().attr("src", src1);
                $theadBtn.prev().attr("src", src1);
            }
            var $cartCon = $(".container.cartCon");
            $cartCon.empty().html(html);
            $footBtn.siblings("a.delAllCheck").attr("data-checklen", len);
        } else {
            $("#myModal").css({ display: "block", opacity: 1 });
        }
        //console.log("加载完成");
    }
    //loadCart() 结束
    //表格的全选操作
    var $theadBtn = $("table#cart>thead>tr>th>span:nth-child(even)");
    var $footBtn = $("#cart-footer>span>span:nth-child(even)");
    var $cartCon = $(".container.cartCon");
    //头部全选
    $("#cart>thead").on("click", "span.all,img.all", function () {
        var $img = $(this).parent().children("img:eq(0)");
        (async function () {
            var res = await $.ajax({
                url: "http://localhost:3000/users/islogin",
                type: "get",
                dataType: "json"
            });
            if (res.ok == 0) {
                alert("未登录");
                return;

            }
            is_checked($img);
        })();
    });
    //底部全选按钮，删除
    $("#cart-footer").on("click", "span.all,img.all,a.del_checked,a.delAllCheck", function (e) {
        e.preventDefault();
        var $btn = $(this);
        (async function () {
            var res = await $.ajax({
                url: "http://localhost:3000/users/islogin",
                type: "get",
                dataType: "json"
            });
            if (res.ok == 0) {
                alert("未登录");
                return;

            }
            if ($btn.is("span.all,img.all")) {
                var $img = $btn.parent().children("img:eq(0)");
                is_checked($img);
                //删除选中项
            } else if ($btn.is("a.delAllCheck")) {

                var len = $btn.attr("data-checklen");
                if (len > 0) {
                    if (confirm("你确定要删除？")) {
                        await $.ajax({
                            url: "http://localhost:3000/cart/delchecked",
                            type: "get",
                        });
                    } else { return; }
                } else {
                    alert("未选中任何项");
                    return;
                }

            }
            loadCart();
        })();
    });

    //单个商品的dom操作
    $("#main").on("click", "img.check,[type=button],a.delete", function (e) {
        e.preventDefault();
        $btn = $(this);
        var iid = $btn.attr("data-iid");
        (async function () {
            var res = await $.ajax({
                url: "http://localhost:3000/users/islogin",
                type: "get",
                dataType: "json"
            });
            if (res.ok == 0) {
                return;
            }
            if ($btn.is("img.check")) {
                var check = 0;
                if ($btn.prop("src").indexOf("normal.png") == -1) {
                    check = 0;
                } else {
                    check = 1;
                }
                await $.ajax({
                    url: "http://localhost:3000/cart/isCheck",
                    type: "get",
                    data: { check, iid },
                    dataType: "json"
                });
            } else {
                if ($btn.is("[type=button]")) {
                    var count = $btn.parent().children("input").val();

                    if ($btn.html() == "+") {
                        count++;
                    } else {
                        if (count > 1) {
                            count--;
                        } else {
                            if (confirm("你确定要删除吗？")) {
                                count = 0;
                            } else {
                                return;
                            }
                        }
                    }
                } else if ($btn.is("a.delete")) {
                    iid = $btn.parent().siblings(":first").find("img").attr("data-iid");
                    if (confirm(`你确定要删除?`)) {
                        count = 0;
                    } else { return; }
                }
                await $.ajax({
                    url: "http://localhost:3000/cart/update",
                    type: "get",
                    data: { iid, count }
                });
            }
            loadCart();//防止外头，有可能在上一个异步函数前，提前加载完
        })();

    }).on("blur", "[type=text]", function () {
        $btn = $(this);
        (async function () {
            var res = await $.ajax({
                url: "http://localhost:3000/users/islogin",
                type: "get",
                dataType: "json"
            });
            if (res.ok == 0) {
                alert("登录过期，请重新登录");
                return;
            }
            var iid = $btn.prev().attr("data-iid"), count;
            var value = $btn.val().trim();
            if (isNaN(value)) {
                $btn.val($btn.attr("data-value"));
                return;
            }
            if (value === "0") {
                if (confirm("你确定要删除吗？")) {
                    count = 0;
                } else {
                    $btn.val($btn.attr("data-value"));
                    return;
                }
            } else if (value !== "") {
                count = $btn.val().trim();
            } else if (value === "") {
                $btn.val($btn.attr("data-value"));
                return;
            }
            await $.ajax({
                url: "http://localhost:3000/cart/update",
                data: { count, iid },
                type: "get"
            });
            loadCart();
        })();

    });
    //封装---全选点击-函数
    function is_checked($img) {
        var check = 0;
        if ($img.prop("src").indexOf("normal.png") == -1) {
            check = 0;
        } else {
            check = 1;
        }
        (async function () {
            //设置 数据库的购物车is_checked
            await $.ajax({
                url: "http://localhost:3000/cart/isCheck",
                type: "get",
                data: { check }//不发送iid过去就是全选
            });
            loadCart();
        })();
    }

})