// js文件动态加载

	function loadjscssfile(filename, filetype){
		    if (filetype=="js"){
		        var fileref=document.createElement('script')
		        fileref.setAttribute("type","text/javascript")
				fileref.setAttribute("async","async")
		        fileref.setAttribute("src",filename)
		    } else if (filetype=="css"){
		        var fileref=document.createElement("link")
		        fileref.setAttribute("rel","stylesheet")
		        fileref.setAttribute("type","text/css")
		        fileref.setAttribute("href",filename)
		    }

		    if (typeof fileref!="undefined"){
				// if(filetype=="js"){
				// 	document.body.appendChild(fileref)
				// }else if (filetype=="css"){
					document.getElementsByTagName("head")[0].appendChild(fileref)
				// }
		    }
		}
		function removejscssfile(filename,filetype){
		    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"
		    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"
		    var allsuspects = document.getElementsByTagName(targetelement)
		    for (var i = allsuspects.length; i >= 0; i--){
		        if (allsuspects[i] &&allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
		　　　　　　  allsuspects[i].parentNode.removeChild(allsuspects[i])
		　　　　 }
		    }
		}

	var fileList1 ={
		'js':["kinsec/assets/js/axios.min.js","kinsec/kinsec_html_seal.js"]
	}
	var fileList2={
		'js':[
			"kinggrid/core/kinggrid.min.js",
			"kinggrid/core/kinggrid.plus.min.js",
			"kinggrid/dialog/artDialog/dialog-min.js",
			"kinggrid/signature.min.js",
			"kinggrid/signature.pc.min.js",
			"kinggrid/password.min.js",
			"kinggrid/signature_pad.min.js",
			"kinggrid/jquery.qrcode.min.js",
			"kinggrid/qrcode.min.js",
			"kinggrid/jsQR.js",
			"kinggrid/search.js",
			"kinggrid/keysn/promise.min.js",
			"kinggrid/keysn/core/kg-xhr.js",
			"kinggrid/keysn/kg-KG_HARD_EXT.js",
			"rs/socket.js"
		],
		'css':[
			"kinggrid/dialog/artDialog/ui-dialog.css",
			"kinggrid/core/kinggrid.plus.css",
			"kinggrid/css/search.css"
		]
	}
	  function jsFile(type,url){
		  if(type=='kinsec'){
			  fileList2.js.forEach(function(item){
			  		removejscssfile(url+item,"js")
			  })
			  fileList2.css.forEach(function(item){
			  		removejscssfile(url+item,"css")
			  })
			fileList1.js.forEach(function(item){
				loadjscssfile(url+item,"js")
			})
		  }else if(type=='kinggrid'){
			fileList1.js.forEach(function(item){
				removejscssfile(url+item,"js")
			})
			fileList2.css.forEach(function(item){
			     loadjscssfile(url+item,"css")
			})
			 fileList2.js.forEach(function(item){
				 loadjscssfile(url+item,"js")
			 })
		  }
	  }
