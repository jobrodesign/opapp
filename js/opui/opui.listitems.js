/*// Add missing javascript methods
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
};*/

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

// Define collection manipulation functions


function queryByCategory(collection, term){	
	return (collection.filter(function(element, index, array){
			return (element.category === term)
	}))
}

function queryByTags (collection, terms, method){
	switch (method){
		case 'inclusive':
			return(collection.filter(function(element, index, array){
				if(element.tags){
					if(element.tags.length > 0){
						//console.log(element.name);
						if(terms.some(function(e,i,a){
							if($.inArray(e, element.tags) > -1){
								//console.log(e+" found");
								return true
							}else{
								//console.log(e+" NOT found");
								return false
							}
						})){
							//console.log('Element has passed test as true');
							return element
						}
					}
				}
			}))
			break;
		case 'exclusive':
			return(collection.filter(function(element, index, array){
				//console.log(element);
				if(element.tags){
					if(element.tags.length > 0){
						//console.log(element.name);
						if(terms.every(function(e,i,a){
							if($.inArray(e, element.tags) > -1){
								//console.log(e+" found");
								return true
							}else{
								//console.log(e+" NOT found");
								return false
							}
						})){
							//console.log('Element has passed test as true');
							return element
						}
					}
				}
				
			}))
			break;
	}
}

function sortName(collection){
	return (collection.sort(function(a,b){
			var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
			if(nameA < nameB) //sort string ascending
				return -1
			if (nameA > nameB)
				return 1
			return 0 //default return value (no sorting)
	}))
}


function orderByTagDescending(collection, tag){
	//separate items into one array for ordering and one for non-ordering
	var nonOrderItems = [];
	var orderItems = collection.filter(function(element, index, array){
		if(indexByTag(element.tags, tag) > -1){
			return element;
		} else {
			nonOrderItems.push(element);
		}
	})
	nonOrderItems = sortName(nonOrderItems);
	orderItems = orderItems.sort(function(a,b){
		var indexA = indexByTag(a.tags, tag)
		var indexB = indexByTag(b.tags, tag)
		var tagA = a.tags[indexA].substring(a.tags[indexA].lastIndexOf(":")+1), tagB = b.tags[indexB].substring(b.tags[indexB].lastIndexOf(":")+1);
		return tagB - tagA;
	})
	return orderItems.concat(nonOrderItems);
}

function orderByTagAscending(collection, tag){
	//separate items into one array for ordering and one for non-ordering
	var nonOrderItems = [];
	var orderItems = collection.filter(function(element, index, array){
		if(indexByTag(element.tags, tag) > -1){
			return element;
		} else {
			nonOrderItems.push(element);
		}
	})
	nonOrderItems = sortName(nonOrderItems);
	orderItems = orderItems.sort(function(a,b){
		var indexA = indexByTag(a.tags, tag)
		var indexB = indexByTag(b.tags, tag)
		var tagA = a.tags[indexA].substring(a.tags[indexA].lastIndexOf(":")+1), 
			tagB = b.tags[indexB].substring(b.tags[indexB].lastIndexOf(":")+1);
		return tagA - tagB;
	})
	return orderItems.concat(nonOrderItems);
}

function indexByTag (collection, tag){
	var i;
	collection.forEach(function(element, index, array){
		if(element.indexOf(tag) > -1){
			i = index;
		}
	})
	if(i != 'undefined'){
		return i;
	} else {
		return -1;
	}
}

function sortAlpha(collection){
	return (collection.sort())
}


function itemsByAttribute(collection, attribute, value){
	var Items = (collection.filter(function(element, index, array){
		if(element[attribute] === value){
			return element
		}
	}))
	return Items;
}

function itemById(collection, id){
	var item = itemsByAttribute(collection, 'id', id)[0];
	return item;
}

function optionalItems(collection){
	return (collection.filter(function(element, index, array){
			return (element.optional === true)
	}))
}

