$(document).ready(function(e){
	/*a关闭*/
	$('.j-aCloseDiv').find('.a-close').on('click',function(){$(this).parent().slideUp(300);});

	/*分类导航*/
	if($('.j-extendCate').hasClass('dis-n')){
		$('.j-allCate').on('mouseenter',function(){
			$(this).find('.catetit').addClass('hover');
			$(this).find('.j-extendCate').show();
			$(this).find('.cct-sylink').show();
		}).on('mouseleave',function(){
			$(this).find('.catetit').removeClass('hover');
			$(this).find('.j-extendCate').hide();
			$(this).find('.cct-sylink').hide();
		});
	}	
	$.fn.extendCate=function(){
		$.each(this,function(){
			var timer1=null,timer2=null,flag=false;
			$(this).on("mouseenter",function(){
				if(flag){
					clearTimeout(timer2);
				}else{
					var _this=$(this);
					timer1=setTimeout(function(){
						if(parseInt(_this.find(".catetwo").css("left"))==200){
							_this.find('.cateone').addClass('hover');
							_this.find(".catetwo").fadeIn(100).stop(true,true).animate({"left":210},100,function(){
								$(".catetwo").css("left",210);
							});
						}else{
							_this.find('.cateone').addClass('hover');
							_this.find(".catetwo").show();
						}
						flag=true;
					},100);
				}
			}).on("mouseleave",function(){
				if(flag){
					var _this=$(this);
					timer2=setTimeout(function(){
						_this.find(".catetwo").hide();
						_this.find('.cateone').removeClass('hover');
						flag=false;
					},150);
				}else{
					clearTimeout(timer1);
				}
			});
		});
	}
	$(".j-extendCate li").extendCate();
	$(".j-extendCate").on("mouseleave",function(){
		$(this).find('.cateone').removeClass('hover');
		$(this).find('.catetwo').css("left",200).hide();
	});
	/*商品鼠标on*/
	$("[data-toggle='on']").children('li').hover(function(){$(this).addClass('on');},function(){$(this).removeClass('on');});
	$("[data-toggle='hover']").children('li').hover(function(){$(this).addClass('hover');},function(){$(this).removeClass('hover');});
	/*筛选*/
	var btn='<span class="more">+ 展开</span>';
	var $cvalueTab=$('.wrap-select .goods-attrs .cvalue');
	$cvalueTab.filter(function(){if($(this).height()>34){return true;}}).addClass('s-more').parent().append(btn);
	var $cMore=$('.wrap-select .goods-attrs .more'),cvalueheight=$cvalueTab.height();
	$cMore.toggle(function(){
		$(this).text("- 收起");var caheight=$(this).siblings('.cvalue').css('height','auto').height();
		$(this).siblings('.cvalue').height(cvalueheight).animate({height:caheight});
	},function(){$(this).text("+ 展开");$(this).siblings('.cvalue').animate({height:cvalueheight});});
	$(".js-moreAttrs").find("p").toggle(function(){
		$(this).text("收起").append("<i class='c-icon ico-mbup'></i>");
		if($("[data-toggle='dis']").is(":hidden")){$("[data-toggle='dis']").show()};
	},function(){
		$(this).text("更多选项").append("<i class='c-icon ico-mbdn'></i>");
		$("[data-toggle='dis']").hide();
	});
	/*左侧分类*/
	$("[data-toggle='nav']").click(function(){if(!$(this).parent().hasClass('active')){$(this).parent().addClass('active');$(this).siblings().slideDown();}else{$(this).parent().removeClass('active');$(this).siblings().slideUp();}});
	/*首页推荐商品*/
	$('.j-hotTab').on('mouseenter','li',isSliding=false,function(){
		var self=this;
		var isCurrent=$(this).hasClass('on');
		if(isCurrent)return;
		var current=$('.j-hotTab').find('li.on');
		if(isSliding)return;
		isSliding=true;
		$.when($(current).stop(true,false).animate({width:'165px'},300),$(current).find('img').stop(true,false).animate({left:'0'},300),$(self).stop(true,false).animate({width:'290px'},300),$(this).find('img').stop(true,false).animate({left:'-165px'},300)).done(function(){
			$(self).addClass('on');
			$(current).removeClass('on');
			isSliding=false;
		});
	});
	/*养生底部专题*/
	$('.j-topicsTab').on('mouseenter','li',isSliding=false,function(){
		var self=this;
		var isCurrent=$(this).hasClass('on');
		if(isCurrent)return;
		var current=$('.j-topicsTab').find('li.on');
		if(isSliding)return;
		isSliding=true;
		$.when($(current).stop(true,false).animate({width:'200px'},300),$(current).find('img').stop(true,false).animate({left:'0'},300),$(self).stop(true,false).animate({width:'400px'},300),$(this).find('img').stop(true,false).animate({left:'-200px'},300)).done(function(){
			$(self).addClass('on');
			$(current).removeClass('on');
			isSliding=false;
		});
	});
	/*右侧悬浮*/
	$(window).scroll(function(){
		var rtscrollTop = $(window).scrollTop();
		if(rtscrollTop > 500){
			$(".js-rtftBar").fadeIn();
		}else{
			$(".js-rtftBar").fadeOut();
		}
	});
	$('.js-svr-sh a').hover(function(){$(this).siblings('p').show();},function(){$(this).siblings('p').hide();});
	$('.js-svr-top').click(function(){$("html,body").stop(true,true).animate({scrollTop:$("html,body").offset().top},800);});
	/*友链*/
	$("[data-toggle='fl-tab']").mouseenter(function(){
		$(this).parent().addClass("on").siblings().removeClass("on");
		var href =$(this).attr("href");
		$(href).show().siblings().hide();
	}).click(function(){return false;});	
	var mbtn='<p class="ft-l-m">查看更多<i class="c-icon"></i></p>',$ftlinkTab=$('.j-linkTab');
	$ftlinkTab.filter(function(){if($(this).height()>54){return true;}}).children().addClass('s-more').parent().append(mbtn);
	var $recMore=$('.ft-link .ft-l-m'),curheight=$ftlinkTab.find('ul').height();
	$recMore.toggle(function(){
		$(this).html('收起<i class="c-icon"></i>').addClass('ft-l-re');
		var autoheight=$(this).siblings('.j-linkTab ul').css('height','auto').height();
		$(this).siblings('.j-linkTab ul').height(curheight).stop(true,false).animate({height:autoheight});
	},function(){$(this).html('查看更多<i class="c-icon"></i>').removeClass('ft-l-re');$(this).siblings('.j-linkTab ul').stop(true,false).animate({height:curheight});});
});