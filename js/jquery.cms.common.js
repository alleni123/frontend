(function($){
	
	/**
	 * 输入框默认文本以及透明度控制
     * @param {Object} opts
	 */
	$.fn.myInput=function(opts){
		var setting=$.extend({
			opacity:0.5,
			content:"Search.."
		},opts||{});
		
		
		if($(this).val()!=setting.content){
			//alert("input的初始值必须与参数值一致， 参数默认值为'Search..'");
			$(this).val(setting.content);
		}
		
		
		$(this).css("opacity",setting.opacity);
		$(this).focus(function(){
		//	$(this).css("border","none");
			$(this).css("opacity",1);
			if($(this).val()==""||$(this).val()==setting.content){
				$(this).val("");
			}
		});
		
		$(this).focusout(function(){
			if($(this).val()==""){
				$(this).val(setting.content);
				$(this).css("opacity",setting.opacity);
			}
		});
		
		
	};
	
	
})(jQuery);