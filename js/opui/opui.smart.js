$.ajaxSetup({cache: false});


// Add missing javascript methods
Array.prototype.unique = function( b ) {
 var a = [], i, l = this.length;
 for( i=0; i<l; i++ ) {
  if( a.indexOf( this[i], 0, b ) < 0 ) { a.push( this[i] ); }
 }
 return a;
};

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

// Declare Global Variables
var jsonpath = "";
var imgpath = "";
var platform = "";
var nuggets;
var courses;
var assessments;
var skillprofiles;
var scorm;
var playlists;
var notifications;
var announcements;
var assignments;
var messages;
var library;
var mystatus;
var branding;





// Define SCURL Function
function getPaths (){
	window.location = "cellcast://data/getpaths/setpaths";
}

function getLibrary(){
	//alert('library method called');
	window.location = 'cellcast://data/library/libraryReady';
}

function getStatus(){
	//alert('status method called');
	window.location = 'cellcast://data/mystatus/statusReady';
}


// Define Callback Function
function setpaths(one, two, three){
	opui.console.log("set paths")
	if(arguments.length == 3){
		jsonpath = one;
		imgpath = two;
		platform = three;
	}
	if(arguments.length == 2){
		imgpath = one;
		platform = two;
	}

	if(platform == 'bb10'){
		//listen for messages from BB10
		//window.addEventListener("message", opui.processReturn, false);
		navigator.cascades.onmessage = function onmessage(message) {
			opui.processReturn(message);
		}
	}
	//console.log("init function started");
	//console.log("JSON path: "+jsonpath+" | image path: "+imgpath+" | Platform: "+platform);
	smartInit();
	//pageInit();
	//getLibrary();

}

function libraryReady(){
		//alert('library.json ready for template');
		$.ajax({
			url: jsonpath+'library.json',
			dataType: 'json',
			async: false,
			success: function(data){
				//alert('library success');
				//console.log(typeof data);
				library = new Library(data);
				//console.log(typeof library);
				libraryInit();
			},
			error: function(jqXHR, textStatus, errorThrown){
				//alert('ajax error:'+errorThrown);
				//console.log(jqXHR);
				//console.log(textStatus);
				//console.log(errorThrown);
		}
		});
}

function statusReady(){
		//alert('status.json ready for template');
		$.ajax({
			url: jsonpath+'my_status.json',
			dataType: 'json',
			async: false,
			success: function(data){
				//alert('status success');
				//console.log(typeof data);
				mystatus = new myStatus(data);
				//console.log(typeof mystatus);
				statusInit();
			},
			error: function(jqXHR, textStatus, errorThrown){
				//alert('ajax error:'+errorThrown);
				//console.log(jqXHR);
				//console.log(textStatus);
				//console.log(errorThrown);
		}
		});
}

var Branding = function(){
	var that = this;
	this.get = $.ajax({
		url: jsonpath+"branding.json",
		dataType: 'json',
		async: false,
		success: function(data){
			opui.branding.set(data);
		}
	})
}

