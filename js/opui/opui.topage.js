var opui = opui || {};



opui.topage = function(){
	var qrCode 		= arguments[0],
		qrReplace	= qrCode.replace(/[+]/g, '/'),
		split 		= qrReplace.split('/'),
		url 		= split[1] + '/departments/' + split[2] + '/qr/' + split[3] + '.html'; 
	console.log(arguments[0])
	console.log('url is: ' + url)
	stepPush(url,null,null);
	loadTarget(url, null); 
	return 'got it';
}