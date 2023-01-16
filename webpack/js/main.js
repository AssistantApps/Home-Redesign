import * as jQuery from './jquery.min.js';

(function ($) {

	var $window = $(window),
		$body = $('body');

	// Play initial animations on page load.
	$window.on('load', function () {
		$body.removeClass('is-preload');
	});
})(jQuery);