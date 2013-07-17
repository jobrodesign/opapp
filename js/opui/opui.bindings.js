// Project Bindings

// ------------------------------------------------------------
//  Replace touch events for standard UI buttons
// ------------------------------------------------------------
$('body').hammer().on('touch', '.button', function(e){
	e.preventDefault();
	$(this).addClass('touch');
});

$('body').hammer().on('release', '.button', function(e){
	e.preventDefault();
	$(this).removeClass('touch');
});

// ------------------------------------------------------------
//  Replace touch events for 'selectable' items
// ------------------------------------------------------------
$('body').hammer().on('touch', '.selectable', function(){
	$(this).addClass('inverse');
});

$('body').hammer().on('release', '.selectable', function(){
	$(this).removeClass('inverse');
});

// ------------------------------------------------------------
//  Replace touch events for 'CellCast' items
// ------------------------------------------------------------
$('body').hammer().on('tap', "[data-role='cellcast']", function(e){
	e.preventDefault();
	console.log('A CellCast item has been launched.')
	var scurl = $(this).data('url');
	window.location = scurl;
});

// ------------------------------------------------------------
//  Replace touch events for 'Content' items
// ------------------------------------------------------------
$('body').hammer().on('tap', "[data-role='content']", function(e){
	e.preventDefault();
	var scurl = $(this).data('url');
	opui.update(scurl)
});

// ------------------------------------------------------------
//  Replace touch events for 'Demo' pages
// ------------------------------------------------------------
$('body').hammer().on('tap', "[data-role='demo']", function(e){
	e.preventDefault();
	alert('This feature is coming soon.')
});

// ------------------------------------------------------------
//  Replace touch events for slide navigation toggle
// ------------------------------------------------------------
$('body').hammer().on('release', "[data-trigger='menu']", function(e){
	e.preventDefault();
	toggleNav();
});
/*
$('body').hammer().on('release', "#navigation", function(e){
	if($('#navigation').hasClass('right')){
		e.preventDefault();
		toggleNav();
	}
});
*/
// ------------------------------------------------------------
//  Replace touch events for 'Debug'
// ------------------------------------------------------------
$('body').hammer().on('tap', "[data-role='debug']", function(e){
	e.preventDefault();

	var ip = prompt('Enter your IP:PORT Address here');

    $('head').prepend('<script src="http://'+ip+'/target/target-script-min.js"></script>');
});