function processAssignments(){
	assignments = {};
	assignments.categories = [];
	assignments.tags = [];

	opui.console.log('tryng new items')
	try{
		assignments.newItems = nuggets.model.new_items +
						courses.model.new_items + 
						assessments.model.new_items + 
						scorm.model.new_items;
	} catch (err) {
		opui.console.log(err.message);
	}

	opui.console.log('trying total items');
	try{
		assignments.totalItems = nuggets.model.total_items +
		courses.model.total_items + 
		assessments.model.total_items + 
		scorm.model.total_items;
	} catch (err) {
		opui.console.log(err.message);
		assignments.totalItems = 0;
	}

	opui.console.log('trying to transfer up a level');	
	try {
		assignments.nuggets = nuggets.model.nuggets;
	} catch (err) {
		opui.console.log(err.message);
		assignments.nuggets = [];
		
	} 
	try {
		assignments.courses = courses.model.courses;
	} catch (err) {
		opui.console.log(err.message);
		assignments.courses = [];
	}

	try {
		assignments.activities = activities.model.activities;
	} catch (err) {
		opui.console.log(err.message);
		assignments.activities = [];
	}

	try {
		assignments.assessments = assessments.model.testsets;
	} catch (err) {
		opui.console.log(err.message);
		assignments.assessments = [];
	}
	try {
		assignments.scorm = scorm.model.courses;
	} catch (err) {
		opui.console.log(err.message);
		assignments.scorm = [];
	}
	try {
		if(platform == 'android' || platform == 'android_blackberry' || platform == 'bb10'){
			assignments.skillprofiles = skillprofiles.model;
		} else {
			assignments.skillprofiles = skillprofiles.model.skillprofiles;
		}
	} catch (err) {
		opui.console.log(err.message);
		assignments.skillprofiles = [];
	}

	opui.console.log('processing types');
	opui.console.log('processing nuggets');
	opui.console.log(assignments.nuggets);
	try{
		$.each(assignments.nuggets, function(){
			this.assignType = "nugget";
			if(this.metatags){
				var t = this.metatags.split("|");
				this.category = t[0];
				var tags = [];
				$.each(t, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)};
					assignments.tags.push(value);
				});
				this.tags = tags;
				assignments.categories.push(this.category);
			}
		});
	} catch (err) {
		opui.console.log(err.message)
	}
			

	
		opui.console.log('process courses');
		$.each(assignments.courses, function(){
			this.assignType = "course";
			if(this.metatags){
				var t = this.metatags.split("|");
				this.category = t[0];
				var tags = [];
				$.each(t, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)};
					assignments.tags.push(value);
				});
				this.tags = tags;
				assignments.categories.push(this.category);
			}
		});

	
	opui.console.log('processing assessments');
			$.each(assignments.assessments, function(){
				this.assignType = "testset";
				if(this.metatags){
					var t = this.metatags.split("|");
					this.category = t[0];
					var tags = [];
					$.each(t, function(i, value){
						//console.log(this);
						if(i>0){tags.push(value)};
						assignments.tags.push(value);
					});
					this.tags = tags;
					assignments.categories.push(this.category);
				}
			});

	opui.console.log('processing scorm');
			$.each(assignments.scorm, function(){
				this.assignType = "scorm";
				if(this.metatags){
					var t = this.metatags.split("|");
					this.category = t[0];
					var tags = [];
					$.each(t, function(i, value){
						//console.log(this);
						if(i>0){tags.push(value)};
						assignments.tags.push(value);
					});
					this.tags = tags;
					assignments.categories.push(this.category);
				}
			});

	opui.console.log('processing activities');
			$.each(assignments.activities, function(){
				this.assignType = "activity";
				if(this.metatags){
					var t = this.metatags.split("|");
					this.category = t[0];
					var tags = [];
					$.each(t, function(i, value){
						//console.log(this);
						if(i>0){tags.push(value)};
						assignments.tags.push(value);
					});
					this.tags = tags;
					assignments.categories.push(this.category);
				}
			});

		
	opui.console.log('processing skillprofiles');
			$.each(assignments.skillprofiles, function(){
				this.assignType = "skillprofile";
				if(this.metatags){
					var t = this.metatags.split("|");
					this.category = t[0];
					var tags = [];
					$.each(t, function(i, value){
						//console.log(this);
						if(i>0){tags.push(value)};
						assignments.tags.push(value);
					});
					this.tags = tags;
					assignments.categories.push(this.category);
				}
			});
		

	
	opui.console.log('concat');
	assignments.assignments = assignments.nuggets.concat(assignments.courses, assignments.assessments, assignments.scorm, assignments.skillprofiles, assignments.activities);
	opui.console.log('categories and tags');
	assignments.categories = assignments.categories.unique();
	assignments.tags = assignments.tags.unique();
	
	return assignments;
}




