var LANGUAGE_Index = "zh";  //标识语言
jQuery(document).ready(function(){
	//alert("页面加载时调用的方法");
	LANGUAGE_Index = jQuery.i18n.normaliseLanguageCode({}); //获取浏览器的语言
	//loadProperties(LANGUAGE_Index);
});

function loadProperties(type){
	jQuery.i18n.properties({
		name:"strings",  //资源文件名称
		path:"./",  //资源文件所在目录路径
		mode:'map',  //模式：变量或Map
		language:type,  //对应的语言
		cache:false,
		encoding:'UTF-8',
		callback:function(){
			//$('.test').val($.i18n.prop('test'));
			
		}
	});
}