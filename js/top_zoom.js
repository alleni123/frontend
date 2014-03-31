(function($) {


/**
 *依赖jquery_draggable.js和dialog.js 
 */
	$.fn.imgzoom = function(opts) {

		var setting = $.extend({
			imgSelector : ".click_img",
			imgSrc : "", //显示在前面的图片src
			next : ".img_next",
			img_page : ".img_page", //上一页和下一页点击区域的class
			nextImgSrc : "", //下一页图片src
			prevImgSrc : "", //上一页图片src
			$imgs : null, //$(".click_img")
			index_current : "", // imgs中的index值  setting.imgs.index($(this))
			index_next : "",
			index_prev : "",
			first_img : false, //测试代码， 用于分辨是否是第一个图片和最后一个图片
			last_img : false,
			img_num : "", //图片总数
			zoom_left : ""
		}, opts || {});

		var selector = $(this).selector;
		//	console.log($(this));

		$(document).on("click", setting.img_page, page);

		$(setting.imgSelector).on("click", initZoom);
		function initZoom(e) {
			
		
			
			console.log(1);
			calculateWH($(this));
			console.log(calculateWH($(this)));
			var zoom_img_wh = calculateWH($(this));

			/**
			 *开始窗口适应浏览器代码
			 */
			var w_width = $(window).width();
			var w_height = $(window).height();

			//根据图片宽度和浏览器显示宽度来计算一下图片到左边的距离left.
			//var img_left = w_width / 2 - zoom_img_wh.width / 2;
			var img_left = calculateLeft(w_width, zoom_img_wh.width);
			setting.zoom_left = img_left;

			//var $imgs = $(".click_img");
			var $imgs = $(setting.imgSelector);

			/**
			 *给setting赋值 主要是前后图片的信息
			 */
			setting.$imgs = $imgs;
			setting.img_num = $imgs.length;
			setting.imgSrc = $(this).attr("src");
			var $nextImg = $imgs[$imgs.index($(this)) + 1];
			setting.nextImgSrc = $nextImg == null ? null : $nextImg.getAttribute("src");
			var $prevImg = $imgs[$imgs.index($(this)) - 1];
			setting.prevImgSrc = $prevImg == null ? null : $prevImg.getAttribute("src");
			setting.index_current = setting.$imgs.index($(this));
			setting.index_next = setting.index_current + 1;
			setting.index_prev = setting.index_current - 1;

			//	alert(setting.index_next);//这个有值。

			//	alert($imgs[setting.index_next]==null);//这个是true

			if ($imgs[setting.index_next] == null) {
				setting.nextImgSrc = null;
				setting.prevImgSrc = $imgs[setting.index_prev].src;
				setting.last_img = true;
			} else {
				setting.last_img = false;
			}
			if ($imgs[setting.index_prev] == null) {
				setting.prevImgSrc = null;
				setting.nextImgSrc = $imgs[setting.index_next].src;
				setting.first_img = true;
			} else {
				setting.first_img = false;
			}

			//console.log($imgs[setting.index_next]);//获取img
			//	console.log($imgs[setting.index_next].src);

			//setting.nextImgSrc=$imgs[setting.index_next].src;
			//setting.prevImgSrc=$imgs[setting.index_prev].src;
			//console.log(111);

			//加入图片层
			$("#appendParent").addImgzoom({
				imgSrc : $(this).attr("src"),
				zoomParent : selector,
				imgWidth : zoom_img_wh.width,
				imgHeight : zoom_img_wh.height,
				nextImgSrc : $(this).next().attr("src"),
				prevImgSrc : $(this).prev().attr("src"),
				left : img_left
			});
			$("#imgzoom").drags();

			if ($("#_cover").css("display") == "none") {
				//alert("== ");
				$("#_cover").show();
			} else {
				//alert("show");
				$("#appendParent").addCover();
			}
			
			
				//$("#dialog").dialog({btnSelector:".img_prev",dialog_text:"已经到了最后一页!",confirmBtnClz:"imgzoom_content"});
			

			$("#imgzoom").show();
			return false;
		};

		function page(e) {

			//点击下一页
			if (($(e.target).hasClass("img_next"))) {
				//$("#imgzoom_zoom").attr("src", setting.nextImgSrc);
				if (setting.last_img) {
					$(this).showDialog({dialog_text:"已经到了最后一页!",confirmBtnClz:"imgzoom_content"});			;
					return;
				}

				$("#imgzoom_zoom").attr("src", setting.nextImgSrc);
				setting.nextImgSrc = (setting.index_next + 1) == setting.img_num ? null : setting.$imgs[setting.index_next + 1].src;
				setting.imgSrc = setting.$imgs[setting.index_next].src;
				setting.prevImgSrc = setting.$imgs[setting.index_prev + 1].src;
				setting.index_next = setting.index_next + 1;
				setting.index_prev = setting.index_current;
				setting.index_current = setting.index_next - 1;
				if (setting.$imgs[setting.index_next] == null) {
					setting.last_img = true;
				}
				if (setting.$imgs[setting.index_prev] != null && setting.first_img == true) {
					setting.first_img = false;
				}

				//http://www.javascriptkit.com/dhtmltutors/domattribute.shtml  -> dom getAttribute
				//console.log(setting.$imgs[setting.index_current].getAttribute("w"));
				//console.log(setting.zoom_left);

				var zoom_left = calculateLeft($(window).width(), $(setting.$imgs[setting.index_current]));

				$("#imgzoom").css("left", zoom_left + "px");

			}

			//点击上一页
			if (($(e.target).hasClass("img_prev"))) {
				if (setting.first_img) {
					$(this).showDialog({dialog_text:"前面没有了!",confirmBtnClz:"imgzoom_content"});			;
					return;
				}

				$("#imgzoom_zoom").attr("src", setting.prevImgSrc);
				setting.prevImgSrc = (setting.index_prev - 1) == -1 ? null : setting.$imgs[setting.index_prev - 1].src;
				setting.imgSrc = setting.$imgs[setting.index_prev].src;
				setting.nextImgSrc = setting.$imgs[setting.index_next - 1].src;
				setting.index_next = setting.index_current;
				setting.index_prev = setting.index_prev - 1;
				setting.index_current = setting.index_prev + 1;

				if (setting.$imgs[setting.index_prev] == null) {
					setting.first_img = true;
				}
				if (setting.$imgs[setting.index_next] != null && setting.last_img == true) {
					setting.last_img = false;
				}
				var zoom_left = calculateLeft($(window).width(), $(setting.$imgs[setting.index_current]));

				$("#imgzoom").css("left", zoom_left + "px");
			}

		};

		//如果点击了图片区域以外， 就会去掉图片显示。
		$("body").click(function(e) {
			//如果是分页操作，不执行其它代码。
			if ($(e.target).hasClass("img_page")) {
				e.preventDefault();
				return;
				//这里写成return false的话会导致$(document).on绑定的事件失效。
			}

			if ($(e.target).hasClass('imgclose')) {

				//$("#_cover").hide();
				//$("#imgzoom").hide();

				$("#_cover").remove();
				$("#imgzoom").remove();
				e.preventDefault();
			}

			// if ($(e.target).hasClass('imgzoom_content')) {
			// alert(1);
			// return false;
			// }

			if (($("#_cover").css("display") == "block") && !($(e.target).hasClass('imgzoom_content'))) {

				//$("#_cover").hide();
				//$("#imgzoom").hide();
				$("#_cover").remove();
				$("#imgzoom").remove();
				e.preventDefault();
			}
			//e.preventDefault();
		});

	};

	$.fn.addImgzoom = function(opts) {

		var setting = $.extend({
			imgPath : "#123",
			imgSrc : "",
			imgWidth : "",
			imgHeight : "",
			zoomParent : "#appendParent",
			left : "",
			top : ""
		}, opts || {});
		//alert("src= "+setting.imgSrc);
		//alert("imgleft= "+setting.left);

		var imgzoom = document.createElement("div");
		imgzoom.id = "imgzoom";
		imgzoom.style.position = "fixed";
		imgzoom.style.zIndex = 501;
		imgzoom.style.cursor = "move";
		//imgzoom.style.top = "100px";
		//imgzoom.style.left = "500px";
		imgzoom.style.left = setting.left + "px";
		imgzoom.style.display = "none";
		
		

		//这里是添加imgzoom div的地方。
		//alert(setting.zoomParent);
		//$("#appendParent").append(imgzoom);
		$(setting.zoomParent).append(imgzoom);
		
		
		/**
		 *添加dialog节点 
		 */
		var dialog=document.createElement("div");
		dialog.id="dialog";
		dialog.className="dialog imgzoom_content";
		dialog.style.display="none";
		dialog.style.Zindex="1000";
		imgzoom.appendChild(dialog);
		

		var zoomlayer = document.createElement("div");
		zoomlayer.id = "imgzoom_zoomlayer";
		zoomlayer.className = "zoominner imgzoom_content";
		//zoomlayer.style.height = "760px";
		imgzoom.appendChild(zoomlayer);
		
		
		
		

		var p = document.createElement("p");
		p.className = "imgzoom_content";
		zoomlayer.appendChild(p);

		var span = document.createElement("span");
		span.className = "y";
		p.appendChild(span);

		var a_ori_img = document.createElement("a");
		a_ori_img.id = "imgzoom_imglink";
		a_ori_img.className = "imglink imgzoom_btn imgzoom_content";
		a_ori_img.target = "_blank";
		a_ori_img.title = "查看大图";
		a_ori_img.href = setting.imgSrc;
		var txt = document.createTextNode("查看大图");
		a_ori_img.appendChild(txt);

		var a_close = document.createElement("a");
		a_close.className = "imgclose imgzoom_btn imgzoom_content";
		a_close.title = "关闭";
		a_close.href = "#";
		var txt = document.createTextNode("关闭");
		a_close.appendChild(txt);

		span.appendChild(a_ori_img);
		span.appendChild(a_close);

		//加入前一页后一页的按钮
		var img_pager = document.createElement("div");
		zoomlayer.appendChild(img_pager);
		var img_prev = document.createElement("div");
		img_prev.className = "img_prev img_page";
		//alert("prev="+setting.imgHeight);
		img_prev.style.height = setting.imgHeight + "px";

		var img_next = document.createElement("div");
		img_next.className = "img_next img_page";
		img_next.style.height = setting.imgHeight + "px";

		zoomlayer.appendChild(img_prev);
		zoomlayer.appendChild(img_next);

		var imgDiv = document.createElement("div");
		imgDiv.id = "imgzoom_img";
		imgDiv.className = "hm imgzoom_content";
		zoomlayer.appendChild(imgDiv);

		var img = document.createElement("img");
		img.id = "imgzoom_zoom";
		//img.src = "roll-02.jpg";
		img.src = setting.imgSrc;
		//img.style.width = "480px";
		if (setting.imgWidth < setting.imgHeight) {
			img.style.width = setting.imgWidth + "px";
		} else {
			img.style.height = setting.imgHeight + "px";
		}
		img.className = "imgzoom_content";
		imgDiv.appendChild(img);

		var img_title = document.createElement("div");
		img_title.className = "imgzoom_title imgzoom_content";
		img_title.appendChild(document.createTextNode("roll-02.jpg"));
		imgDiv.appendChild(img_title);

	};

	$.fn.addCover = function(opt) {
		opt = $.extend({

		}, opt);
		var coverObj = document.createElement("div");
		coverObj.id = "_cover";
		coverObj.style.position = "absolute";
		coverObj.style.zIndex = 500;
		coverObj.style.left = coverObj.style.top = "0px";
		coverObj.style.width = "100%";

		//clientHeight似乎是浏览器所打开的高度，offsetHeight是网页最大高度
		coverObj.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + 'px';
		coverObj.style.backgroundColor = '#000';
		coverObj.style.opacity = 0.5;
		$(this).append(coverObj);

	};

	/**
	 *通过传入图片节点， 计算要适应屏幕的高度和宽度
	 */
	function calculateWH($img) {
		console.log(1);
		console.log($img);
		var w_width = $(window).width();
		var w_height = $(window).height();
		var img_h = $img.attr("h");
		var img_w = $img.attr("w");
		//1.当图片高度大于宽度时，则以高度适应屏幕
		if (img_w < img_h) {
			//1.1当图片高度大于屏幕高度时， 就要缩放图片
			if (img_h > w_height) {
				var old_imgh = img_h;
				img_h = w_height - 20;
				img_w = img_w * (img_h / old_imgh);
				img_w= Math.round((img_w*100)/100);
			}

		}
		//2.当图片宽度大于高度时， 就以宽度来适应屏幕
		else {
			if (img_w > w_width) {
				var old_imgw = img_w;
				img_w = w_width;
				img_h = imgh * (img_w / old_imgw);
				img_h=Math.round((img_h*100)/100);
			}
		}

		var imgWH = new Object();
		imgWH.width = parseFloat(img_w);
		imgWH.height = parseFloat(img_h);

		//根据图片宽度和浏览器显示宽度来计算一下图片到左边的距离left.
		//var img_left = w_width / 2 - img_w / 2;
		return imgWH;
	}

	/**
	 *计算到屏幕左边的距离
	 */
	function calculateLeft(w_width, $img) {
		if ( typeof($img) == "number") {
			return w_width / 2 - $img / 2;
		} else {
			var imgWH = calculateWH($img);
			return w_width / 2 - imgWH.width / 2;
		}
	}

	// function calculateLeft(w_width,zoom_img_width){
	// alert(typeof zoom_img_width);
	// return w_width/2-zoom_img_width/2;
	// }

})(jQuery);

