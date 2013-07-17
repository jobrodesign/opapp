var opui = opui || {};

opui.data = {
	request : function (request) {
		var parsedRequest = $.parseJSON(request);
		opui.console.log("data Request method: ["+parsedRequest.name+"]");
		var def = $.Deferred(function(dfd){
			if(platform == 'ios'){
				$.ajax({
				    url: jsonpath+parsedRequest.file,
				    dataType: 'json',
					async: true,
					success: function(data){
						//console.log("Courses Successful");
						window[parsedRequest.name].model = data;
						dfd.resolve();
					}
				});
			}
			console.log("Platform = " + platform);
			if(platform == 'android'){
				window[parsedRequest.name].model = $.parseJSON(CellCast.scurl(parsedRequest.scurl));
				dfd.resolve();
			}
			if(platform == 'android_blackberry'){
				window[parsedRequest.name].model = $.parseJSON(prompt(parsedRequest.scurl));
				dfd.resolve();
			}
			if(platform == 'opair'){
				window[parsedRequest.name].model = window.scurl(parsedRequest.scurl);
				dfd.resolve();
			}
			if(platform == 'bb10'){
				// window[request.name].dfd = dfd;
				navigator.cascades.postMessage(request, window.location.origin);
			}
		});
		return def;
	},
	preProcess: function($text){
	    // Damn pesky carriage returns...
	    $text = $text.replace("\r\n", "<br>")
	    $text = $text.replace("\r", "<br>")

	    // JSON requires new line characters be escaped
	    //$text = str_replace("\n", "\\n", $text);
	    return $text;
	},
	processReturn: function(payload){
		var payload = opui.preProcess(payload)
		opui.console.log(payload)
		try {
			opui.console.log('trying to parse json')
			payload = $.parseJSON(payload);
			opui.console.log('parse successful for ['+payload.name+']')
			if(!$.isEmptyObject(payload.data)){
				opui.console.log('saving payload data to model')
				window[payload.name].model = payload.data;
			} else {
				opui.console.log('saving model as empty')
				if(payload.name == 'skillprofiles'){
					window[payload.name].model = [];
				} else {
					window[payload.name].model = {};
				}
			}
			
		} catch (err) {
			opui.console.log('parse UNsuccessful')
			opui.console.log(err.message);
			opui.console.log('getting name of return');
			var name = payload.split('"')[3];
			opui.console.log('saving model for ['+name+'] as empty')
			if(name == 'skillprofiles'){
				window[name].model = [];
			} else {
				window[name].model = {};
			}
			opui.console.log('resolving with no data')
			window[name].request.resolve();
			return;
		}
		opui.console.log('resolving')
		window[payload.name].request.resolve();
	}
}