function requiredItems(collection){
	return (collection.filter(function(element, index, array){
			return (element.optional === false)
	}))
}

function getSkillList(skillprofileId){
	var skillProfile = itemById(assignments.skillprofiles, skillprofileId);
	//console.log(skillProfile[0].items);
	var collection = [];
	for(var i=0; i < skillProfile.items.length; i++){
		var temp = itemById(assignments.assignments, skillProfile.items[i].id);
		collection.push(temp);
	}
	return collection;
}

function selectionLaunch(id){
	var temp = itemsByAttribute(library.items, 'id', id);
	var selection = temp[0];
	var r = confirm('Would you like to view the selection now?');
	if(r == true){
		window.location = 'cellcast://action/assign/'+selection.selectionType+'/'+selection.id+'/true';
	} else {
		window.location = 'cellcast://action/assign/'+selection.selectionType+'/'+selection.id+'/false';
	}
	//smartRefresh();
}

/*
function readAnnouncement(id){
	var temp = itemsByAttribute(messages.announcements, 'id', id)[0];
	$.fallr('show', {
	    content : '<p>'+temp.text+'</p>',
	    position: 'center'
	});
}

function readNotification(id){
	var temp = itemsByAttribute(messages.notifications, 'id', id)[0];
	$.fallr('show', {
	    content : '<p>'+temp.text+'</p>',
	    position: 'center'
	});
}
*/
function render(collection, template, target, settings){
	//console.log(collection);
	console.log(settings)
	if(collection.length < 1){
		return true;
	}
	$(target).html('');
	var that = this;
	$.each(collection, function(){

		if(typeof(settings.template) == 'object'){
			//get template id based on template map
			switch(this.assignType){
				case 'nugget':
					var current_tmpl = settings.template.nuggets ? settings.template.nuggets : settings.template.default;
					break;
				case 'course':
					var current_tmpl = settings.template.courses ? settings.template.courses : settings.template.default;
					break;
				case 'assessment':
					var current_tmpl = settings.template.assessments ? settings.template.assessments : settings.template.default;
					break;
				case 'activity':
					var current_tmpl = settings.template.activities ? settings.template.activities : settings.template.default;
					break;
				case 'scorm':
					var current_tmpl = settings.template.scorm ? settings.template.scorm : settings.template.default;
					break;
				case 'skillprofile':
					var current_tmpl = settings.template.skillprofiles ? settings.template.skillprofiles : settings.template.default;
					break;
				case 'announcement':
					var current_tmpl = settings.template.announcements ? settings.template.announcements : settings.template.default;
					break;
				case 'notification':
					var current_tmpl = settings.template.notification ? settings.template.notification : settings.template.default;
					break;
				default:
					var current_tmpl = settings.template.default
					break;
			}
			var listItem = $(current_tmpl).clone();
		} else {
			var listItem = $(settings.template).clone();
		}
		

		// var listItem = $(settings).clone();
		
		listItem.find('[data-scurl="assignment"]').attr('href', "cellcast://"+this.assignType+"/"+this.id+"/false");
		listItem.find('[data-scurl="announcement"]').attr('href', "cellcast://announcement/"+this.id);
		listItem.find('[data-scurl="notification"]').attr('href', "cellcast://notification/"+this.id);
		listItem.find('[data-scurl="assignment-li"]').attr('data-url', "cellcast://"+this.assignType+"/"+this.id+"/true");
		listItem.find('[data-scurl="assignment-false"]').attr('data-url', "cellcast://"+this.assignType+"/"+this.id+"/false");
		listItem.find('[data-scurl="announcement-li"]').attr('data-url', "cellcast://announcement/"+this.id);
		listItem.find('[data-scurl="notification-li"]').attr('data-url', "cellcast://notification/"+this.id);
		listItem.find('[data-scurl="gameprofile-li"]').attr('data-url', "cellcast://menu/gameprofiles"+this.id);
		listItem.find('[data-scurl="library"]').attr('href', "cellcast://action/assign/"+this.selectionType+"/"+this.id+"/true");
		listItem.find('[data-scurl="gameprofile"]').attr('href', 'cellcast://menu/gameprofiles/'+this.id);
		
		//listItem.find('[data-tmpl="launchBtn"]').attr('onclick', 'selectionLaunch('+this.id+')');
		
		if(listItem.find('[data-tmpl="action"]')){
			if(this.status){
				//assume this is an assignment
				listItem.find('[data-tmpl="action"]').attr({
					'data-url':'cellcast://'+this.assignType+'/'+this.id+'/true',
					'data-role':'cellcast'
				});
				listItem.find('[data-tmpl="actionTitle"]').html('view');
			} else {
				//assume this is a catalog item
				listItem.find('[data-tmpl="action"]').attr('onclick', 'selectionLaunch('+this.id+')');
				listItem.find('[data-tmpl="actionTitle"]').html('assign');
			}
		}

		listItem.find('[data-id]').attr('data-id', this.id);

		if(listItem.find('[data-tmpl="thumb"]').length > 0){
			if(this.image.length > 0){
				listItem.find('[data-tmpl="thumb"]').attr('src', imgpath+this.image);
			} else {
				if(this.assignType){
					if(this.assignType == 'nugget'){
						if(this.type == 'video'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
						}
						if(this.type == 'audio'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
						}
						if(this.type == 'powerpoint'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
						}
						if(this.type == 'cellcast'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
						}
						if(this.type == 'html'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
						}
						if(this.type == 'pdf'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
						}
					}
					if(this.assignType == 'testset'){
						listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
					}
					if(this.assignType == 'course'){
						listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
					}
					if(this.assignType == 'scorm'){
						listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
					}
					if(this.assignType == 'skillprofile'){
						listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
					}
				} 						
				listItem.find('[data-tmpl="thumb"]').attr('src', 'lib/img/thumbs/sample.png');
			}
		}
	
		listItem.find('[data-tmpl="game_title"]').html(this.game_name);
		listItem.find('[data-tmpl="game_description"]').html(this.game_description);
		listItem.find('[data-tmpl="game_total_points"]').html(this.game_points);
		listItem.find('[data-tmpl="game_earned_points"]').html(this.user_points);
		listItem.find('[data-tmpl="game_progress"]').html((Math.floor(this.user_points/this.game_points)*100)+'%');
		
		listItem.find('[data-tmpl="title"]').html(this.name);
		listItem.find('[data-tmpl="description"]').html(this.description);
		listItem.find('[data-tmpl="status"]').html(this.status);
		listItem.find('[data-tmpl="duration"]').html(this.duration);
		listItem.find('[data-tmpl="text"]').html(this.text);
		if(this.metatags){
			listItem.find('[data-tmpl="metatags"]').html(this.metatags);
		}
		
		if(listItem.find('[data-tmpl="type_icon"]')){
			if(this.type){
				listItem.find('[data-tmpl="type"]').html(this.type);
				if(this.type == 'video'){
					listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
				}
				if(this.type == 'audio'){
					listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
				}
				if(this.type == 'powerpoint'){
					listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
				}
				if(this.type == 'cellcast'){
					listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
				}
				if(this.type == 'html'){
					listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
				}
				if(this.type == 'pdf'){
					listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
				}
			} else {
				listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
			}
		}

		if(listItem.find('[data-tmpl="category"]')){
			if(this.metatags){
				listItem.find('[data-tmpl="category"]').html(this.metatags[0]);
			}
		}

		if(this.assignType == 'activity'){
			listItem.find('[data-tmpl="title"]').html(this.activity_name);
			listItem.find('[data-tmpl="description"]').html(this.activity_desc);
			listItem.find('[data-tmpl="status"]').html(this.user_status);
		}

		//If this is a message
		listItem.find('[data-tmpl="msg_title"]').html(this.title);
		if(this.viewed){
			if(this.viewed == true){
				listItem.find('[data-tmpl="msg_status"]').attr('src', 'img/icons/message_read.png');
			} else {
				listItem.find('[data-tmpl="msg_status"]').attr('src', 'img/icons/message_unread.png');
			}
		}
		
		//if this is a completion status item
		if(this.status == 1 || this.sco_status == 1){
			// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_true.png');
			listItem.find('[data-tmpl="status-completion"]').addClass('passed');
		}
		if(this.status == 2 || this.sco_status == 2){
			// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_true.png');
			listItem.find('[data-tmpl="status-completion"]').addClass('complete');
		}
		if(this.status == 3 || this.sco_status == 3){
			// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_ip.png');
			listItem.find('[data-tmpl="status-completion"]').addClass('failed');
		}
		if(this.status == 4 || this.sco_status == 4){
			// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_ip.png');
			listItem.find('[data-tmpl="status-completion"]').addClass('incomplete');
		}
		if(this.status == 5 || this.sco_status == 5){
			// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_false.png');
			listItem.find('[data-tmpl="status-completion"]').addClass('browsed');
		}
		if(this.status == 6 || this.sco_status == 6){
			// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_false.png');
			listItem.find('[data-tmpl="status-completion"]').addClass('not_attempted');
		}
		if(this.status == 7 || this.sco_status == 7){
			// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_false.png');
			listItem.find('[data-tmpl="status-completion"]').addClass('declined');
		}
		if(this.status == 8 || this.sco_status == 8){
			// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_false.png');
			listItem.find('[data-tmpl="status-completion"]').addClass('provisional');
		}
		
		//if this item has an associated test
		if(listItem.find('[data-tmpl="status-test"]')){
			if(this.tests){
				if(this.tests.length > 0){
					listItem.find('[data-tmpl="status-test"]').addClass('test_associated');
					if(this.status == 1 || this.sco_status == 1){
						listItem.find('[data-tmpl="status-test"]').removeClass('test_associated');
						listItem.find('[data-tmpl="status-test"]').addClass('test_passed');
					}
					if(this.status == 2 || this.sco_status == 2){
						listItem.find('[data-tmpl="status-test"]').removeClass('test_associated');
						listItem.find('[data-tmpl="status-test"]').addClass('test_passed');
					}
					if(this.status == 3 || this.sco_status == 3){
						listItem.find('[data-tmpl="status-test"]').removeClass('test_associated');
						listItem.find('[data-tmpl="status-test"]').addClass('test_failed');
					}
				}else{
					listItem.find('[data-tmpl="status-test"]').remove();
				}
			}else{
				listItem.find('[data-tmpl="status-test"]').remove();
			}
		}

		if(this.assignType == 'skillprofile'){
			if(listItem.find('[data-tmpl="spItems"]').length > 0){
				console.log('Skillprofile with subitem template:');
				console.log(this);
				var spItems = this.items;
				$.each(spItems, function(){
					console.log('Subitem Processing:');
					var temp = itemsByAttribute(assignments.assignments, 'id', this.id);
					if(temp.length > 0){
						var spItem = temp[0];
						console.log('subitem id ['+spItem.id+']')
						console.log('subitem template ['+settings.itemtemplate+']')
						var spTmpl = $(settings.itemtemplate).clone();
												
						spTmpl.find('[data-scurl="assignment"]').attr('href', "cellcast://"+spItem.assignType+"/"+spItem.id+"/false");
						spTmpl.find('[data-tmpl="title"]').html(spItem.name);
						spTmpl.find('[data-tmpl="description"]').html(spItem.description);
						spTmpl.find('[data-tmpl="status"]').html(spItem.status);
						spTmpl.find('[data-tmpl="duration"]').html(spItem.duration);

						//if this is a completion status item
						console.log('item id ['+spItem.id+'] status ['+spItem.status+']')
						if(spTmpl.find('[data-tmpl="status-completion"]')){
							/*if(spItem.status){
								console.log('item id ['+spItem.id+'] status ['+spItem.status+']')
								if(spItem.status == 1){
									listItem.find('[data-tmpl="sco_status"]').addClass('sco_status_complete');
									listItem.find('[data-tmpl="test_status"]').removeClass('test_associated');
									listItem.find('[data-tmpl="test_status"]').addClass('test_passed');
								}
								if(spItem.status == 2){
									spTmpl.find('[data-tmpl="sco_status"]').addClass('sco_status_complete');
								}
								if(spItem.status == 4){
									spTmpl.find('[data-tmpl="sco_status"]').addClass('sco_status_incomplete');
								}
								if(spItem.status == 6){
									spTmpl.find('[data-tmpl="sco_status"]').addClass('sco_status_notattempted');
								}
							}*/

							if(spItem.status || spItem.sco_status){
								if(spItem.status == 2 || spItem.sco_status == 2){
									spTmpl.find('[data-tmpl="status-completion"]').addClass('complete');
								}
								if(spItem.status == 4 || spItem.sco_status == 4){
									spTmpl.find('[data-tmpl="status-completion"]').addClass('incomplete');
								}
								if(spItem.status == 6 || spItem.sco_status == 6){
									spTmpl.find('[data-tmpl="status-completion"]').addClass('not_attempted');
								}
							}
							if(spItem.tests){
								if(spItem.tests.length > 0){
									spTmpl.find('[data-tmpl="status-test"]').addClass('test_associated');
									if(spItem.status == 1 || spItem.sco_status == 1){
										spTmpl.find('[data-tmpl="status-completion"]').addClass('complete');
										spTmpl.find('[data-tmpl="status-test"]').removeClass('test_associated');
										spTmpl.find('[data-tmpl="status-test"]').addClass('test_passed');
									}
									if(spItem.status == 3 || spItem.sco_status == 3){
										spTmpl.find('[data-tmpl="status-completion"]').addClass('incomplete');
										spTmpl.find('[data-tmpl="status-test"]').removeClass('test_associated');
										spTmpl.find('[data-tmpl="status-test"]').addClass('test_failed');
									}
								} else {
									spTmpl.find('[data-tmpl="status-test"]').remove();
								}
							} 
							else {
								spTmpl.find('[data-tmpl="status-test"]').remove();
							}
						}
						
						if(spItem.image != null){
							spTmpl.find('[data-tmpl="thumb"]').attr('src', imgpath+"/"+spItem.image);
						} else {
							spTmpl.find('[data-tmpl="thumb"]').attr('src', "lib/img/thumbs/sample.png");
						}
						listItem.find('[data-tmpl="spItems"]').append(spTmpl.children());
					}
					
				});
			}
		}
		
		listItem.children().appendTo(target); 
	});
}

