var opui = opui || {};

//methods
opui.search = (function(){

	//private methods
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

	function queryByCategory(collection, term){	
		return (collection.filter(function(element, index, array){
				return (element.category === term)
		}))
	}

	function queryName(collection, query) {	
		return (collection.filter(function(element, index, array){
			if(element.activity_name){
				return (element.activity_name.toLowerCase().search(query) != -1)
			} else {
				return (element.name.toLowerCase().search(query) != -1)
			}
		}));
	}

	function queryTags(collection, query){
		return(collection.filter(function(element, index, array){
			return (element.metatags.toLowerCase().search(query) != -1)
		}));
	}

	function queryDescription(collection, query) {	
		return (collection.filter(function(element, index, array){
			if(element.activity_desc){
				return (element.activity_desc.toLowerCase().search(query) != -1)
			} else {
				return (element.description.toLowerCase().search(query) != -1)
			}
		}));
	}

	function containsObject(obj, list) {
	    var i;
	    for (i = 0; i < list.length; i++) {
	        if (list[i].id === obj.id) {
	            return true;
	        }
	    }
	    return false;
	}

	function processQuery(query){
		var query = query.toLowerCase();
		// var re = /\W/g;
		var re = /\s*(\s|,|=>)\s*/g;
		var q = [];
		q.push(query);
		query.split(re).forEach(function(e,i,a){
			q.push(e)
		});
		q = $.grep(q, function(e){
			return (e != 'and' && e != 'or' && e != '' && e != ',' && e != ' ');
		});
		q = $.unique(q);
		return(q)	
	}

	function addOrRank(staged, results){
		staged.forEach(function(e,i,a){
			if(!e.rank){
				e.rank = 1;
			}
			if(containsObject(e, results)){
				e.rank++ 
			} else {
				results.push(e);
			}
		})
		return results;
	}

	function sortByRank(collection){
		return (collection.sort(function(a,b){
				var rankA = a.rank, rankB = b.rank
				if(rankA > rankB) //sort string descending
					return -1
				if (rankA < rankB)
					return 1
				return 0 //default return value (no sorting)
		}))
	}


	//public api
	return {
		term: function(collection, query){
			if(collection == 'assignments'){
				var set = assignments.assignments;
			}
			if(collection == 'catalog'){
				var set = catalog;
			}
			if(collection == 'library'){
				var set = library.items;
			}
			var q = processQuery(query)
			opui.console.log(q)
			var results = [];
			for (var i=0; i < q.length; i++){
				opui.console.log(q[i]);
				opui.console.log(results);
		        results = addOrRank(queryName(set, q[i]), results);
				results = addOrRank(queryTags(set, q[i]), results);
				results = addOrRank(queryDescription(set, q[i]), results);
		    }
		    results = sortByRank(results);
		    return results;
		},
		tags: function(collection, query){
			if(typeof(query) == 'string'){
				var q = [query]
				var results = queryByTags(collection, q, 'inclusive');
				return results;
			} else {
				var results = queryByTags(collection, query, 'inclusive');
				return results;
			}
		},
		category: function(collection, query){
			var results = queryByCategory(collection, query);
			return results;
		}
	}

})();

//bindings
$(function(){
	// var searchButton = $('[data-role="search-button"]');
	// var searchField = $('[data-role="search-field"]');
	// var searchTerm = $('[data-role="search-term"]');
	// var searchClear = $('[data-role="search-clear"]');
	// var searchResults = $('[data-role="search-results"]');
	// var curTerm = $('#curTerm');

	$('body').hammer().on('tap', '[data-role="search-button"]', function(e){
		e.preventDefault();
		var settings = $('[data-role="search-results"]').data();
		var q = $('[data-role="search-term"]').val().toLowerCase();
		var results = opui.search.term(settings.collection, q);
		render(results, settings.template, $('[data-role="search-results"]'), settings);
		$('#curTerm').html($('[data-role="search-term"]').val());
		$('[data-role="search-results"]').fadeIn();      
	});

	$('body').hammer().on('keypress', '[data-role="search-term"]', function (e){      
		if (e.keyCode == 13){  
			$('[data-role="search-term"]').blur();      
			var settings = $('[data-role="search-results"]').data();
			var q = $('[data-role="search-term"]').val().toLowerCase();
			var results = opui.search.term(settings.collection, q);
			render(results, settings.template, $('[data-role="search-results"]'), settings);
			$('#curTerm').html($('[data-role="search-term"]').val());
			$('[data-role="search-results"]').fadeIn();      
		}      
	});

	$('body').hammer().on('tap', '[data-role="search-clear"]', function(e){
		e.preventDefault();
		$('[data-role="search-results"]').html('');
		$('[data-role="search-term"]').val('');
		$('#curTerm').html('');
	});
})