var Assignments = function(){
	
	var that = this;
	
	this.categories = [];
	this.tags = [];
	
	opui.console.log('tryng new items')
	try{
		this.newItems = nuggets.model.new_items +
						courses.model.new_items + 
						assessments.model.new_items + 
						scorm.model.new_items;
	} catch (err) {
		opui.console.log(err.message);
		this.newItems = 0;
	}
	
	opui.console.log('trying total items');
	try{
		this.totalItems = nuggets.model.total_items +
		courses.model.total_items + 
		assessments.model.total_items + 
		scorm.model.total_items;
	} catch (err) {
		opui.console.log(err.message);
		this.totalItems = 0;
	}
	
	opui.console.log('trying to transfer up a level');	
	try {
		this.nuggets = nuggets.model.nuggets;
	} catch (err) {
		opui.console.log(err.message);
		this.nuggets = [];
		
	} 
	try {
		this.courses = courses.model.courses;
	} catch (err) {
		opui.console.log(err.message);
		this.courses = [];
	}
	try {
		this.assessments = assessments.model.testsets;
	} catch (err) {
		opui.console.log(err.message);
		this.assessments = [];
	}
	try {
		this.scorm = scorm.model.courses;
	} catch (err) {
		opui.console.log(err.message);
		this.scorm = [];
	}
	try {
		if(platform == 'android' || platform == 'android_blackberry' || platform == 'bb10'){
			this.skillprofiles = skillprofiles.model;
		} else {
			this.skillprofiles = skillprofiles.model.skillprofiles;
		}
	} catch (err) {
		opui.console.log(err.message);
		this.skillprofiles = [];
	}
	
	opui.console.log('processing types');
	opui.console.log('processing nuggets');
	opui.console.log(this.nuggets);
	try{
		$.each(this.nuggets, function(){
			this.assignType = "nugget";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value);
					that.tags.push(value);}
				});
				this.tags = tags;
			}
		});
	} catch (err) {
		opui.console.log(err.message)
	}
			

	
		opui.console.log('process courses');
		$.each(this.courses, function(){
			this.assignType = "course";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value);
					that.tags.push(value);}
				});
				this.tags = tags;
			}
		});

	
opui.console.log('processing assessments');
		$.each(this.assessments, function(){
			this.assignType = "testset";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value);
					that.tags.push(value);}
				});
				this.tags = tags;
			}
		});

opui.console.log('processing scorm');
		$.each(this.scorm, function(){
			this.assignType = "scorm";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value);
					that.tags.push(value);}
				});
				this.tags = tags;
			}
		});

	
opui.console.log('processing skillprofiles');
		$.each(this.skillprofiles, function(){
			this.assignType = "skillprofile";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value);
					that.tags.push(value);}
				});
				this.tags = tags;
			}
		});
		

	
	opui.console.log('concat');
	this.assignments = this.nuggets.concat(this.courses, this.assessments, this.scorm, this.skillprofiles);
	opui.console.log('categories and tags');
	this.categories = this.categories.unique();
	this.tags = this.tags.unique();
}

var Library = function(data){
	console.log(data);
	var that = this;
	
	this.model = data;
	this.categories = [];
	
	if (data.courses){
		this.courses = data.courses;
	} else {
		this.courses = null;
	}
	if (data.nuggets){
		this.nuggets = data.nuggets;
	} else {
		this.nuggets = null;
	}
	if (data.testsets){
		this.assessments = data.testsets;
	} else {
		this.assessments = null;
	}
	if (data.scorm){
		this.scorm = data.scorm;
	} else {
		this.scorm = null;
	}
	if(data.skillprofiles){
		this.skillprofiles = data.skillprofiles;
	} else {
		this.skillprofiles = null;
	}
	
	if(this.courses){
		$.each(this.courses, function(){
			this.selectionType = "course";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				that.categories.push(this.category);
			}
		});
	}
	
	if(this.nuggets){
		$.each(this.nuggets, function(){
			this.selectionType = "nugget";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				that.categories.push(this.category);
			}
		});
	}
	
	if(this.assessments){
		$.each(this.assessments, function(){
			this.selectionType = "testset";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				that.categories.push(this.category);
			}
		});
	}
	
	if(this.scorm){
		$.each(this.scorm, function(){
			this.selectionType = "scorm";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				that.categories.push(this.category);
			}
		});
	}
	
	if(this.skillprofiles){
		$.each(this.skillprofiles, function(){
			this.selectionType = "skillprofile";
			if(this.metatags){
				this.metatags = this.metatags.split("|");
				this.category = this.metatags[0];
				var tags = [];
				$.each(this.metatags, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				that.categories.push(this.category);
			}
		});
	}
	
	
	
	this.items = this.nuggets.concat(this.courses, this.assessments, this.scorm, this.skillprofiles);
	this.items.clean();

	this.categories = this.categories.unique();
	
	
	
	//console.log('Library instance created');
}

