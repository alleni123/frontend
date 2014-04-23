(function($) {

	/**
	 *依赖jquery_draggable.js和dialog.js
	 * version 2  按照ztree的格式重新做
	 */

	var settings = {}, _consts = {
		cover_index : 500
	}, backup_setting = {

	},

	// default setting
	_setting = {
		imgSelector : ".click_img",

		/**
		 *  4/4 感觉不需要imgSrc了。 因为根据项目需求，
		 */
		imgSrc : null,
		zoomsrc : null,
		fullsrc : null,

		//next:".img_next",
		img_page : ".img_page", //上一页和下一页点击区域的class
		img_close : ".img_close",
		//nextImgSrc : "", 下一页图片src
		//prevImgSrc : "", 上一页图片src
		//好像不需要nextImgSrc和prevImgSrc，切图的时候只要用index调用就行了。
		$imgs : null, //$(".click_img")
		img_num : null, //图片总数
		index_current : null, // imgs中的index值  setting.imgs.index($(this))
		// index_next : null,
		// index_prev : null,
		first_img : false, //测试代码， 用于分辨是否是第一个图片和最后一个图片
		last_img : false,

		left : null,
		top : null,

		c_width : null,
		c_height : null,

		calculatedWH : null, //通过calculateWH计算出来的数值。

		initialized : false //测试代码， 用于判断图层是否已经被加入appendParent

	},

	//method of operate data
	data = {
		/**
		 * 通过传入图片节点，计算要适应屏幕的高度和宽度
		 * @param {Object} $img
		 */
		calculateWH : function($img) {
			console.log("cauclateWH");
			console.log($img);
			var client_h = _setting.c_height;
			var client_w = _setting.c_width;

			var img_h = $img.attr("h");
			var img_w = $img.attr("w");

			//1.当图片高度大于宽度时，则以高度适应屏幕
			if (img_w < img_h) {
				//1.1当图片高度大于屏幕高度时， 就要缩放图片
				if (img_h > client_h) {
					var old_imgh = img_h;
					img_h = client_h - 20;
					img_w = img_w * (img_h / old_imgh);
					img_w = Math.round((img_w * 100) / 100);
				}

			}
			//2.当图片宽度大于高度时， 就以宽度来适应屏幕
			else {
				if (img_w > client_w) {
					var old_imgw = img_w;
					img_w = client_w;
					img_h = imgh * (img_w / old_imgw);
					img_h = Math.round((img_h * 100) / 100);
				}
			}

			var imgWH = new Object();
			imgWH.width = parseFloat(img_w);
			imgWH.height = parseFloat(img_h);

			//根据图片宽度和浏览器显示宽度来计算一下图片到左边的距离left.
			//var img_left = w_width / 2 - img_w / 2;
			return imgWH;
		},

		/**
		 * 计算到屏幕左边的距离
		 * @param {Object} w_wdith
		 * @param {Object} $img 可以是图片宽度
		 */
		calculateLeft : function(c_width, $img) {
			if ( typeof ($img) == "number") {
				return c_width / 2 - $img / 2;
			} else {
				var imgWH = data.calculateWH($img);
				return c_width / 2 - imgWH.width / 2;
			}
		},

		/**
		 *
		 * @param {Object} c_height
		 * @param {Object} $img 可以是图片高度
		 */
		calculateTop : function(c_height, $img) {
			var h;
			if ( typeof ($img) == "number") {
				h = $img;

			} else {
				h = data.calculateWH($img).height;
			}
			return c_height > (h + 35) ? (c_height - (h + 35)) / 2 : 0;
		},

		/**
		 * 获取作为原图链接的src。
		 * 如果没有设定fullsrc，就使用zoomsrc, 没有zoomsrc, 就使用imgSrc,也就是dom节点的src
		 */
		getFullsrc : function() {
			return _setting.fullsrc == null ? (_setting.zoomsrc == null ? _setting.imgSrc : _setting.zoomsrc) : _setting.fullsrc;
		},

		/**
		 * 获取作为zoom图片的src
		 * 如果imgzoom没有设定， 就使用imgSrc。
		 */
		getZoomsrc : function() {
			return _setting.zoomsrc == null ? _setting.imgSrc : _setting.zoomsrc;
		},

		/**
		 *点击图片的时候才会设置到_setting的数据
		 */
		loadImgData : function() {

		},

		/**
		 *加载JLzoom时就要获取的数据。
		 */
		initData : function(target) {

			console.log("initData");
			console.log(target);
			// console.log(setting);
			// return setting;
			
			
			_setting.c_height = document.body.clientHeight;
			_setting.c_width = document.body.clientWidth;

			var zoom_img_wh = data.calculateWH($(target));

			console.log(zoom_img_wh.width);
			_setting.calculatedWH = zoom_img_wh;

			_setting.left = data.calculateLeft(_setting.c_width, zoom_img_wh.width);
			_setting.top = data.calculateTop(_setting.c_height, zoom_img_wh.height);
			
			/**
			 * 给_setting赋值， 主要是前后图片的信息
			 */
			_setting.$imgs = $(_setting.imgSelector);
			console.log("imgs= ");
			console.log(_setting.$imgs);
			_setting.img_num = _setting.$imgs.length;
			_setting.imgSrc=target.getAttribute("src");
			_setting.zoomsrc = target.getAttribute("zoomsrc")==null?target.getAttribute("src"):target.getAttribute("zoomsrc");
			_setting.fullsrc = target.getAttribute("fullsrc")==null?(_setting.zoomsrc==null?_setting_imgSrc:_setting.zoomsrc):target.getAttribute("fullsrc");
			
			console.log(_setting.imgSrc);

			/**
			 *这些似乎全都不需要了， 只需要获取目标文件的索引值，以及整个img class的对象集合
			 */
			// var $nextImg = _setting.$imgs[_setting.$imgs.index($(target)) + 1];
			// _setting.nextImgSrc = $nextImg == null ? null : $nextImg.getAttribute("src");
			// var $prevImg = _setting.$imgs[_setting.$imgs.index($(target)) - 1];
			// _setting.prevImgSrc = $prevImg == null ? null : $prevImg.getAttribute("src");
			_setting.index_current = _setting.$imgs.index($(target));
			console.log("==index");
			console.log(_setting.index_current);
			console.log("_setting.img_num= " + _setting.img_num);
			// _setting.index_next = (_setting.index_current + 1) == _setting.img_num ? null : (_setting.index_current + 1);
			// _setting.index_prev = (_setting.index_current - 1) < 0 ? null : (_setting.index_current - 1);
			// console.log(_setting.index_next);
			// console.log(_setting.index_prev);

			//console.log($nextImg);
			
			
			_setting.first_img = _setting.index_current==0?true:false;
			_setting.last_img= ((_setting.index_current+1)==_setting.img_num)?true:false;
			

		}
	}, 
	
	event = {
		bindEvent : function() {
			console.log("bindEvent");
			$(document).on("click", _setting.img_page, view.page);
			
			 
			
			$(_setting.imgSelector).on("click", view.initZoom);
			 
			$("body").on("click", view.removeJLzoom);
				
			$(document).on("click", ".imgclose", view.removeJLzoom);
			
			$(document).on("mouseover",".img_page",view.addOpacity);
			$(document).on("mouseout",".img_page",view.removeOpacity);
			
			//$("body").on("click", view.removeZoom).on("click", view.removeCover);

			//console.log($(setting.imgSelector).selector);
			// $(document).on("click",setting.img_page,function(){alert("page");});
			// $("body").on("click",function(){alert("page");});
			//$(body).click()
		},
		bindRemoveEvent : function(setting) {
			$("body").on("click", view.removeZoom);
		} 
		 
	}, 
	
	tools = {
		isEmptyObject : function(obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					return false;
				}
			}
			return true;
		},

		clone : function(obj) {
			if (obj == null)
				return null;
			//var o=tools.isArray(obj)?[]:{};
			var o = {};
			for (var i in obj) {
				o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : ( typeof obj[i] === "object" ? arguments.callee(obj[i]) : obj[i]);
			}
			return o;
		}
	},

	//method of operate jlzoom dom
	view = {

		//初始化视图这里会先调用初始化数据data
		initZoom : function(e) {
			//这里的setting是jQuery的Event对象。 然后setting.data里面的才是我们传递的对象
			console.log("initZoom");
			console.log(e);

			data.initData(e.target);

			if ($("#_cover").css("display") == "none") {
				$("#_cover").show();
			} else {
				//setting.parentObj.addCover();
				view.addCover(_setting);
			}

			//view.addCover(_s);

			view.addImgzoom();

			_setting.initialized = true;
		},
		addCover : function(setting) {
			console.log("addCover");
			console.log(setting);

			var coverObj = document.createElement("div");
			coverObj.id = "_cover";
			coverObj.style.position = "absolute";
			coverObj.style.zIndex = 500;
			coverObj.style.left = coverObj.style.top = "0px";
			coverObj.style.width = "100%";

			//clientHeight似乎是浏览器所打开的高度，offsetHeight是网页最大高度
			//coverObj.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + 'px';
			 var height=Math.max($(document).height(), $(window).height());
			 coverObj.style.height=height+"px";
			coverObj.style.backgroundColor = '#000';
			coverObj.style.opacity = 0.5;
			//console.log(setting.parentObj);
			$("#" + _setting.parentId).append(coverObj);

		},
		addImgzoom : function() {
			console.log("addimgzoom");
			console.log();
			//$("#imgzoom").drags();

			var imgzoom = document.createElement("div");
			imgzoom.id = "imgzoom";
			imgzoom.style.position = "fixed";
			imgzoom.style.zIndex = 501;
			imgzoom.style.cursor = "move";
			imgzoom.style.top = _setting.top + "px";
			imgzoom.style.left = _setting.left + "px";
			imgzoom.style.display = "block";
			$("#" + _setting.parentId).append(imgzoom);
			
			//放这里似乎不太好。 
			$("#imgzoom").drags();
			
			/**
			 *添加dialog节点
			 */
			var dialog = document.createElement("div");
			dialog.id = "dialog";
			dialog.className = "dialog imgzoom_content";
			dialog.style.display = "none";
			dialog.style.Zindex = "1000";
			imgzoom.appendChild(dialog);

			var zoomlayer = document.createElement("div");
			zoomlayer.id = "imgzoom_zoomlayer";
			zoomlayer.className = "zoominner imgzoom_content";
			//zoomlayer.style.height = "760px";
			imgzoom.appendChild(zoomlayer);



			//这个p应该是固定的高度
			var p = document.createElement("p");
			p.className = "imgzoom_content imgzoom_btn";
			
			zoomlayer.appendChild(p);
			
			
			
			var span = document.createElement("span");
			span.style.float="right";
			span.className = "y";
			p.appendChild(span);

			var a_ori_img = document.createElement("a");
		//	a_ori_img.style.float="left";
		//	a_ori_img.style.position="absolute";
			a_ori_img.id = "imgzoom_imglink";
			a_ori_img.className = "imglink imgzoom_btn imgzoom_content";
			a_ori_img.target = "_blank";
			a_ori_img.title = "查看大图";
			//alert(_setting.fullsrc);
			a_ori_img.href = data.getFullsrc();
			var txt = document.createTextNode("查看大图");
			a_ori_img.appendChild(txt);

			var a_close = document.createElement("a");
		//	a_close.style.float="left";
		//	a_close.style.position="absolute";
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
			img_prev.id="img_prev";
			//alert("prev="+_setting.imgHeight);
			img_prev.style.height = _setting.calculatedWH.height + "px";
			//加入左翻页的按钮
			var img_prev_pointer=document.createElement("div");
			img_prev_pointer.id="leftpointer";
			img_prev_pointer.className="imgzoom_content img_prev img_pointer";
			img_prev_pointer.style.top= _setting.calculatedWH.height/2.4 + "px";
			//img_prev_pointer.style.left="-8px";
			img_prev.appendChild(img_prev_pointer);
			
			

			var img_next = document.createElement("div");
			img_next.className = "img_next img_page";
			img_next.id="img_next";
			img_next.style.height = _setting.calculatedWH.height + "px";
			//加入右翻页的按钮
			var img_next_pointer=document.createElement("div");
			img_next_pointer.id="rightpointer";
			img_next_pointer.className="imgzoom_content img_next img_pointer";
			img_next_pointer.style.top=_setting.calculatedWH.height/2.4+"px";
			img_next_pointer.style.left="35px";
			img_next.appendChild(img_next_pointer);
			
			
			zoomlayer.appendChild(img_prev);
			zoomlayer.appendChild(img_next);
			
			var imgDiv = document.createElement("div");
			imgDiv.id = "imgzoom_img";
			imgDiv.className = "hm imgzoom_content";
			zoomlayer.appendChild(imgDiv);

			var img = document.createElement("img");
			img.id = "imgzoom_zoom";
			img.src = data.getZoomsrc();
			// if (_setting.imgWidth < _setting.imgHeight) {
			// img.style.width = view_setting.imgWidth + "px";
			// } else {
			// img.style.height = view_setting.imgHeight + "px";
			// }

			if (_setting.calculatedWH.width < _setting.calculatedWH.height) {
				img.style.width = _setting.calculatedWH.width + "px";
				img.style.height="auto";
			} else {
				img.style.height = _setting.calculatedWH.height + "px";
				img.style.width="auto";
			}

			img.className = "imgzoom_content";
			imgDiv.appendChild(img);

			var img_title = document.createElement("div");
			img_title.className = "imgzoom_title imgzoom_content";
			img_title.appendChild(document.createTextNode("roll-02.jpg"));
			imgDiv.appendChild(img_title);

			console.log("addZoom finished");

		},

		page : function(e) {
			console.log("page");
			console.log(e);

			//点击上一页
			if (($(e.target).hasClass("img_prev"))) {
				if (_setting.first_img) {
					$(this).showDialog({
						dialog_text : "前面没有了!",
						confirmBtnClz : "imgzoom_content"
					});
					;
					return;
				}

				// _setting.index_next = _setting.index_current;
				// _setting.index_prev = _setting.index_prev - 1;
				// _setting.index_current = _setting.index_prev + 1;
				_setting.index_current = (_setting.index_current - 1);
				var img = _setting.$imgs[_setting.index_current];
				_setting.imgSrc = img.getAttribute("src");
				_setting.fullsrc = img.getAttribute("fullsrc");
				_setting.zoomsrc = img.getAttribute("zoomsrc");

				/**
				 * 关于zoom这里的条件运算符应该怎么写 ，我觉得如果客户没有写zoomsrc, 那就也不会写fullsrc..那就是三个src都是imgsrc.
				 */
				$("#imgzoom_zoom").attr("src", data.getZoomsrc());
				$("#imgzoom_imglink").attr("href", data.getFullsrc());
				if (_setting.$imgs[_setting.index_current - 1] == null) {
					_setting.first_img = true;
				}
				if (_setting.$imgs[_setting.index_current + 1] != null && _setting.last_img == true) {
					_setting.last_img = false;
				}
				view.resizeZoom();

			}

			//点击下一页
			if (($(e.target).hasClass("img_next"))) {
				//$("#imgzoom_zoom").attr("src", setting.nextImgSrc);
				if (_setting.last_img) {
					$(this).showDialog({
						dialog_text : "已经到了最后一页!",
						confirmBtnClz : "imgzoom_content"
					});
					;
					return;
				}

				//	$("#imgzoom_zoom").attr("src", _setting.nextImgSrc);
				//	_setting.nextImgSrc = (_setting.index_next + 1) == _setting.img_num ? null : _setting.$imgs[_setting.index_next + 1].getAttribute("src");

				//	_setting.prevImgSrc = _setting.$imgs[_setting.index_prev + 1].getAttribute("src");

				//_setting.index_next = _setting.index_next + 1;
				//_setting.index_prev = _setting.index_current;
				//_setting.index_current = _setting.index_next - 1;
				//上面三个想改成下面的
				_setting.index_current = _setting.index_current + 1;
				//下面的还要改
				// if (_setting.$imgs[_setting.index_next] == null) {
				// _setting.last_img = true;
				// }
				// if (_setting.$imgs[_setting.index_prev] != null && _setting.first_img == true) {
				// _setting.first_img = false;
				// }
				console.log("pagenext");
				var img = _setting.$imgs[_setting.index_current];
				_setting.imgSrc = img.getAttribute("src");
				_setting.fullsrc = img.getAttribute("fullsrc");
				_setting.zoomsrc = img.getAttribute("zoomsrc");
				$("#imgzoom_imglink").attr("href", data.getFullsrc());
				$("#imgzoom_zoom").attr("src", data.getZoomsrc());
				if (_setting.$imgs[_setting.index_current + 1] == null) {
					_setting.last_img = true;
				}
				if (_setting.$imgs[_setting.index_current - 1] != null && _setting.first_img == true) {
					_setting.first_img = false;
				}

				//http://www.javascriptkit.com/dhtmltutors/domattribute.shtml  -> dom getAttribute
				//console.log(_setting.$imgs[_setting.index_current].getAttribute("w"));
				//console.log(_setting.zoom_left);

				view.resizeZoom();

			}

		},

		resizeZoom : function() {
			/*
			* 重新计算到边框的距离
			*/
			//var zoom_left = data.calculateLeft($(window)[0].innerWidth, $(_setting.$imgs[_setting.index_current]));
			var left = data.calculateLeft(document.body.clientWidth, $(_setting.$imgs[_setting.index_current]));

			$("#imgzoom").css("left", left + "px");
			var top = data.calculateTop(document.body.clientHeight, $(_setting.$imgs[_setting.index_current]));
			$("#imgzoom").css("top", top + "px");

			$(".img_title").html("hello world");
			//alert($(_setting.$imgs[_setting.index_current]).css("height"));
			//console.log($(_setting.$imgs[_setting.index_current]));
			var zoom_img_wh = data.calculateWH($(_setting.$imgs[_setting.index_current]));

			//imgzoom_zoom是图片
			$("#imgzoom_zoom").css("width", zoom_img_wh.width);
			$("#imgzoom_zoom").css("height", zoom_img_wh.height);
			
			//$("#img_prev").css("height", zoom_img_wh.height);
			//$("#img_next").css("height", zoom_img_wh.height);
			$(".img_page").css("height",zoom_img_wh.height);
			
			$(".img_pointer").css("top",zoom_img_wh.height/2.4);
		},

		/**
		 *  删除JLzoom的时候，要先检查鼠标点的是不是图片区域。
		 */
		removeJLzoom : function(e) {

			// data.destory()?/

			console.log("removeJLzoom");
			var sel = _setting.imgSelector.substring(1);
			var page = _setting.img_page.substring(1);
			var close = _setting.img_close.substring(1);
			if (!($(e.target).hasClass(sel) || $(e.target).hasClass(page) || $(e.target).hasClass("imgzoom_content"))) {

				view.destroy();

			}

			if ($(e.target).hasClass("imgclose")) {

				view.destroy();
			}

			//	e.preventDefault();

		},

		removeZoom : function(e) {

			$("#imgzoom").remove();

		},
		removeCover : function(e) {

			$("#_cover").remove();

		},
		
		addOpacity:function(e){
			$(".img_page").css("opacity","0.5");
		},
		
		removeOpacity:function(e){
			$(".img_page").css("opacity","0");
		},

		destroy : function() {
			console.log("destory");
			console.log(backup_setting);
			_setting = tools.clone(backup_setting);
			view.removeCover();
			view.removeZoom();

			console.log(_setting);
		}
	};

	$.fn.JLzoom = {
		_jl : {
			//tools : tools,
			view : view,
			data : data
		},

		init : function(obj, jlSetting) {
			console.log("init started");
			//	var setting = _setting;

			$.extend(true, _setting, jlSetting);
			console.log(_setting);
			console.log(obj);
			_setting.parentId = obj.attr("id");
			//_setting.parentObj = obj; 这个obj会影响到clone。 会循环对象下所有元素，造成内存溢出
			obj.empty();
			//_setting.parentObj.empty();
			//这个empty应该是jquery的方法。
			settings[_setting.treeId] = _setting;

			if (tools.isEmptyObject(backup_setting)) {
				backup_setting = tools.clone(_setting);
			}

			//看看先
		
			event.bindEvent();
			//data.initData(setting);

			//view.addImgzoom(setting);

			// $("body").click(function(){
			// view.removeZoom();
			// });
			console.log("init finished");
		}
	};

})(jQuery);

