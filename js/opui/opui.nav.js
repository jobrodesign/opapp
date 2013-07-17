// OPUI.NAV.JS - v1.0.0 - 04/18/2013
$(function(){

// ------------------------------------------------------------
//  Set default variables
// ------------------------------------------------------------
	var docWidth 		= $(document).width(),
		docHeight 		= $(document).height(),
		navigation		= $('#wrapper-navigation'),
		loadNavigation  = $('#load-navigation'),
		content			= $('#wrapper-container'),
		set 			= false,
		landscapePos	= 'left',
		portraitPos		= 'right';

// ------------------------------------------------------------
//  Load Navigation Dynamically
// ------------------------------------------------------------
	loadNav = function(url){
		loadNavigation.html('').load(url, function(){
			navScroll = new iScroll('wrapper-navigation', { bounce:true, momentum:true, preventGhostClick:true});
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		}).fadeTo(200, 1, function(){
			//stopSpinner();
		});
	}
	loadNav('pgs/navigation/navigation-01.html'); // Run loadNav() as soon as it's ready

// ------------------------------------------------------------
//  Show Navigation
// ------------------------------------------------------------
	showNav = function(){
		content.removeClass('closed').addClass('expanded');
		if(docWidth > docHeight){
			navigation.addClass(landscapePos)
			content.addClass(landscapePos).addClass('fit')
		} else {
			navigation.addClass(portraitPos)
			content.addClass(portraitPos).addClass('push')
		}	
	};

// ------------------------------------------------------------
//  Hide Navigation
// ------------------------------------------------------------
	hideNav = function(){
		content.removeClass('expanded fit push').addClass('closed');
	};

// ------------------------------------------------------------
//  Set Inital Navigation State
// ------------------------------------------------------------
	setNav = function(){
		if(docWidth > docHeight){
			if(docHeight > 550)
				$('[data-trigger="nav"]').css('display', 'none')
				$('.branding').css('display', 'none')
				showNav();
				if(set == false){
					setTimeout(function(){
						content.addClass('anim')
				}, 1000);
			} else {
				$('[data-trigger="nav"]').css('display', 'table')
				$('#copyright').css('display', 'none')
				$('.branding').css('display', 'inline-block')
				content.addClass('closed')
				if(set == false){
						setTimeout(function(){
							content.addClass('anim')
					}, 1000);
				}
			}
		} else if(docWidth < docHeight) {
			$('[data-trigger="nav"]').css('display', 'table')
			$('#copyright').css('display', 'none')
			$('.branding').css('display', 'inline-block')
			content.addClass('closed')
			if(set == false){
					setTimeout(function(){
						content.addClass('anim')
				}, 1000);
			}
		} else if(docWidth == docHeight){
			$('[data-trigger="nav"]').css('display', 'table')
			$('#copyright').css('display', 'none')
			$('.branding').css('display', 'inline-block')
			content.addClass('closed')
			if(set == false){
					setTimeout(function(){
						content.addClass('anim')
				}, 1000);
			}
		}
		// Change 'set' value to true after first run
		set = true;
	};
	setNav(); // Run setNav() as soon as it's ready

// ------------------------------------------------------------
//  Toggle Navigation Visibility
// ------------------------------------------------------------
	toggleNav = function(){
		if(content.hasClass('closed')){
			showNav();
		} else {
			hideNav();
		}
	};

	$('body').hammer().on('release', "[data-trigger='nav']", function(e){
		e.preventDefault();
		toggleNav();
	});
	
	$('body').hammer().on('release', "#wrapper-navigation", function(e){
		if($('#wrapper-navigation').hasClass('right')){
			e.preventDefault();
			toggleNav();
		}
	});
	
// ------------------------------------------------------------
//  Determine What To Do When Window is Resized
// ------------------------------------------------------------
	$(window).resize(function(){
		docWidth	= $(document).width();
		docHeight 	= $(document).height();

		if(docWidth > docHeight){
			if(docHeight > 550){
				content.removeClass('expanded fit push').removeClass(portraitPos)
				navigation.removeClass(portraitPos)
				$('[data-trigger="nav"]').css('display', 'none')
				$('#copyright').css('display', 'block')
				$('.branding').css('display', 'none')
				showNav();
			} else {
				$('[data-trigger="nav"]').css('display', 'table')
				$('#copyright').css('display', 'none')
				$('.branding').css('display', 'inline-block')
				hideNav();
			}
		} else if(docWidth < docHeight) {
			content.removeClass(landscapePos)
			navigation.removeClass(landscapePos)
			$('[data-trigger="nav"]').css('display', 'table')
			$('#copyright').css('display', 'none')
			$('.branding').css('display', 'inline-block')
			hideNav();
		} else if(docWidth == docHeight){
			content.removeClass(landscapePos).removeClass(portraitPos)
			navigation.removeClass(landscapePos).removeClass(portraitPos)
			$('[data-trigger="nav"]').css('display', 'table')
			$('#copyright').css('display', 'none')
			$('.branding').css('display', 'inline-block')
			hideNav();
		}
	});
});