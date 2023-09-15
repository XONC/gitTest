function rsInit(url, fileName, appCode, options){
	var res = RS_ConfigParameters("authCode", appCode);
	if(res.code == "0000"){
		kgInit(url, fileName, appCode, options);
	}else{
		alert("设置授权码失败！");
	}
}

function rsInitByBussName(url, fileName, bussName, options){
	var res = RS_ConfigParameters("bussName", bussName);
	if(res.code == "0000"){
		res = RS_GetParameters("authCode");
		if(res.code == "0000"){
			if(res.data.authCode)
				kgInit(url, fileName, res.data.authCode, options);
			else
				kgInit(url, fileName, "", options);
		}else{
			alert("获取授权码失败！");
		}
	}else{
		alert("平台编码错误或不存在！");
	}
}

function kgInit(url, fileName, appCode, options){
	window.afterWebPdfLoad = function () {
		// 不能为127.0.0.1或者localhost，IE9会拒绝访问
		// 相对地址：相对于viewer.html页面的相对地址
		KGPdfViewerWebApp.setUrl(url);
		KGPdfViewerWebApp.stampType = 0;
		KGPdfViewerWebApp.sealType = 'PT';
		KGPdfViewerWebApp.algorithmType = 'SM2';
		if(options.mobile)
			KGPdfViewerWebApp.mobile = options.mobile;
		else
			KGPdfViewerWebApp.mobile = 0;
		if(options.readOnly)
			KGPdfViewerWebApp.readOnly = options.readOnly;
		else
			KGPdfViewerWebApp.readOnly = false;
		if(options.disableDelete)
			KGPdfViewerWebApp.disableDelete = options.disableDelete;
		else
			KGPdfViewerWebApp.disableDelete = false;
		KGPdfViewerWebApp.fileType = 'PDF';
		if(appCode){
			// window.setAppCode(appCode)
			KGPdfViewerWebApp.appCode = appCode;
		}
		KGPdfViewerWebApp.sealOrigin = 1;
		KGPdfViewerWebApp.certOrigin = 1;
		// rsData.WSUrl= 'ws://114.115.214.104:21601';
		// rsData.WSUrl='wss://114.115.214.104:31601'
		rsData.WSUrl='wss://open.591sign.cn/uat/socket'
		KGPdfViewerWebApp.fjrs={
			isFjrs: true, // 必须配置,这个值恒设为 true
			isScanStamp: false, // 扫码签
			isServer: false, // true: 来自服务端，false: 来自客户端
			FJRS_API: FJRS_API,
			RS_WS: RS_WS
		}
		// 文档ID，documentId,
		// 后端盖章、删除、验证时需要通过documentId匹配文档
		KGPdfViewerWebApp.open(fileName);
	};
}

function openPdf(fileName){
	KGPdfViewerWebApp.open(fileName);
}

function keyStamp() {
	KGGetKeySN().then(function(KeySN){
		if(!KeySN)
			alert("请确认是否插入ukey证书！");
		else
			stampFront(1, "", 0, 0, "", 0);
	});
}

function keyStampxy(pages, x, y) {
	KGGetKeySN().then(function(KeySN){
		if(!KeySN)
			alert("请确认是否插入ukey证书！");
		else
			stampFront(2, pages, x, y, "", 0);
	});
}

function keyStamptext(pages, text) {
	KGGetKeySN().then(function(KeySN){
		if(!KeySN)
			alert("请确认是否插入ukey证书！");
		else
			stampFront(3, pages, 0, 0, text, 0);
	});
}

function smStamp() {
	KGGetKeySN().then(function(KeySN){
		if(KeySN)
			alert("请确认ukey证书是否已拔出！");
		else
			stampFront(1, "", 0, 0, "", 1);
	});
}

function smStampxy(pages, x, y) {
	KGGetKeySN().then(function(KeySN){
		if(KeySN)
			alert("请确认ukey证书是否已拔出！");
		else
			stampFront(2, pages, x, y, "", 1);
	});
}

function smStamptext(pages, text) {
	KGGetKeySN().then(function(KeySN){
		if(KeySN)
			alert("请确认ukey证书是否已拔出！");
		else
			stampFront(3, pages, 0, 0, text, 1);
	});
}

