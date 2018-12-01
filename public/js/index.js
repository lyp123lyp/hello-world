// 顶部的轮播图
$(function () {
	var sliderwrap = $(".banner .slider-wrap");
	var slidera = $(".header .banner .slider-tab a");
	var aindex = 0;
	sliderwrap.find("li").css({
		width: 100 / 7 + "%",
	});
	hdstart(aindex, sliderwrap, slidera);
	function hdstart(num, sliderw, slide) {
		var index = 0, aindexs = num;
		var sliderwrap = sliderw, slidera = slide;

		var hdtimer = setInterval(function () {
			index += 1;
			aindexs++;
			sliderwrap.stop().animate({
				left: -(aindexs + 1) * 100 + "%",
			}, 600, function () {
				if (aindexs > slidera.length - 1) {
					aindexs = 0;
					slidera.eq(aindexs).addClass('active')
						.siblings().removeClass('active');
					sliderwrap.css({
						left: "-100%",
					});
				}
				if (index == 50) {//定时器一直没有关，影响程序运行
					clearInterval(hdtimer);
					hdstart(0, sliderwrap, slidera);
				}
			});
			slidera.eq(aindexs).addClass('active')
				.siblings(true).removeClass('active');
		}, 3000);
		var timer2 = null;
		slidera.hover(function () {
			clearInterval(hdtimer);
			clearTimeout(timer2);
			var aindex = $(this).index();
			sliderwrap.stop().animate({
				left: -(aindex + 1) * 100 + "%",
			}, 600, function () {
			});
			$(this).addClass('active')
				.siblings().removeClass('active');
		}, function () {
			var aindex = $(this).index();
			timer2 = setTimeout(() => {
				hdstart(aindex, sliderwrap, slidera);
			}, 400);

		});
	}
	// 轮播图上面的图片遮罩层

	$(".banner .hotwrap a").hover(function () {

		$(this).find("span").css({
			opacity: 0.2,
		});
	}, function () {
		$(this).find("span").css({
			opacity: 0,
		});
	});
	// 商城公告右边的够划算
	$(".recom-notice .recom a").hover(function () {
		$(this).addClass("active")
			.parent().siblings()
			.find("a").removeClass('active');
	});
	// F1 绿色餐桌，轮播图下面样品的白色遮罩
	//创建节点
	var $wDiv = $("<div class='imgOverlay'></div>");
	$(".lf-prolist .p-img a").hover(function () {
		$wDiv.css({
			opacity: 0.3
		});
		$(this).css({
			position: "relative",
		}).append($wDiv);
	}, function () {
		$wDiv.css({
			opacity: 0
		})
	});
	// F1 绿色餐桌，轮播图
	var $tsul = $(".f1 .toppro.slider ul.clearfix");
	var $tsa = $(".f1 .toppro.slider .sliderto >a");
	var $tsas = $(".f1 .toppro.slider .sliderto >a >span");

	tsstart($tsa, 0, 0, $tsul, $tsas);
	//F2 的轮播调用
	var $f2ul = $(".f2 .toppro.slider ul.clearfix");
	var $f2a = $(".f2 .toppro.slider .sliderto >a");
	var $f2as = $(".f2 .toppro.slider .sliderto >a >span");
	tsstart($f2a, 0, 0, $f2ul, $f2as);
	function tsstart(tsa, idx, tsidx, $tl, $ts) {
		var index = idx, tsindex1 = tsidx, $tsa = tsa;
		var $tsul = $tl, $tsas = $ts;
		var tstimer = setInterval(function () {
			tsindex1++;
			index++
			if (index == $tsa.length) {
				index = 0;
			}
			$_tsul($tsul, tsindex1);
			if (tsindex1 == $tsa.length) {//轮播完成之后再去修改当前的值
				tsindex1 = 0;
			}
			$_tsa($tsa, index);
		}, 3000);
		var timer2 = null;
		$tsa.mouseenter(function () {
			clearInterval(tstimer);
			clearTimeout(timer2);
			var ts1 = $(this).index();
			var ts0 = $(this).index();
			$_tsul($tsul, ts1);
			$_tsa($tsa, ts0);
		}).mouseleave(function () {
			var ts1 = $(this).index();
			var ts0 = $(this).index();
			timer2 = setTimeout(() => {
				tsstart($tsa, ts0, ts1, $tsul, $tsas);
			}, 600);

		});
	}

	// F1 轮播图绿色滑动标签的封装
	function $_tsa($tsa, index) {
		$tsa.eq(index).find("span").addClass('active').animate({
			width: "100%"
		}, 600);
		$tsa.eq(index).siblings().find("span")
			.removeClass("active").css({
				width: 0
			});
	}
	// F1 轮播图滑动的封装,$_tsul(tsindex)有参数有时候影响效果。
	function $_tsul($tsul, tsidx) {
		var index1 = tsidx;
		$tsul.stop().animate({
			left: -395 * index1,
		}, 600, function () {
			if (index1 > 2) {
				$tsul.css({
					left: 0
				})
			}
		});

	}
	// 商城社区的左边轮播图
	var $recom = $(".shopclt  .slider  .recommend");
	var $tabcir = $(".shopclt  .slider  .tabcircle a");
	var shopidxs = 0;
	recom(shopidxs);
	function recom(shopidx) {
		recomtimer = setInterval(function () {
			shopidx++;
			$recom.stop().animate({
				left: -(shopidx + 1) * 100 + "%",
			}, 600, function () {
				if (shopidx == $tabcir.length) {
					$recom.css({
						left: "-100%"
					});
					shopidx = 0;
				}
			})
			setTimeout(function () {
				$tabcir.eq(shopidx).addClass("on")
					.siblings().removeClass("on");
			}, 700);
		}, 3000);
	}
	// tab切换图片
	$tabcir.hover(function () {
		clearInterval(recomtimer);
		shopidxs = $(this).index();
		$recom.stop().animate({
			left: -(shopidxs + 1) * 100 + "%",
		}, 600, function () {
			if (shopidxs == $tabcir.length) {
				$recom.css({
					left: "-100%"
				});
				shopidxs = 0;
			}
		});
		$(this).addClass("on")
			.siblings().removeClass("on");
	}, function () {
		recom(shopidxs);
	})
	// 商城社区的轮播图向上滚动
	var $recom2 = $(".shopccr  .hotok  .recommend");
	var $tabcir2 = $(".shopccr  .hotok  .tabcircle a");
	var shopidxs2 = 0;
	recom2(shopidxs);
	function recom2(shopidx) {
		recomtimer2 = setInterval(function () {
			shopidx++;
			$recom2.stop().animate({
				top: -(shopidx + 1) * 100 + "%",
			}, 600, function () {
				if (shopidx == $tabcir.length) {
					$recom2.css({
						top: "-100%"
					});
					shopidx = 0;
				}
			})
			setTimeout(function () {
				$tabcir2.eq(shopidx).addClass("on")
					.siblings().removeClass("on");
			}, 700);
		}, 3000);
	}
	// tab切换图片
	$tabcir2.hover(function () {
		clearInterval(recomtimer2);
		shopidxs2 = $(this).index();
		$recom2.stop().animate({
			top: -(shopidxs2 + 1) * 100 + "%",
		}, 600, function () {
			if (shopidxs2 == $tabcir2.length) {
				$recom.css({
					top: "-100%"
				});
				shopidxs2 = 0;
			}
		});
		$(this).addClass("on")
			.siblings().removeClass("on");
	}, function () {
		recom2(shopidxs2);
	});
	// 友情链接的tab切换
	var namelist = $(".friendlink  #nameList");
	var tabcontent = $(".friendlink #tabcontent");
	namelist.children().mouseover(function () {
		var index = $(this).index();
		console.log(2);
		$(this).addClass("active").siblings().removeClass("active");
		tabcontent.children().eq(index).show().siblings().hide();
	})
})