$(function() {

	$(".navbar-collapse").mmenu({
		wrappers: ["bootstrap4"],
		navbar: {
			title: ""
		}
   });

	// Fancybox

	$("[data-fancybox]").fancybox();

	
	// Mask

	$("input[name='phone']").mask("+7 (999) 999-9999");


	// Parallax

	var p = new Parallax('.parallax', {
		offsetYBounds: 50,
		intensity: 15,
		center: 0.5,
		safeHeight: 0.15
	}).init();


	// Sliders

	var $sliderStatus = $('.pagingInfo');
	var $promoSlider = $('.promo-slider');

	$promoSlider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
		var i = (currentSlide ? currentSlide : 0) + 1;
		$sliderStatus.html("<span class='current'>0" + i + "</span> " + "<span class='overall'>/0" + slick.slideCount + "</span>");
	});

	$promoSlider.slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
  		autoplaySpeed: 15000,
		infinity: true,
		arrows: false,
		dots: false,
		fade: true,
		responsive: [{
			breakpoint: 480,
			settings: {
				adaptiveHeight: true
			}
		}]
	});


/*--Search form-----------------------*/

	$('.search-wrap').on("click", function(event) {
		event.stopPropagation();
		$(this).addClass('active');
	});

	$(window).on("click", function(event) {
		if (!$(event.target).closest(".search-wrap").length) {
			if ($(".search-wrap").hasClass("active")) {
				$(".search-wrap").removeClass("active");
			}
		}
	});

});


// load SVG-Sprite to LocalStorage

;( function( window, document ) {
	'use strict';

	var file = 'img/sprite.svg',
	revision = 3;

	if( !document.createElementNS || !document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect )
		return true;

	var isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
	request,
	data,
	insertIT = function()
	{
		document.body.insertAdjacentHTML( 'afterbegin', data );
	},
	insert = function()
	{
		if( document.body ) insertIT();
		else document.addEventListener( 'DOMContentLoaded', insertIT );
	};

	if( isLocalStorage && localStorage.getItem( 'inlineSVGrev' ) == revision )
	{
		data = localStorage.getItem( 'inlineSVGdata' );
		if( data )
		{
			insert();
			return true;
		}
	}

	try
	{
		request = new XMLHttpRequest();
		request.open( 'GET', file, true );
		request.onload = function()
		{
			if( request.status >= 200 && request.status < 400 )
			{
				data = request.responseText;
				insert();
				if( isLocalStorage )
				{
					localStorage.setItem( 'inlineSVGdata',  data );
					localStorage.setItem( 'inlineSVGrev',   revision );
				}
			}
		}
		request.send();
	}
	catch( e ){}

}( window, document ) );