function KGGetKeySN(){
	var capability = createCapability();
	var kg_HARD_EXT = new KG_HARD_EXT();
	var nUsbPort = 0;
	Promise.all([kg_HARD_EXT.promise]).then(function(){
   		return kg_HARD_EXT.GetKeySN(nUsbPort);
   	}).then(function(data){
   		capability.resolve(data);
   	});
	return capability.promise;
}

function stampFront(fSealType, pages, x, y, text, isSm){
	KGPdfViewerWebApp.sealOrigin = 1;
	KGPdfViewerWebApp.certOrigin = 1;
	if(isSm){
		KGPdfViewerWebApp.fjrs.isScanStamp =true; // 扫码签
		window.KGPdfViewerWebApp.fjrs.isServer = false;  // true: 来自服务端，false: 来自客户端
		window.KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.init()
		// KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.config.isScanStamp = true;
	} else {
		KGPdfViewerWebApp.fjrs.isScanStamp =false; // 扫码签
		window.KGPdfViewerWebApp.fjrs.isServer = false;  // true: 来自服务端，false: 来自客户端
		window.KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.init()
		// KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.config.isScanStamp = false;
	}
	if(fSealType == 1)
		KGPdfViewerWebApp.stamp();
	else if(fSealType == 2)
		KGPdfViewerWebApp.stampOfXY(pages, x, y);
	else
		KGPdfViewerWebApp.stampOfText(pages, text);
}

var sealType;
var ypages;
var yx;
var yy;
var ytext;

function stampByKeySn(keySn, pwd){
	KGPdfViewerWebApp.sealOrigin = 0;
	KGPdfViewerWebApp.certOrigin = 0;
	KGPdfViewerWebApp.fjrs.isScanStamp =false; // 扫码签
	KGPdfViewerWebApp.fjrs.isServer = false;  // true: 来自服务端扫码
	KGPdfViewerWebApp.userId = keySn;
	KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.init()
	// KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.config.isScanStamp = false;
	if(sealType == 2)
		KGPdfViewerWebApp.stampOfXY(ypages, yx, yy);
	else if(sealType == 3)
		KGPdfViewerWebApp.stampOfText(ypages, ytext);
	else
		KGPdfViewerWebApp.stamp();
	if(pwd) {
		document.getElementById("kgpassword").value = pwd;
		document.getElementById("kgpasswordSubmit").click();
	}
}

// 扫码盖章 去客户端
function SMStamp(type){
	if(type==1){
		sessionStorage.removeItem("token_info");//扫码换章
	}
	KGPdfViewerWebApp.sealOrigin = 0;
	KGPdfViewerWebApp.certOrigin = 0;
	KGPdfViewerWebApp.fjrs.isScanStamp =true; // 扫码签
	window.KGPdfViewerWebApp.fjrs.isServer = true;  // true: 来自服务端，false: 来自客户端
	window.KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.init()
	KGPdfViewerWebApp.stamp();
}
// 扫码定位盖章 去客户端
function SMStampxy(pages, x, y){
	KGPdfViewerWebApp.sealOrigin = 0;
	KGPdfViewerWebApp.certOrigin = 0;
	KGPdfViewerWebApp.fjrs.isScanStamp =true; // 扫码签
	window.KGPdfViewerWebApp.fjrs.isServer = true;  // true: 来自服务端，false: 来自客户端
	window.KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.init()
	KGPdfViewerWebApp.stampOfXY(pages, x, y)
}
// 扫码关键字盖章 去客户端
function SMStamptext(pages, text){
	KGPdfViewerWebApp.sealOrigin = 0;
	KGPdfViewerWebApp.certOrigin = 0;
	KGPdfViewerWebApp.fjrs.isScanStamp =true; // 扫码签
	window.KGPdfViewerWebApp.fjrs.isServer = true;  // true: 来自服务端，false: 来自客户端
	window.KGPdfViewerWebApp.PDFViewerApplication.KG_FJRS.init()
	KGPdfViewerWebApp.stampOfText(pages, text)
}

function yunStamp() {
	sealType = 1;
}

function yunStampxy(pages, x, y) {
	sealType = 2;
	ypages = pages;
	yx = x;
	yy = y;
}

function yunStamptext(pages, text) {
	sealType = 3;
	ypages = pages;
	ytext = text;
}

function rsDownload(){
	window.KGPdfViewerWebApp.saveAnnotations("[]", !0);
}