function processLibrary (){
	var that = this;
	

	library.categories = [];
	library.tags = [];
	
	if (library.model.courses){
		library.courses = library.model.courses;
	} else {
		library.courses = null;
	}
	if (library.model.nuggets){
		library.nuggets = library.model.nuggets;
	} else {
		library.nuggets = null;
	}
	if (library.model.testsets){
		library.assessments = library.model.testsets;
	} else {
		library.assessments = null;
	}
	if (library.model.scorm){
		library.scorm = library.model.scorm;
	} else {
		library.scorm = null;
	}
	if(library.model.skillprofiles){
		library.skillprofiles = library.model.skillprofiles;
	} else {
		library.skillprofiles = null;
	}
	
	if(library.courses){
		$.each(library.courses, function(){
			this.selectionType = "course";
			if(this.metatags){
				var t = this.metatags.split("|");
				this.category = t[0];
				var tags = [];
				$.each(t, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				library.categories.push(this.category);
			}
		});
	}
	
	if(library.nuggets){
		$.each(library.nuggets, function(){
			this.selectionType = "nugget";
			if(this.metatags){
				var t = this.metatags.split("|");
				this.category = t[0];
				var tags = [];
				$.each(t, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				library.categories.push(this.category);
			}
		});
	}
	
	if(library.assessments){
		$.each(library.assessments, function(){
			this.selectionType = "testset";
			if(this.metatags){
				var t = this.metatags.split("|");
				this.category = t[0];
				var tags = [];
				$.each(t, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				library.categories.push(this.category);
			}
		});
	}
	
	if(library.scorm){
		$.each(library.scorm, function(){
			this.selectionType = "scorm";
			if(this.metatags){
				var t = this.metatags.split("|");
				this.category = t[0];
				var tags = [];
				$.each(t, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				library.categories.push(this.category);
			}
		});
	}
	
	if(library.skillprofiles){
		$.each(library.skillprofiles, function(){
			this.selectionType = "skillprofile";
			if(this.metatags){
				var t = this.metatags.split("|");
				this.category = t[0];
				var tags = [];
				$.each(t, function(i, value){
					//console.log(this);
					if(i>0){tags.push(value)}
				});
				this.tags = tags;
				library.categories.push(this.category);
			}
		});
	}
	
	library.items = library.nuggets.concat(library.courses, library.assessments, library.scorm, library.skillprofiles);
	library.items.clean();

	library.categories = library.categories.unique();
	
	
	
	//console.log('Library instance created');
}

var myStatus = function(data){
	console.log(data);
	var that = this;
	
	this.model = data;
	
	if (data.courses){
		this.courses = data.courses;
	} else {
		this.courses = null;
	}
	if (data.nuggets){
		this.nuggets = data.nuggets;	
	} else {
		this.nuggets = null;
	}
	if (data.testsets){
		this.assessments = data.testsets;
	} else {
		this.assessments = null;
	}
	if (data.scorm){
		this.scorm = data.scorm;
	} else {
		this.scorm = null;
	}
	if(data.skillprofiles){
		this.skillprofiles = data.skillprofiles;
	} else {
		this.skillprofiles = null;
	}
	if(data.activities){
		this.activities = data.activities;
	} else {
		this.activities = null;
	}
	

	
	
	
	this.items = this.nuggets.concat(this.courses, this.assessments, this.scorm, this.skillprofiles, this.activities);
	this.items.clean();
	
	console.log(this.items);
	
	//console.log('Status instance created');
}

function processMessages(){
	messages = {};
	try {
		messages.newItems = announcements.model.new_items +
		notifications.model.new_items;
	} catch(err) {
		messages.newItems = 0;
		opui.console.log(err.message);
	}
	
	try {
		messages.totalItems = announcements.model.total_items +
		notifications.model.total_items;
	} catch(err) {
		messages.totalItems = 0;
		opui.console.log(err.message);
	}
	
	try {
		messages.announcements = announcements.model.messages;
	} catch(err) {
		this.announcements = [];
		opui.console.log(err.message);
	}

	try {
		messages.notifications = notifications.model.messages;
	} catch(err) {
		messages.notifications = [];
		opui.console.log(err.message);
	}

	return messages
}


var Messages = function(){
	
	var that = this;
	
	try {
		this.newItems = announcements.model.new_items +
		notifications.model.new_items;
	} catch(err) {
		this.newItems = 0;
		opui.console.log(err.message);
	}
	
	try {
		this.totalItems = announcements.model.total_items +
		notifications.model.total_items;
	} catch(err) {
		this.totalItems = 0;
		opui.console.log(err.message);
	}
	
	try {
		this.announcements = announcements.model.messages;
	} catch(err) {
		this.announcements = [];
		opui.console.log(err.message);
	}

	try {
		this.notifications = notifications.model.messages;
	} catch(err) {
		this.notifications = [];
		opui.console.log(err.message);
	}

}

function smartInit(){
	
	window['nuggets'] = {model:{}};
	window['nuggets'].request = opui.data.request('{"name":"nuggets", "file":"nugget_assignments.json", "scurl":"cellcast://data/nuggets"}');

	window['activities'] = {model:{}};
	window['activities'].request = opui.data.request('{"name":"activities", "file":"activity_assignments.json", "scurl":"cellcast://data/activities"}');

	window['courses'] = {model:{}};
	window['courses'].request = opui.data.request('{"name":"courses", "file":"course_assignments.json", "scurl":"cellcast://data/courses"}');

	window['assessments'] = {model:{}};
	window['assessments'].request = opui.data.request('{"name":"assessments", "file":"testset_assignments.json", "scurl":"cellcast://data/testsets"}');

	window['scorm'] = {model:{}};
	window['scorm'].request = opui.data.request('{"name":"scorm", "file":"scorm_courses.json", "scurl":"cellcast://data/scorm"}');

	window['skillprofiles'] = {model:{}};
	window['skillprofiles'].request = opui.data.request('{"name":"skillprofiles", "file":"skillprofiles.json", "scurl":"cellcast://data/skillprofiles"}');
	
	window['announcements'] = {model:{}};
	window['announcements'].request = opui.data.request('{"name":"announcements", "file":"announcements.json", "scurl":"cellcast://data/announcements"}');

	window['notifications'] = {model:{}};
	window['notifications'].request = opui.data.request('{"name":"notifications", "file":"notifications.json", "scurl":"cellcast://data/notifications"}');

	window['library'] = {model:{}};
	library.request = $.Deferred(function(dfd){
		window.location = 'cellcast://data/library/library.request.resolve'
	});

	

	$.when(
		$.when(nuggets.request, courses.request, assessments.request, scorm.request, skillprofiles.request, activities.request).then(function(){
			processAssignments();
		}).then(function(){
			$.when(announcements.request, notifications.request).then(function(){
				processMessages();
			})
		}).then(function(){
			$.when(library.request).then(function(data){
				var def = $.Deferred(function(dfd){
					library.model = data;
					processLibrary();
					window.catalog = library.items.concat(assignments.assignments);
					dfd.resolve();
				})
				return def;
			})
		})
	).then(pageInit())
	 
}

$(function(){
	getPaths();
	//window.location = 'cellcast://data/getpaths/setpaths';
})




