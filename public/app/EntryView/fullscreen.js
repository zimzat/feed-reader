(function (angular, $) {
	var dep = {};
	angular.module('Reader.EntryView').service('FullscreenSlideshow', function ($rootScope, ListResult) {
		return fullScreenSlideshow($, $rootScope, ListResult);
	});

	var fullScreenSlideshow = (function ($, $rootScope, ListResult) {
		var activeImg = 0,
			slideDelay = 8,
			activeMode = false,
			readerPageIntervalTimer,
			entry = {};

		function createBackgroundCover() {
			return $(
				'<div class="background-cover" style=" text-align: left; color: white; background-color: black; z-index: 9999; position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: block; "></div>'
				);
		}

		$rootScope.$on('$locationChangeSuccess', function(event, newLocation) {
			if (newLocation.indexOf('/entry/') === -1) {
				stop();
			}
		});
		$rootScope.$on('entryLoaded', function(event, newEntry) {
			entry = newEntry;
			activeImg = 0;
			if (isActive()) {
				$('img:first').on('load', function () {
					activeImg--;
					resizeAndRotateImages();

					resetTimer();
				});
				resizeAndRotateImages();
			}
		});

		function resizeAndRotateImages() {
			window.scrollTo(0, 1);

			var $window = $(window),
				winHeight = $window.height(),
				winWidth = $window.width(),
				$imgs = $('img'), $img;

			if (!$imgs.length) {
				/* No img, do nothing. */
			} else {
				$imgs.hide();
				$img = $($imgs.get(activeImg));
				activeImg++;

				/* blast the one image across the window */
				var imgWidth = $img.width(),
					imgHeight = $img.height();

				if (imgWidth / imgHeight > winWidth / winHeight) {
					$img.width(winWidth);
					$img.height(imgHeight * (winWidth / imgWidth));
				} else {
					$img.height(winHeight);
					$img.width(imgWidth * (winHeight / imgHeight));
				}

				$img.css({
					'z-index': 10000 + activeImg,
					position: 'absolute',
					left: ((winWidth - $img.width()) / 2) + 'px',
					top: ((winHeight - $img.height()) / 2) + 'px'
				}).show();

				var $cover = $('.background-cover');
				if (!$cover.length) {
					$cover = createBackgroundCover();
				}
				$cover.prependTo($(document.body));

				$cover.text([activeImg, '/', $imgs.length, ', ', ListResult.remaining()].join(''));
				if (entry.isMarked) {
					$cover.append(' &lowast;');
				}
			}
		}

		function hasPrevious() {
			return (activeImg > 1);
		}

		function prevImg() {
			if (hasPrevious()) {
				activeImg -= 2;
				resizeAndRotateImages();
			} else {
				operations.goPreviousEntry();
			}
		}

		function hasNext() {
			return (activeImg < $('.article-content img').length);
		}

		function nextImg() {
			if (hasNext()) {
				resizeAndRotateImages();
			} else {
				operations.goNextEntry();
			}
		}

		function enable() {
			activeMode = true;
			activeImg = 0;

			var $cover = $('.background-cover');
			if (!$cover.length) {
				$cover = createBackgroundCover();
			}
			$cover.prependTo($(document.body));

			$('img:first').on('load', function () {
				resizeAndRotateImages();

				resetTimer();
			});
			$(window).on('resize.autoforward', function () {
				activeImg--;
				resizeAndRotateImages();
			});

			resizeAndRotateImages();

			setDisplayMode('paused');
		}

		function setDisplayMode(mode) {
			switch (mode) {
				case 'off':
					$('body, html').attr('style', '');
					break;

				case 'paused':
					$('body, html').css({
						'background-color': '#202020',
						cursor: 'none',
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: 0,
						right: 0
					});
					$('.background-cover').css({'background-color': '#202020'});
					break;

				case 'on':
					$('body, html').css({
						'background-color': 'black',
						cursor: 'none',
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: 0,
						right: 0
					});
					$('.background-cover').css('background-color', 'black');
					break;

				default:
					alert('Invalid mode given: ' + mode);
					break;
			}
		}

		function pausePlay() {
			if (!activeMode) {
				return;
			}

			if (isTimerRunning()) {
				stopTimer();

				setDisplayMode('paused');
			} else {
				startTimer();

				setDisplayMode('on');
			}
		}

		function stop() {
			activeMode = false;

			stopTimer();
			$(window).off('.autoforward');

			$('.background-cover').remove();
			$('img').show().removeAttr('style');

			if (window.document.mozCancelFullScreen) {
				window.document.mozCancelFullScreen();
			}

			setDisplayMode('off');
		}

		function isTimerRunning() {
			return !!readerPageIntervalTimer;
		}

		function startTimer() {
			stopTimer();
			readerPageIntervalTimer = window.setInterval(nextImg, slideDelay * 1000);
		}

		function stopTimer() {
			if (readerPageIntervalTimer) {
				window.clearInterval(readerPageIntervalTimer);
				readerPageIntervalTimer = null;
			}
		}

		function resetTimer() {
			if (readerPageIntervalTimer) {
				stopTimer();
				startTimer();
			}
		}

		function inputSlideDelay() {
			var newSlideDelay = prompt('Enter delay between slide change:', slideDelay);
			if (newSlideDelay > 0) {
				slideDelay = newSlideDelay;
				resetTimer();
			}
		}

		function enableDisable() {
			if (activeMode) {
				stop();
			} else {
				enable();
			}
		}

		function isActive() {
			return activeMode;
		}

		var operations = {
			isActive: isActive,
			enableDisable: enableDisable,
			pausePlay: pausePlay,
			inputSlideDelay: inputSlideDelay,
			hasNext: hasNext,
			hasPrevious: hasPrevious,
			goNext: nextImg,
			goPrevious: prevImg,
			goNextEntry: function() {},
			goPreviousEntry: function() {}
		};

		return operations;

	});

})(window.angular, window.jQuery);


//	function scrollNextImage() {
//		var $selected = $(document),
//			offset = $selected.find('img:last').offset();
//		if (offset.top > offset.left) {
//			var scrollTop = Math.floor($(window).scrollTop() + 25);
//
//			$('.article-content img').each(function () {
//				var $this = $(this),
//					offsetTop = Math.floor($this.offset().top);
//				if (offsetTop > scrollTop) {
//					$(window).scrollTop(offsetTop - 25);
//					return false;
//				}
//			});
//		} else {
//			var scrollLeft = Math.floor($selected.scrollLeft());
//
//			$('img').each(function () {
//				var $this = $(this),
//					offsetLeft = Math.floor($this.offset().left),
//					v = offsetLeft - ($selected.width() - $this.width()) / 2;
//				if (v > 1) {
//					$('[selected=true]').scrollLeft(Math.floor(v) + scrollLeft);
//					return false;
//				}
//			});
//		}
//
//		return true;
//	}
