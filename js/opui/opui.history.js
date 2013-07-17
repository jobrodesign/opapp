// OPUI.HISTORY.JS - v1.0.1 - 04/18/2013
$(function() {

// ------------------------------------------------------------
//  Set default variables
// ------------------------------------------------------------
	var wrapper 	= $('#wrapper-content'),
		content 	= $('#load-content'),
		navigation  = $('#load-navigation'),
		navItem 	= $('.nav-list li div'),
		navClass 	= 'selected',
		backBtn     = $('#back-btn'),
		errorPg 	= 'pgs/error/error.html',
		timeoutPg	= 'pgs/error/timeout.html',
		_historyUrl	= [], // stores the url for each history entry
		_historyNav = [], // stores the nav item target for each history entry
		_historyObj = []; // stores the cloned content of the touched object

// ------------------------------------------------------------
//  Push url and nav position into respective arrays
// ------------------------------------------------------------
	stepPush = function(url,nav,obj){
		console.log(':: Pushing current states to their respective arrays')
		_historyUrl.push(url);
		_historyNav.push(nav);
		_historyObj.push(obj);

		var urlLength 	= _historyUrl.length;
		var navLength  	= _historyNav.length;
		var objLength 	= _historyObj.length;

		if(urlLength >= 2){
			var indexEnd = _historyUrl[urlLength - 1]; // Last entry in the array
			var indexStl = _historyUrl[urlLength - 2]; // Second to last entry in the array
			if(indexStl == indexEnd){
				// Remove duplicate entry
				indexRemove = _historyUrl.length - 1;
				_historyUrl.splice(indexRemove, 1);
			}
		}
	}

// ------------------------------------------------------------
//  Move back to the last url in the history array
// ------------------------------------------------------------
	stepBack = function(){
		console.log(':: Stepping back one entry in the history')
		removeLast()
		var urlTarget = _historyUrl.length - 1;
		var navTarget = _historyNav.length - 1;
		var objTarget = _historyObj.length - 1;
		if(urlTarget >= 0){
			hideCurrent(_historyUrl[urlTarget], _historyNav[navTarget], _historyObj[objTarget]);
		} else {
			// do nothing
		}
	}

// ------------------------------------------------------------
//  Hide the visible content
// ------------------------------------------------------------
	hideCurrent = function(url,nav,obj){
		console.log(':: Hiding visible content in the loading area')
		$('article', content).fadeTo(100,0,function(){
			//startSpinner();
			navPos = navigation.find('.'+navClass).parent().data('nav');
			if(navPos != nav){
				$('.nav-list li div').removeClass(navClass)
				var toSelect = navigation.find("[data-nav='" + nav + "']").children('div').addClass(navClass);
			} else {
				// do nothing
			}
			loadTarget(url,obj)
		});
		if(_historyUrl.length == 1){
			// Animate footer into place
			if(backBtn.css('bottom') == '-60px'){
				// do nothing
			} else {
				backBtn.animate({
					bottom:'-=68'
				}, 100);
			}
		}
	}

// ------------------------------------------------------------
//  Load the target URL
// ------------------------------------------------------------
	loadTarget = function(url,obj){
		loadPage(url);
	}

// ------------------------------------------------------------
//  Load standard page from target
// ------------------------------------------------------------
	loadPage = function(url,obj){
		console.log(':: Loading content from target url')
		content.html('').load(url, "", function(responseText, textStatus, XMLHttpRequest){
			if(textStatus == 'error' || textStatus == 'abort' || textStatus == 'parseerror'){
				content.html('').load(errorPg)
			} else if(textStatus == 'timeout'){
				content.html('').load(timeoutPg)
			} else if(textStatus == 'success' || textStatus == 'notmodified'){
				bodyScroll = new iScroll('wrapper-content', { bounce:true, momentum:true, preventGhostClick:true});
				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
				if($('ul').hasClass('enhance')){
					$('.enhance').listItems();
				} else {
					// do nothing
				}
			}
		}).fadeTo(200, 1, function(){
			//stopSpinner();
		});

		if(_historyUrl.length > 1){
			if(backBtn.css('bottom') == '-60px'){
				backBtn.animate({
					bottom:'+=68'
				}, 100);
			} else {
				// do nothing
			}
		}
	}

// ------------------------------------------------------------
//  Remove the last items entered into history
// ------------------------------------------------------------
	removeLast = function(){
		console.log('Removing last item in history')
		if(_historyUrl.length > 1){
			urlIndexRemove = _historyUrl.length - 1;
			navIndexRemove = _historyNav.length - 1;
			objIndexRemove = _historyObj.length - 1;
			_historyUrl.splice(urlIndexRemove, 1);
			_historyNav.splice(navIndexRemove, 1);
			_historyObj.splice(objIndexRemove, 1)
		} else {
			// do nothing
		}
	}

// ------------------------------------------------------------
//  Load the initial content
// ------------------------------------------------------------
	stepPush('pgs/home/home.html', 'home', null);
	loadTarget('pgs/home/home.html', null); 

// ------------------------------------------------------------
//  Replace touch event for AJAX targets
// ------------------------------------------------------------
	$('body').hammer().on('tap', "[data-role='ajax']", function(e){
		e.preventDefault();
		var item   = $(this);
		var target = item.data('url');
		var navPos = item.data('nav');
		var clone  = item.clone(true);

		stepPush(target,navPos,clone);
		hideCurrent(target,navPos,clone);
	});

// ------------------------------------------------------------
//  Replace touch event for UI back button
// ------------------------------------------------------------
	$('body').hammer().on('touch', "[data-trigger='back']", function(){
		$('#back-btn').addClass('touch');
	});

	$('body').hammer().on('release', "[data-trigger='back']", function(){
		$('#back-btn').removeClass('touch');
		stepBack();
	});
});