function sorting(settings, collection){
	var sorted = collection;
	if(settings.orderascending){
		sorted = orderByTagAscending(sorted, settings.orderascending);
	}
	else if(settings.orderdescending){
		sorted = orderByTagDescending(sorted, settings.orderdescending);
	}
	else {
		sorted = sortName(sorted);
	}
	return sorted;

}

function filter(settings, collection){
	opui.console.log('filtering')

	var filtered = collection;

	// //filter for category and/or tags
	// if (settings.category || settings.tags){
	// 	if(settings.category && settings.tags){
	// 		console.log("both detected!");
	// 		var tags = settings.tags.split(',');
	// 		var catArray = queryByCategory(collection, settings.category);
	// 		var tagArray = queryByTags(catArray, tags, settings.rule);
	// 		var filtered = tagArray;
	// 	}
	// 	if(settings.category && !settings.tags){
	// 		console.log("JUST category detected");
	// 		var filtered = queryByCategory(collection, settings.category);
	// 	}
	// 	if(!settings.category && settings.tags){
	// 		console.log("JUST tags detected");
	// 		var tags = settings.tags.split(',');
	// 		var filtered = queryByTags(collection, tags, settings.rule);
	// 	}
	// 	return filtered;
	// } else {
	// 	return sortName(collection);
	// }

	// if(settings.orderascending || settings.orderdescending){
	// 	opui.console.log('ordering by tag')
	// 	if(settings.orderdescending){
	// 		filtered = orderByTagDescending(filtered, settings.orderdescending);
	// 	}
	// 	if(settings.orderascending){
	// 		filtered = orderByTagAscending(filtered, settings.orderascending);
	// 	}	
	// } else {
	// 	filtered = sortName(filtered);
	// }

	if(settings.category){
		filtered = queryByCategory(filtered, settings.category);
	}
	if(settings.tags){
		var tags = settings.tags.split(',');
		filtered = queryByTags(filtered, tags, settings.rule);
	}
	return filtered;
}

