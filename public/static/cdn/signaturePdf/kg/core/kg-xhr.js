
(function(root){
	var _timeout = 200000;
	// if(!window.alert){
		// window.alert = window.kgAlert;
	// }

	var createCapability = function(){
		var capability = {};
		capability.promise = new Promise(function(resolve,reject){
			capability.resolve = resolve;
			capability.reject = reject;
		});
		return capability;
	};

	function createCORSRequest(method, url,ctrl) {
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest != "undefined") {
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			xhr = null;
		}
		return xhr;
	}


	var KG = function(progid,inter,usercode){
		this.url = "http://127.0.0.1:9581";
		this.progid = progid;
		this.inter = inter;
		this.caller = 0;
		this.time = _timeout;
		this.usercode = usercode;
	};

	KG.prototype = {
		init: function(){
			var self = this;
			var capability = createCapability();
			var val = JSON.stringify({"GetInterface":{"progid":this.progid,"interface":this.inter},"usercode":this.usercode});
			var xhr = createCORSRequest("POST",this.url + "/GetInterface",this);
			xhr.timeout = _timeout;
			xhr.onload = function(e) {
				if(this.status != undefined){
					if(this.status != 200 && this.status != 304){
						window.alert("本地签章服务异常，请稍后再试：status = " + this.status);
						return;
					}
				}
				var obj = eval("(" + this.responseText + ")");
				if(obj.value == 0 || obj.value === "none"){
					window.alert(self.progid + "控件初始化失败！");
					return;
				}
				self.caller = obj.value;
				capability.resolve();
			};
			xhr.ontimeout = function(e) {
        window.alert("请求本地签章服务超时，请稍后再试！");
		  	};
		  	xhr.onerror = function(e) {
		  		window.alert("请手工启动本地签章服务！");
		  	};
		  	xhr.send("value=" + val);
			return capability.promise;
		},

		invoke: function(method){
			var capability = createCapability();
			var self = this;
			var params = [];
			if(arguments.length >= 2){
				for(var i=1;i<arguments.length;i++){
					var typeVal = typeof arguments[i];
					var val = arguments[i] != null ? arguments[i].toString() : "null";
					var data = null;
					if(typeVal === 'boolean'){
						data = {"type":"BOOL", "value": val};
					} else if(typeVal === 'number'){
						data = {"type":"LONG", "value": val};
					} else {
						data = {"type":"BSTR", "value": val};
					}
					params.push(data);
				}
			}

			var val = JSON.stringify( { 'MethodCall' : { 'caller' : this.caller,
				                                       'function': method,
				                                       'params' : params },"usercode":this.usercode});
			var xhr = createCORSRequest("POST",this.url + "/MethodCall",this);
			xhr.timeout = self.time;
			xhr.onload = function(e) {
				if(this.status != undefined){
					if(this.status != 200 && this.status != 304){
						window.alert("本地签章服务异常，请稍后再试：status = " + this.status);
						return;
					}
				}
				var obj = eval("(" + this.responseText + ")");
				capability.resolve(obj.value);
			};
			xhr.ontimeout = function(e) {
				self.time = _timeout;
        window.alert("请求本地签章服务超时，请稍后再试！");
		  	};
		  	xhr.onerror = function(e) {
		  		window.alert("请手工启动本地签章服务！");
		  	};
		  	xhr.send("value="+val);
			return capability.promise;
		},

		get: function(property){
			var capability = createCapability();
			var self = this;
			var val = JSON.stringify({'PropertyCall' : { 'caller' : this.caller,
				                                       'property' : property },"usercode":this.usercode});
			var xhr = createCORSRequest("POST",this.url + "/PropCall",this);
			xhr.timeout = self.time;
			xhr.onload = function(e) {
				if(this.status != undefined){
					if(this.status != 200 && this.status != 304){
						window.alert("本地签章服务异常，请稍后再试：status = " + this.status);
						return;
					}
				}
				var obj = eval("(" + this.responseText + ")");
				capability.resolve(obj.value);
			};
			xhr.ontimeout = function(e) {
        window.alert("请求本地签章服务超时，请稍后再试！");
		  	};
		  	xhr.onerror = function(e) {
		  		window.alert("请手工启动本地签章服务！");
		  	};
		  	xhr.send("value="+val);
		  	return capability.promise;
		},

		put:function(property,value){
			var self = this;
			var typeVal = typeof value;
			var _value = (value != undefined ? value.toString() : "null");
			var data = null;
			if(typeVal === 'boolean'){
				data = {"type":"BOOL", "value": _value};
			} else if(typeVal === 'number'){
				data = {"type":"LONG", "value": _value};
			} else {
				data = {"type":"BSTR", "value": _value};
			}
			var val = JSON.stringify({'PropertyCallPut' : { 'caller' : self.caller,
				                                          'property' : property,
				                                          'params' : [data]	},"usercode":this.usercode});
			var capability = createCapability();

			var xhr = createCORSRequest("POST",this.url + "/PropCall",this);
			xhr.timeout = self.time;
			xhr.onload = function(e) {
				if(this.status == 200 && this.status == 304){
					var obj = eval("(" + this.responseText + ")");
					capability.resolve(obj.value);
				} else {
					window.alert("本地签章服务异常，请稍后再试：status=" + this.status);
				}
			};
			xhr.ontimeout = function(e) {
        window.alert("请求本地签章服务超时，请稍后再试！");
		  	};
		  	xhr.onerror = function(e) {
		  		window.alert("请手工启动本地签章服务！");
		  	};
		  	xhr.send("value="+val);
		  	return capability.promise;
		},

		setUrl: function(url){
			this.url = url;
		}
	};

	root.KG = KG;
	root.createCapability = createCapability;
})(window)
