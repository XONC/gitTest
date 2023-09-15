(function(root){
	
	var KG_HARD_EXT = function(){
		
		this.kg = new KG('KG_HARD_EXT.KG_HARD_EXTCtrl.1' , '02CA4235-81DF-4ABF-8395FE054000BA20');
		
		var capability = createCapability();
		this.promise = capability.promise;
		var self = this;
		this.kg.init().then(function(){
			capability.resolve();
		});
		return this;
	};

	KG_HARD_EXT.prototype = {
		GetKeySN: function(nUsbPort){
			var kg = this.kg;
			var capability = createCapability();
			kg.invoke('WebConnectDev',nUsbPort);
			kg.invoke('WebGetSerial').then(function(data){
				capability.resolve(data);
				kg.invoke('WebDisconnectDev');
			});
			return capability.promise;
		}
		
	};
	root.KG_HARD_EXT = KG_HARD_EXT;
})(window)