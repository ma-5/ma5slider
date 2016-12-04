/* jshint esversion: 6 */

/*!
 *   MA5-Slider
 *   v 1.0.1
 *   Copyright (c) 2016 Tomasz Kalinowski
 *   http://ma5slider.ma5.pl
 *   GitHub: https://github.com/ma-5/ma5slider
 *
 */

function ma5sliderGetParameters(elm) {
    var parm = {
        slider: elm,
        width: $(elm + ' .slides').width(),
        height: $(elm + ' .slides').height(),
        slideCount: Number($(elm + ' .slides > *').length) - 1,
        loopMode: $(elm).hasClass('loop-mode'),
        currentSlide: Number($(elm + ' .slide--active').index()) + 1,
        initialAnim: $(elm).attr('data-initial-anim')
    };
    return (parm);
}
function ma5sliderGoToSlide(elm, slideInput) {
    $(document).ready(function () {
        var parm = ma5sliderGetParameters(elm);
        var slide = slideInput;
        if (slide !== parm.currentSlide) {
            $(elm).removeClass('drag-prev drag-next');
            if (parm.loopMode === false) {
                if (parm.currentSlide < slide) {
                    $(elm).removeClass('dir-prev').addClass('dir-next');
                } else {
                    $(elm).removeClass('dir-next').addClass('dir-prev');
                }
            }
            $(elm + ' .slide').removeClass('slide--prev');
            $(elm + ' .slide').removeClass('slide--next');
            $(elm + ' .slide:nth-child(' + slide + ')').addClass('slide--prev js-np');
            $(elm + ' > .dots .dot[data-target="' + slide + '"]').addClass('active').siblings().removeClass('active');
            ma5sliderFirstLastDetect(elm, slide);
            ma5sliderUpdateAnim(elm, slide);
            setTimeout(function () {
                $(elm + ' .slide--active.js-oa').addClass('transition-on').removeClass('slide--active js-oa').addClass('slide--next js-to-del');
                $(elm + ' .slide--prev.js-np').addClass('transition-on').removeClass('slide--prev js-op js-np').addClass('slide--active js-na');
                if (slide == 1) {
                    $(elm + ' .slide:nth-child(' + parm.slideCount + ')').addClass('slide--prev js-np');
                } else {
                    $(elm + ' .slide:nth-child(' + (slide - 1) + ')').addClass('slide--prev js-np');
                }
                if (slide == parm.slideCount) {
                    $(elm + ' .slide:nth-child(1)').addClass('slide--next js-nn');
                } else {
                    $(elm + ' .slide:nth-child(' + (slide + 1) + ')').addClass('slide--next js-nn');
                }
                ma5sliderUpdateDotsColors(elm);
                ma5sliderUpdateNavsColors(elm);
                ma5sliderUpdateDirection(elm);
                $(elm + ' .js-na').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
                    if (slide == parm.slideCount) {
                        $(elm + ' .js-to-del').removeClass('slide--next transition-on js-on');
                    } else {
                        $(elm + ' .js-to-del').removeClass('slide--next transition-on');
                    }
                    $(elm + ' .js-na').removeClass('transition-on');
                    if (parm.currentSlide == 1 && slide == parm.slideCount) {
                        $(elm + ' .slide:nth-child(1)').addClass('slide--next');
                    }
                    if (slide == (parm.currentSlide - 1)) {
                        $(elm + ' .slide:nth-child(' + (slide + 1) + ')').addClass('slide--next');
                    }
                    $(elm + ' .slide').removeClass('js-op js-oa js-on js-np js-na js-nn js-to-del');
                    $(elm + ' > .dots').removeClass('dots-disabled');
                    $(elm + ' .slides > .slide--prev').addClass('js-op');
                    $(elm + ' .slides > .slide--active').addClass('js-oa');
                    $(elm + ' .slides > .slide--next').addClass('js-on');
                    $(elm).removeClass('disabled');
                    $(elm).removeClass('transition-on');
                    slide = 0;
                    parm.currentSlide = 0;
                    parm.slideCount = 0;
                    if (jQuery().draggable) {
                        $(elm + ' .slides').ma5draggable();
                    }
                    return false;
                });
            }, 50);
        }
        return false;
    });
}
function ma5autoplay(tempo, elm) {
    var parm = ma5sliderGetParameters(elm);
    var counter = parm.currentSlide;
    var autoplay = setInterval(function () {
        counter++;
        if (counter > parm.slideCount) {
            counter = 1;
        }
        ma5sliderGoToSlide(elm, counter);
    }, tempo);
    $(elm).on('touch click', function () {
        clearInterval(autoplay);
        return true;
    });
    $(elm + ' .slides').mousemove(function() {
        if ($(this).is('.ui-draggable-dragging')) {
            clearInterval(autoplay);
            return true;
        }
    });
}
function ma5makeNav(elm) {
    if (!$(elm).hasClass('vertical-navs')) {
        $(elm).addClass('horizontal-navs');
    }
    if (!$(elm).hasClass('outside-navs')) {
        $(elm).addClass('inside-navs');
    }
    $(elm + ' .navs-wrapper').append('<span class="nav--prev"></span><span class="nav--next"></span>');
}
function ma5makeDots(elm) {
    var parm = ma5sliderGetParameters(elm);
    if (!$(elm).hasClass('inside-dots')) {
        $(elm).addClass('outside-dots');
    }
    if (!$(elm).hasClass('vertical-dots')) {
        $(elm).addClass('horizontal-dots');
        if (!$(elm).hasClass('left-dots') && !$(elm).hasClass('right-dots')) {
            $(elm).addClass('center-dots');
        }
        if (!$(elm).hasClass('top-dots')) {
            $(elm).addClass('bottom-dots');
        }
    }
    if ($(elm).hasClass('vertical-dots')) {
        if (!$(elm).hasClass('left-dots') && !$(elm).hasClass('right-dots')) {
            $(elm).addClass('right-dots');
        }
        if ($(elm).hasClass('outside-navs horizontal-navs')) {
            $(elm).removeClass('outside-dots');
            $(elm).addClass('inside-dots right-dots');
        }
    }
    if ($(elm).hasClass('vertical-dots')) {
        if (!$(elm).hasClass('top-dots') || !$(elm).hasClass('bottom-dots')) {
            $(elm).addClass('middle-dots');
        }
    }
    if ($(elm).hasClass('top-dots')) {
        $(elm).prepend('<span class="dots"></span>');
    } else {
        $(elm).append('<span class="dots"></span>');
    }
    for (var i = 1; i <= parm.slideCount; i++) {
        $(elm + ' > .dots').append('<span class="dot" data-target="' + i + '"></span>');
    }
    $(elm + ' > .dots > .dot:first-of-type').addClass('active');
}
function ma5sliderUpdateDotsColors(elm) {
    if ($(elm + ' .slide--active').attr('data-ma5-dot') !== undefined) {
        var dotColor = $(elm + ' .slide--active').attr('data-ma5-dot');
        $(elm + ' .dot:not(".active")').css('background-color', dotColor);
    } else {
        $(elm + ' .dot:not(".active")').css('background-color', '');
    }
    if ($(elm + ' .slide--active').attr('data-ma5-dot-active') !== undefined) {
        var dotActiveColor = 'background-color:' + $(elm + ' .slide--active').attr('data-ma5-dot-active');
        $(elm + ' .dot.active').attr('style', dotActiveColor);
    } else {
        $(elm + ' .dot.active').css('background-color', '');
    }
}
function ma5sliderUpdateNavsColors(elm) {
    if ($(elm + ' .slide--active').attr('data-ma5-nav') !== undefined) {
        var navColor = $(elm + ' .slide--active').attr('data-ma5-nav');
        $(elm + ' .nav--prev, ' + elm + ' .nav--next').css('color', navColor);
    } else {
        $(elm + ' .nav--prev, ' + elm + ' .nav--next').css('color', '');
    }
}
function ma5sliderUpdateAnim(elm, slide) {
    if ($(elm + ' .slide:nth-child(' + slide + ')').attr('data-ma5-anim') !== undefined) {
        var anim = $(elm + ' .slide:nth-child(' + slide + ')').attr('data-ma5-anim');
        $(elm).removeClass('anim-horizontal anim-vertical anim-fade').addClass(anim);
    } else {
        $(elm).removeClass('anim-horizontal anim-vertical anim-fade').addClass($(elm).attr('data-initial-anim'));
    }
}
function ma5sliderUpdateDirection(elm) {
    if ($(elm + ' .slide--active').attr('data-ma5-nav-prev-dir') !== undefined) {
        var navPrevDir = $(elm + ' .slide--active').attr('data-ma5-nav-prev-dir');
        $(elm + ' .nav--prev').addClass(navPrevDir);
    } else {
        $(elm + ' .nav--prev').removeClass('nav__top nav__bottom');
    }
    if ($(elm + ' .slide--active').attr('data-ma5-nav-next-dir') !== undefined) {
        var navNextDir = $(elm + ' .slide--active').attr('data-ma5-nav-next-dir');
        $(elm + ' .nav--next').addClass(navNextDir);
    } else {
        $(elm + ' .nav--next').removeClass('nav__top nav__bottom');
    }
}
function ma5sliderGoToNext(elm) {
    $(document).ready(function () {
        var parm = ma5sliderGetParameters(elm);
        if (!$(elm).hasClass('disabled')) {
            counter = parm.currentSlide;
            counter++;
            if (counter > parm.slideCount) {
                if (parm.loopMode === true) {
                    counter = 1;
                    $(elm).removeClass('dir-prev').addClass('dir-next disabled');
                    ma5sliderGoToSlide(elm, counter);
                } else {
                    return false;
                }
            } else {
                $(elm).removeClass('dir-prev').addClass('dir-next disabled');
                ma5sliderGoToSlide(elm, counter);
            }
        }
    });
}
function ma5sliderGoToPrev(elm) {
    $(document).ready(function () {
        var parm = ma5sliderGetParameters(elm);
        if (!$(elm).hasClass('disabled')) {
            counter = parm.currentSlide;
            counter--;
            if (counter < 1) {
                counter = parm.slideCount;
            }
            $(elm).removeClass('dir-next').addClass('dir-prev disabled');
            ma5sliderGoToSlide(elm, counter);
        }
    });
}
function ma5sliderGoToFirst(elm) {
    $(document).ready(function () {
        var parm = ma5sliderGetParameters(elm);
        if (!$(elm).hasClass('disabled')) {
            $(elm).removeClass('dir-next').addClass('dir-prev disabled');
            ma5sliderGoToSlide(elm, 1);
        }
    });
}
function ma5sliderGoToLast(elm) {
    $(document).ready(function () {
        var parm = ma5sliderGetParameters(elm);
        if (!$(elm).hasClass('disabled')) {
            $(elm).removeClass('dir-prev').addClass('dir-next disabled');
            ma5sliderGoToSlide(elm, parm.slideCount);
        }
    });
}
function updateAfterPrevDrag(elm) {
    var parm = ma5sliderGetParameters(elm);
    var currentSlide = parm.currentSlide - 1;
    $(elm).removeClass('dir-next').addClass('dir-prev ' + parm.initialAnim);
    if (currentSlide > 0) {
        $(elm + ' > .dots .dot[data-target="' + (currentSlide) + '"]').addClass('active').siblings().removeClass('active');
    } else {
        $(elm + ' > .dots .dot[data-target="' + (parm.slideCount) + '"]').addClass('active').siblings().removeClass('active');
    }
    $(elm + ' .slide').removeClass('js-op js-oa js-on');
    $(elm + ' .slides > .slide--next').removeClass('slide--next');
    $(elm + ' .slides > .slide--active').removeClass('slide--active').addClass('slide--next js-on');
    $(elm + ' .slides > .slide--prev').removeClass('slide--prev').addClass('slide--active js-oa');
    if (currentSlide != 1) {
        $(elm + ' .slides > .slide--active').prev().addClass('slide--prev js-op');
    } else {
        $(elm + ' .slides > .slide').last().addClass('slide--prev js-op');
    }
    $(elm + ' .slides').removeClass('dragged-prev-end dragged-next-end');
    $(elm + ' .slides').ma5draggable();
    ma5sliderFirstLastDetect(elm, currentSlide);
    ma5sliderUpdateDotsColors(elm);
    ma5sliderUpdateNavsColors(elm);
    ma5sliderUpdateDirection(elm);
}
function updateAfterNextDrag(elm) {
    var parm = ma5sliderGetParameters(elm);
    var slideCount = parm.slideCount - 1;
    $(elm).removeClass('dir-prev').addClass('dir-next ' + parm.initialAnim);
    if (parm.currentSlide <= slideCount) {
        $(elm + ' > .dots .dot[data-target="' + (parm.currentSlide + 1) + '"]').addClass('active').siblings().removeClass('active');
    } else {
        $(elm + ' > .dots .dot[data-target="1"]').addClass('active').siblings().removeClass('active');
    }
    $(elm + ' .slide').removeClass('js-op js-oa js-on');
    $(elm + ' .slides > .slide--prev').removeClass('slide--prev');
    $(elm + ' .slides > .slide--active').removeClass('slide--active').addClass('slide--prev js-op');
    $(elm + ' .slides > .slide--next').removeClass('slide--next').addClass('slide--active js-oa');
    if (parm.currentSlide != slideCount) {
        $(elm + ' .slides > .slide--active').next().addClass('slide--next js-on');
    } else {
        $(elm + ' .slides > .slide').first().addClass('slide--next js-on');
    }
    $(elm + ' .slides').removeClass('dragged-prev-end dragged-next-end');
    $(elm + ' .slides').ma5draggable();
    ma5sliderFirstLastDetect(elm, parm.currentSlide + 1);
    ma5sliderUpdateDotsColors(elm);
    ma5sliderUpdateNavsColors(elm);
    ma5sliderUpdateDirection(elm);
}
function externalControl(control) {
    var elm = $(control).attr('data-ma5slider');
    var parm = ma5sliderGetParameters(elm);
    if (!$(elm + ' > .dots').hasClass('dots-disabled')) {
        var target = $(control).attr('data-ma5slide');
        if (target > parm.currentSlide) {
            $(elm).removeClass('dir-prev').addClass('dir-next');
        }
        else if (target < parm.currentSlide) {
            $(elm).removeClass('dir-next').addClass('dir-prev');
        }
        else if (target == 'next') {
            $(elm).removeClass('dir-prev').addClass('dir-next');
            target = parm.currentSlide + 1;
            if (target > parm.slideCount) {
                target = 1;
            }
        }
        else if (target == 'previous') {
            $(elm).removeClass('dir-next').addClass('dir-prev');
            target = parm.currentSlide - 1;
            if (target < 1) {
                target = parm.slideCount;
            }
        }
        else if (target == 'first') {
            $(elm).removeClass('dir-next').addClass('dir-prev');
            target = 1;
        }
        else if (target == 'last') {
            $(elm).removeClass('dir-prev').addClass('dir-next');
            target = parm.slideCount;
        }
        if (target != parm.currentSlide) {
            $(elm + ' > .dots').addClass('dots-disabled');
            ma5sliderGoToSlide(elm, Number(target));
        }
    }
}
function ma5sliderFirstLastDetect(elm, slide) {
    var parm = ma5sliderGetParameters(elm);
    $('.ma5slider__control[data-ma5slider="' + elm + '"]').removeClass('targeted');
    $('.ma5slider__control[data-ma5slider="' + elm + '"][data-ma5slide=' + slide + ']').addClass('targeted');
    if (parm.loopMode !== true) {
        $(elm).removeClass('last-slide first-slide');
        if (slide == parm.slideCount) {
            $(elm).addClass('last-slide');
            $('.ma5slider__control[data-ma5slider="' + elm + '"][data-ma5slide="next"]').addClass('targeted');
            $('.ma5slider__control[data-ma5slider="' + elm + '"][data-ma5slide="last"]').addClass('targeted');
        }
        if (slide == 1) {
            $(elm).addClass('first-slide');
            $('.ma5slider__control[data-ma5slider="' + elm + '"][data-ma5slide="previous"]').addClass('targeted');
            $('.ma5slider__control[data-ma5slider="' + elm + '"][data-ma5slide="first"]').addClass('targeted');
        }
    }
}
function ma5sliderGoToSlideDotTarget(elm, target) {
    var parm = ma5sliderGetParameters(elm);
    if (!$(elm + ' > .dots').hasClass('dots-disabled')) {
        if (target > parm.currentSlide) {
            $(elm).removeClass('dir-prev').addClass('dir-next');
        }
        if (target < parm.currentSlide) {
            $(elm).removeClass('dir-next').addClass('dir-prev');
        }
        if (target != parm.currentSlide) {
            $(elm + ' > .dots').addClass('dots-disabled');
            ma5sliderGoToSlide(elm, target);
        }
    }
}
function ma5slider(attributes) {
    var elm = '.ma5slider';
    if (attributes.slider !== undefined) {
        elm = attributes.slider;
    }
    var ma5sliderInit = $(elm).data('ma5slider');
    if(ma5sliderInit === undefined) {
        $(elm).data('ma5slider', {
            slider: elm
        });

        if ($(elm).length) {
            var parm = ma5sliderGetParameters(elm);
            var autoplayTime = Number($(elm).attr('data-tempo'));
            if (parm.loopMode !== true) {
                $(elm).addClass('first-slide');
            }
            if (autoplayTime === undefined) {
                autoplayTime = 3000;
            }
            var str = $(elm).attr('class');
            if (str !== undefined) {
                if (!~str.indexOf("anim-")) {
                    $(elm).addClass('anim-horizontal');
                }
            }
            var initialAnim = 'anim-horizontal';
            if ($(elm).hasClass('anim-vertical')) {
                initialAnim = 'anim-vertical';
            } else if ($(elm).hasClass('anim-fade')) {
                initialAnim = 'anim-fade';
            }
            const INITIAL_ANIM = initialAnim;
            $(elm).attr('data-initial-anim', INITIAL_ANIM).addClass('dir-next');
            $(elm + ' > .slides').attr('data-ma5elm', elm);
            $(elm + ' > .slides').children().addClass('slide');
            $(elm + ' > .slides').append('<canvas class="canvas" width="' + parm.width + '" height="' + parm.height + '"></canvas>');
            if (parm.slideCount < 1) {
                $(elm + ' .slides > .slide').addClass('slide--active');
                $(elm).removeClass('inside-dots, outside-dots, left-dots, center-dots, right-dots, top-dots, bottom-dots').addClass('one-slide');
                return false;
            } else {
                $(elm + ' .slides > .slide:nth-child(' + (parm.slideCount + 1) + ')').addClass('slide--prev js-op');
                $(elm + ' .slides > .slide:nth-child(1)').addClass('slide--active js-oa');
                $(elm + ' .slides > .slide:nth-child(2)').addClass('slide--next js-on');
            }
            if((parm.slideCount == 1 ) ) {
                $(elm ).addClass('safe-slides');
            }
            $(elm + ' .slides').wrap('<div class="navs-wrapper"><div class="slide-area"></div></div>');
            if (!~str.indexOf("-navs")) {
                $(elm).addClass('hidden-navs');
            }
            if (!~str.indexOf("-dots")) {
                $(elm).addClass('hidden-dots');
            }
            ma5makeNav(elm);
            ma5makeDots(elm);
            ma5sliderUpdateDotsColors(elm);
            ma5sliderUpdateNavsColors(elm);
            ma5sliderUpdateDirection(elm);
            ma5sliderUpdateAnim(elm, 1);
            ma5sliderFirstLastDetect(elm, 1);
            $(elm + ' .slides').attr('data-ma5elm-width', $(elm + ' .slides').width());
            $(elm + ' .slides').attr('data-ma5elm-height', $(elm + ' .slides').height());
            if (jQuery().draggable) {
                $(elm + ' .slides').ma5draggable();
            }
            $(elm + ' .nav--next').on('touch click', function () {
                ma5sliderGoToNext(elm);
            });
            $(elm + ' .nav--prev').on('touch click', function () {
                ma5sliderGoToPrev(elm);
            });
            $(elm + ' .dot').on('touch click', function () {
                var target = Number($(this).attr('data-target'));
                ma5sliderGoToSlideDotTarget(elm, target);
            });
            $('.ma5slider__control').on('touch click', function () {
                externalControl(this);
            });
            if ($(elm).hasClass('autoplay')) {
                ma5autoplay(autoplayTime, elm);
            }
        }
    } else {
        $(document).ready(function () {
            $(elm + ' .slides').attr('data-ma5elm-width', $(elm + ' .slides').width());
            $(elm + ' .slides').attr('data-ma5elm-height', $(elm + ' .slides').height());
            $(elm + ' .slides').ma5draggable();
        });
    }
}
$(document).ready(function () {
    $(document).on("dragstart", ".ma5slider a", function () {
        return false;
    });
});
$(window).resize(function(){
    ma5slider({
        slider: '.ma5slider'
    });
});
//  MA5 Slider Mouse Draggable Extension for jQuery UI
if (jQuery().draggable) {
    (function ($) {
        $.fn.ma5draggable = function () {
            $.globalVars = {
                originalTop: 0,
                originalLeft: 0
            };
            this.each(function () {
                var slider = $(this).attr('data-ma5elm');
                var parm = ma5sliderGetParameters(slider);
                var elmWidth = Number($(this).attr('data-ma5elm-width'));
                var elmHeight = Number($(this).attr('data-ma5elm-height'));
                var Vars = {
                    maxWidth: elmWidth,
                    maxHeight: elmHeight,
                    itemWidthBreakpoint: elmWidth / 5,
                    itemWidthBreakpointSub: (elmWidth / 5) * -1,
                    itemHeightBreakpoint: elmHeight / 5,
                    itemHeightBreakpointSub: (elmHeight / 5) * -1,
                    maxHeightTop: elmHeight / 5,
                    maxHeightBottom: (elmHeight * -1) / 5,
                    maxWidthLeft: elmWidth / 5,
                    maxWidthRight: (elmWidth * -1) / 5
                };
                if(parm.initialAnim == 'anim-horizontal' || 'anim-fade') {
                    $(this).draggable({
                        axis: "x",
                        revert: true,
                        start: function (event, ui) {
                            if (ui.position !== undefined) {
                                $.globalVars.originalLeft = ui.position.left;
                            }
                        },
                        drag: function (event, ui) {
                            $(slider).removeClass('dir-next dir-prev anim-fade anim-vertical').addClass('anim-horizontal');
                            var newLeft = ui.position.left;
                            if (ui.position.left < Vars.maxWidthRight) {
                                newLeft = Vars.maxWidthRight;
                            }
                            if (ui.position.left > Vars.maxWidthLeft) {
                                newLeft = Vars.maxWidthLeft;
                            }
                            ui.position.left = newLeft;
                            if (ui.position.left > 0) {
                                if (parm.loopMode === false && $(parm.slider + ' .slide--active').index() === 0) {
                                } else {
                                    $(slider).removeClass('drag-next').addClass('drag-prev dir-prev');
                                    if (ui.position.left >= Vars.itemWidthBreakpoint) {
                                        $(this).draggable("option", "revert", false);
                                        $(this).animate({
                                            left: Vars.maxWidth
                                        }, 300, function () {
                                            $(this).addClass('dragged-prev-end').removeAttr('style');
                                            updateAfterPrevDrag(slider);
                                        });
                                        return false;
                                    }
                                }
                            } else {
                                if (parm.loopMode === false && parm.currentSlide == parm.slideCount) {
                                } else {
                                    $(slider).removeClass('drag-prev').addClass('drag-next dir-prev');
                                    if (ui.position.left <= Vars.itemWidthBreakpointSub) {
                                        $(this).draggable("option", "revert", false);
                                        $(this).animate({
                                            left: Vars.maxWidth * -1
                                        }, 300, function () {
                                            $(this).addClass('dragged-next-end').removeAttr('style');
                                            updateAfterNextDrag(slider);
                                        });
                                        return false;
                                    }
                                }
                            }
                        }
                    });
                }
                if(parm.initialAnim == 'anim-vertical') {
                    $(this).draggable({
                        axis: "y",
                        revert: true,
                        start: function (event, ui) {
                            if (ui.position !== undefined) {
                                $.globalVars.originalTop = ui.position.top;
                            }
                        },
                        drag: function (event, ui) {
                            $(slider).removeClass('dir-next dir-prev anim-fade anim-horizontal').addClass('anim-vertical');
                            var newTop = ui.position.top;
                            if (ui.position.top > Vars.maxHeightTop) {
                                newTop = Vars.maxHeightTop;
                            }
                            if (ui.position.top < Vars.maxHeightBottom) {
                                newTop = Vars.maxHeightBottom;
                            }
                            ui.position.top = newTop;
                            if (ui.position.top > 0) {
                                if (parm.loopMode === false && $(parm.slider + ' .slide--active').index() === 0) {
                                } else {
                                    $(slider).removeClass('drag-next').addClass('drag-prev dir-prev');
                                    if (ui.position.top >= Vars.itemHeightBreakpoint) {
                                        $(this).draggable("option", "revert", false);
                                        $(this).animate({
                                            top: Vars.maxHeight
                                        }, 300, function () {
                                            $(this).addClass('dragged-prev-end').removeAttr('style');
                                            updateAfterPrevDrag(slider);
                                        });
                                        return false;
                                    }
                                }
                            } else {
                                if (parm.loopMode === false && parm.currentSlide == parm.slideCount) {
                                } else {
                                    $(slider).removeClass('drag-prev').addClass('drag-next dir-prev');
                                    if (ui.position.top <= Vars.itemHeightBreakpointSub) {
                                        $(this).draggable("option", "revert", false);
                                        $(this).animate({
                                            top: Vars.maxHeight * -1
                                        }, 300, function () {
                                            $(this).addClass('dragged-next-end').removeAttr('style');
                                            updateAfterNextDrag(slider);
                                        });
                                        return false;
                                    }
                                }
                            }
                        }
                    });
                }
            });
            return this;
        };
    }(jQuery));
}


