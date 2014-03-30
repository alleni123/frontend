(function($) {

	var _const = {
		className : {
			DIALOG_CON : "dialog_con",
			DIALOG_BTN : "dialog_btn"
		},
	};

	$.fn.dialog = function(opts) {
		setting = $.extend({
			btnSelector : "", //按了哪个键时触发事件
			dialog_text : "",
			confirmBtnClz : "",

		}, opts || {});

		//初始化dialog框的样式
		$(this).css({
			position : "absolute",
			top : "100px",
			left : "200px",
			height : "90px",
			width : "200px",
			border : "1px solid grey",
			"background-color" : "#fff",
			"text-align" : "center",
			"z-index" : 1000
		});

		$(document).on("click", setting.btnSelector, function() {

			if ($("#dialog").attr("exist") == "false" || $("#dialog").attr("exist") == null) {
				$("#dialog").attr("exist", "true");

				var dialog = $("#dialog")[0];

				var dialog_con = document.createElement("div");
				dialog_con.className = _const.className.DIALOG_CON;
				dialog_con.style.marginTop = "15px";
				dialog.appendChild(dialog_con);

				var p = document.createElement("p");

				p.appendChild(document.createTextNode(setting.dialog_text));
				dialog_con.appendChild(p);
				var btn = document.createElement("input");
				btn.setAttribute("type", "button");
				btn.setAttribute("value", "确定");

				btn.style.marginTop = "15px";
				btn.className = _const.className.DIALOG_BTN + " " + setting.confirmBtnClz;
				dialog.appendChild(btn);

				//$("#content")[0].appendChild(dialog);
				$("#dialog").css("display", "block");
			} else {
				$("#dialog").css("display", "block");
			}
		});

		$(document).on("click", ".dialog_btn", function(e) {

			if ($("#dialog").css("display") == "block") {
				$("#dialog").hide();
				e.preventDefault();
			}
		});

	};

	$.fn.showDialog = function(opts) {
		setting = $.extend({
			btnSelector : "", //按了哪个键时触发事件
			dialog_text : "",
			confirmBtnClz : "",

		}, opts || {});
		//初始化dialog框的样式
		$("#dialog").css({
			position : "absolute",
			top : "100px",
			left : "200px",
			height : "90px",
			width : "200px",
			border : "1px solid grey",
			"background-color" : "#fff",
			"text-align" : "center",
			"z-index" : 1000
		});

		if ($("#dialog").attr("exist") == "false" || $("#dialog").attr("exist") == null) {
			$("#dialog").attr("exist", "true");

			var dialog = $("#dialog")[0];

			var dialog_con = document.createElement("div");
			dialog_con.className = _const.className.DIALOG_CON;
			dialog_con.style.marginTop = "15px";
			dialog.appendChild(dialog_con);

			var p = document.createElement("p");

			p.appendChild(document.createTextNode(setting.dialog_text));
			dialog_con.appendChild(p);
			var btn = document.createElement("input");
			btn.setAttribute("type", "button");
			btn.setAttribute("value", "确定");

			btn.style.marginTop = "15px";
			btn.className = _const.className.DIALOG_BTN + " " + setting.confirmBtnClz;
			dialog.appendChild(btn);

			//$("#content")[0].appendChild(dialog);
			$("#dialog").css("display", "block");
		} else {
			$("#dialog").css("display", "block");
		}

		$(document).on("click", ".dialog_btn", function(e) {

			if ($("#dialog").css("display") == "block") {
				$("#dialog *").remove();
				$("#dialog").hide();
				$("#dialog").attr("exist","false");
				e.preventDefault();
			}
		});
	};

})(jQuery);
