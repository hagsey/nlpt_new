/**
 * Main JS file for Scriptor behaviours
 */

/*globals jQuery, document */
(function($) {
    "use strict";

    var $body = $('body');

    $(document).ready(function() {

        // Responsive video embeds
        $('.post-content').fitVids();

        // Scroll to content
        $('.scroll-down').on('click', function(e) {
            var $cover = $(this).closest('.cover');
            $('html, body').animate({
                scrollTop: $cover.position().top + $cover.height()
            }, 800);
            e.preventDefault();
        });

        // Scroll to top
        $('.top-link').on('click', function(e) {
            $('html, body').animate({
                'scrollTop': 0
            });
            e.preventDefault();
        });


        // Barbell total 

        (function() {
            var $bb_total = $(".bb-total");
            var bb_weight = 45;
            function updateTotal(val) {
                var total = (val * 2) + bb_weight;
                $bb_total.val(total);
            }

            function calculatePlates() {
                var total = 0;

                $(".plate.plate-active").each(function() {
                		var $this = $(this);
                		var val = $this.data("val") == "2-5" ? 2.5 : $this.data("val");
                    total += val;
                });

                updateTotal(total);
            }

            function isValidInput() {
                var error_alpha = "Please enter numbers only";
                var error_multiple = "Please enter a multiple of 5";
                var input = $bb_total.val();
                var reg = /^\d+$/;

                // Check for non-numberic chars
                if (input.match(reg) || input === '') {
                    $(".error").text('');

                    if (input % 5 !== 0) {
                        $(".error").text(error_multiple);
                        return false;
                    } else {
                        $(".error").text('');
                        return true;
                    }

                } else {
                    $(".error").text(error_alpha);
                    return false;
                }
            }

            function calculateOneSideOfBar() {
                return ($bb_total.val() - bb_weight) / 2;
            }

            function formatBarbell(plates_array) {
							clearBarbell();

            	plates_array.forEach(function(i) {
            		if (i === 2.5) {
            			i = "2-5";
            		}
            		$("[data-val=" + i + "]").not(".plate-active").first().addClass("plate-active");
            	});
            }

            function clearBarbell() {
            	$(".plate").removeClass("plate-active");
            }

            // Update barbell weight

            $(".bb-option").on("click", function() {

            	$(".bb-option").removeClass("button-active");
            	$(this).addClass("button-active");

            	bb_weight = +$(this).text();
              calculatePlates();
            });

            // When plates selected
            $(".plate").on("click", function() {
                $bb_total.val('');

                $(this).toggleClass("plate-active");
                calculatePlates();
            });

            // When total inputted manually
            $bb_total.focus(function() {

                $(window).on("keyup", function(e) {

                		if (e.which === 8) {
                			clearBarbell();
                		}

                    if (isValidInput()) {
                        var weight = calculateOneSideOfBar();
                        var plates = [];

                        while (weight > 0) {
                            if (weight - 45 >= 0) {
                                plates.unshift(45);
                                weight -= 45;
                            } else if (weight - 25 >= 0) {
                                plates.unshift(25);
                                weight -= 25;
                            } else if (weight - 10 >= 0) {
                                plates.unshift(10);
                                weight -= 10;
                            } else if (weight - 5 >= 0) {
                                plates.unshift(5);
                                weight -= 5;
                            } else if (weight - 2.5 >= 0) {
                                plates.unshift(2.5);
                                weight -= 2.5;
                            }
                        }
                        formatBarbell(plates);
                    }

                });

            });

        }());


        // 70 Day Challenge table

        $("tbody.scoreboard").on("click", "tr.team", function() {
            var $target = $(this).next();

            $target.slideToggle();
        });

        // Header adjustments
        adjustCover();
        var lazyResize = debounce(adjustCover, 200, false);
        $(window).resize(lazyResize);

        // Initialize featured posts slider
        var $featSlider = $('#featured-slider'),
            $featCounter = $featSlider.next('.featured-counter');

        $featSlider.on('init reInit', function(event, slick, currentSlide, nextSlide) {
            var current = (currentSlide ? currentSlide : 0) + 1;
            $featCounter.find('.total').text(slick.slideCount);
            $featCounter.find('.current').text(current);
        });

        $featSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            $featCounter.find('.current').text(nextSlide + 1);
        });

        $featSlider.slick({
            autoplay: true,
            arrows: true,
            dots: false,
            fade: true,
            prevArrow: '<button type="button" class="slick-prev square"><span class="icon-left-custom" aria-hidden="true"></span><span class="screen-reader-text">Previous</span></button>',
            nextArrow: '<button type="button" class="slick-next square"><span class="icon-right-custom" aria-hidden="true"></span><span class="screen-reader-text">Next</span></button>',
        });

        $featSlider.fadeIn(600, function() {
            $(this).parent().removeClass('slider-loading');
        });

        // Site search
        var searchField = $('#search-field').ghostHunter({
            results: "#search-results",
            onKeyUp: true,
            onPageLoad: true,
            includepages: true,
            info_template: '<div class="results-info">Found: {{amount}}</div>',
            result_template: '<div class="result-item"><a href="{{link}}"><div class="result-title">{{title}}</div><div class="result-date">{{pubDate}}</div></a></div>'
        });

        // Hidden sections
        $('.sidebar-toggle').on('click', function(e) {
            $body.toggleClass('sidebar-opened');
            e.preventDefault();
        });
        $('.search-toggle').on('click', function(e) {
            if ($body.hasClass('search-opened')) {
                $body.removeClass('search-opened');
                searchField.clear();
            } else {
                $body.addClass('search-opened');
                setTimeout(function() {
                    $('#search-field').focus();
                }, 300);
            }
            e.preventDefault();
        });
        $('.overlay').on('click', function(e) {
            $body.removeClass('sidebar-opened search-opened');
            searchField.clear();
            e.preventDefault();
        });

        // Contact bar
        $(".contact-button").on("click", function() {
            $(".contact-modal").show();
            $(".modal-layer").show();
            $("body").css("overflow", "hidden");

            $(".modal-layer").on("click", function() {
                $(".contact-modal").hide();
                $(".modal-layer").hide();
                $("body").css("overflow", "visible");
            });
        });

        // Post reading time
        $('.post-template').find('.post').readingTime();

        // Show comments
        if (typeof disqus_shortname !== 'undefined') {
            var disqus_loaded = false;
            $('.comments-title').on('click', function() {
                var _this = $(this);
                if (!disqus_loaded) {
                    $.ajax({
                        type: "GET",
                        url: "//" + disqus_shortname + ".disqus.com/embed.js",
                        dataType: "script",
                        cache: true
                    });
                    _this.addClass('toggled-on');
                    disqus_loaded = true;
                } else {
                    $('#disqus_thread').slideToggle();
                    if (_this.hasClass('toggled-on')) {
                        _this.removeClass('toggled-on');
                    } else {
                        _this.addClass('toggled-on');
                    }
                }
            });
        }

        // Display Instagram feed
        if (typeof instagram_user_id !== 'undefined' && typeof instagram_access_token !== 'undefined') {
            if ($('#instafeed').length) {
                var userFeed = new Instafeed({
                    get: 'user',
                    userId: instagram_user_id,
                    accessToken: instagram_access_token,
                    limit: 6,
                    resolution: 'low_resolution',
                    template: '<div class="instagram-item"><a target="_blank" href="{{link}}"><img src="{{image}}" alt="{{caption}}" /></a></div>'
                });
                userFeed.run();
            }
        }
    });

    function adjustCover() {
        setElementHeight('.post-header.cover');
    }

    // Set the new height of an element
    function setElementHeight(element) {
        var windowHeight = (true === isiPod() && true === isSafari()) ? window.screen.availHeight : $(window).height();
        var offsetHeight = $('.site-header').outerHeight();
        var newHeight = windowHeight;
        if ($(element).find('.scroll-down').is(':hidden')) {
            $(element).removeAttr('style');
            $(element).find('.cover-bg').css('top', '');
        } else {
            // $(element).outerHeight(newHeight);
            // $(element).find('.cover-bg').css('top',offsetHeight);
        }
    }

    // Throttles an action.
    // Taken from Underscore.js.
    function debounce(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function() {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function() {
                var last = (new Date()) - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
            }
            return result;
        };
    }

    // Check if device is an iPhone or iPod
    function isiPod() {
        return (/(iPhone|iPod)/g).test(navigator.userAgent);
    }

    // Check if browser is Safari
    function isSafari() {
        return (-1 !== navigator.userAgent.indexOf('Safari') && -1 === navigator.userAgent.indexOf('Chrome'));
    }



}(jQuery));