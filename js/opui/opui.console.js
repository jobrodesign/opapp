var opui = opui || {};

opui.console = {
	history: [],
	log: function(msg){
		var temp = new Date();
		temp = temp.getHours()+':'+temp.getMinutes()+':'+temp.getSeconds()+':'+temp.getMilliseconds();
		console.log(temp+': '+msg);
		if(typeof(msg) != 'string'){
			console.log(msg);
		}
		opui.console.history.push(temp+': '+msg);
	},
	getHistory: function(){
		for (var i=0; i < opui.console.history.length; i++){
			console.log(opui.console.history[i]);
		}
	}
}