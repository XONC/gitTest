(function(root){
	
	var AnalysisPFX = function(_conf){
		
		this.kg = new KG('KG_PFXANALYSIS.KG_PFXAnalysisCtrl.1' , '495925B3-EA91-41EA-81809F8C3A36573C');
		
		var capability = createCapability();
		this.promise = capability.promise;
		var self = this;
		this.kg.init().then(function(){
			capability.resolve();
		});
		return this;
	};
	
	AnalysisPFX.prototype = {
		AnalysisPFXCert : function(path, pwd, dd){
			var kg = this.kg;
			var capability = createCapability();
			kg.invoke('AnalysisPFXCert', path, pwd, dd).then(function(data){		
				capability.resolve(data);
			});
			return capability.promise;
		}
	}
	
	root.AnalysisPFX = AnalysisPFX;
})(window)