function process(settings){
	if(settings.collection){
		switch (settings.collection){
			case 'library':
				var collection = library ? library.items : null;
				break;
			case 'catalog':
				var collection = library ? library.items.concat(assignments.assignments) : null;
				break;
			case 'assignments':
				if(settings.subset){
					var collection = assignments ? assignments[settings.subset] : null;
				} else {
					var collection = assignments ? assignments.assignments : null;
				}
				break;
			case 'games':
				var collection = games ? games.games : null;
				break;
			case 'announcements':
				var collection = messages ? messages.announcements : null;
				break;
			case 'notifications':
				var collection = messages ? messages.notifications : null;
				break;
			case 'status':
				if(settings.subset){
					switch(settings.subset){
						case 'nuggets':
							var collection = mystatus ? mystatus.nuggets : null;
							break;
						case 'courses':
							var collection = mystatus ? mystatus.courses : null;
							break;
						case 'assessments':
							var collection = mystatus ? mystatus.assessments :  null;
							break;
						case 'skillprofiles':
							var collection = mystatus ? mystatus.skillprofiles : null;
							break;
					}
				} else {
					var collection = mystatus ? mystatus.items : null;
				}
				break;
		}
	}
	if(settings.skillprofile){
		if(assignments){
			var spList = getSkillList(settings.skillprofile);
			var collection = [];
			for (var i=0; i < spList.length; i++){
				var temp = itemById(assignments.assignments, spList[i].id);
				collection.push(temp);
			}
		} else {
			var collection = null;
		}
		
	}

	if(settings.detail){
		if(assignments){
			var item = itemById(assignments.assignments, settings.detail);
			if(item.assignType == 'skillprofile'){
				var collection = getSkillList(item.id);
			} else {
				var collection = [];
				collection.push(item);
			}
		} else {
			var collection = null;
		}
		
	}

	if(settings.optional == "optional"){
		if(assignments){
			var collection = optionalItems(assignments.assignments);
		} else {
			var collection = null;
		}
		
	}
	if(settings.optional == "required"){
		if(assignments){
			var collection = requiredItems(assignments.assignments);
		} else {
			var collection = null;
		}
	}

	return collection;
}

function getHash(data){
	var temp = JSON.stringify(data);
	return temp.hashCode();
}



(function ($){

$.fn.listItems = function(){
	opui.console.log('list items running');
	
	var defaults;
	
	
	return this.each(function(){
		var $this = $(this);

		var options = $this.data();
		var settings = $.extend(defaults, options);
		var collection = process(settings);
		if(collection == null){
			opui.console.log('collection is null')
			return true;
		}
		collection = filter(settings, collection);
		collection = sorting(settings, collection);
		// var hash = getHash(collection);

		// if(options.refreshHash){
		// 	if(options.refreshHash === hash){
		// 		return true;
		// 	} else {
		// 		$this.data({'refreshHash':hash});
		// 		render(collection, settings.template, $this, settings);
		// 	}
		// } else {
		// 	$this.data({'refreshHash':hash});
		// 	render(collection, settings.template, $this, settings);
		// }
		render(collection, settings.template, $this, settings);


	});
	opui.console.log('list items finished');
	
};

})(jQuery);
