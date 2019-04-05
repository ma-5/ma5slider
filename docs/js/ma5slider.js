/* jshint esversion: 6 */

/*!
 *   MA5-Slider
 *   v 1.1.6
 *   MIT License
 *   Copyright (c) 2016 Tomasz Kalinowski
 *   http://ma5slider.ma5.pl
 *   GitHub: https://github.com/ma-5/ma5slider
 *
 */
$.widget("ma5.ma5slider", {
    options: {
        autoplayTime: 3000,
        anim: 'anim-horizontal'
    },
    _create: function () {
        var widgetThis = this;
        var elm = this.element;
        var slides = elm.find('.slides');
        var slideCount = this._slideCount();
        var loopMode = this._loopMode();
        var parm = {
            slides: slides,
            slideCount: slideCount,
            width: slides.width(),
            height: slides.height(),
            loopMode: loopMode,
            currentSlide: 1
        };
        if (elm.length) {
            if (parm.loopMode !== true) {
                elm.addClass('first-slide');
            }
            var autoplayTime = elm.attr('data-tempo');
            if (autoplayTime === undefined) {
                autoplayTime = this.options.autoplayTime;
            } else {
                autoplayTime = Number(elm.attr('data-tempo'));
            }
            var str = elm.attr('class');
            if (str !== undefined) {
                if (!~str.indexOf("anim-")) {
                    elm.addClass(this.options.anim);
                }
            }
            var initialAnim = this.options.anim;
            if (elm.hasClass('anim-vertical')) {
                initialAnim = 'anim-vertical';
            } else if (elm.hasClass('anim-fade')) {
                initialAnim = 'anim-fade';
            } else if (elm.hasClass('anim-horizontal')) {
                initialAnim = 'anim-horizontal';
            }
            const INITIAL_ANIM = initialAnim;
            initialAnim = INITIAL_ANIM;
            elm.attr('data-initial-anim', INITIAL_ANIM).addClass('dir-next');
            this._createContainer(parm.slides, parm.width, parm.height);
            if (parm.slideCount < 1) {
                parm.slides.find('.slide').addClass('slide--active');
                elm.removeClass('inside-dots, outside-dots, left-dots, center-dots, right-dots, top-dots, bottom-dots').addClass('one-slide');
                return false;
            } else {
                parm.slides.find('> .slide:nth-child(' + (parm.slideCount + 1) + ')').addClass('slide--prev');
                parm.slides.find('> .slide:nth-child(1)').addClass('slide--active');
                parm.slides.find('> .slide:nth-child(2)').addClass('slide--next');
            }
            if (parm.slideCount == 1) {
                elm.addClass('safe-slides');
            }
            if (!~str.indexOf("-navs")) {
                elm.addClass('hidden-navs');
            }
            if (!~str.indexOf("-dots")) {
                elm.addClass('hidden-dots');
            }
            this._makeNav();
            this._makeDots(parm.slideCount);
            this._updateDotsColors();
            this._updateNavsColors();
            this._updateDirection();
            this._updateAnim(1);
            this._firstLastDetect(1);
            if (jQuery().draggable) {
                this._ma5draggable();
            }
            setTimeout(function () {
                elm.trigger('ma5.firstSlide');
            }, 1);
            elm.find('.nav--next').on('touch click', function () {
                widgetThis.goToNext();
            });
            elm.find('.nav--prev').on('touch click', function () {
                widgetThis.goToPrev();
            });
            elm.find('.dot').on('touch click', function () {
                var target = Number($(this).attr('data-target'));
                widgetThis._goToSlideDotTarget(target);
            });
            if (elm.hasClass('autoplay')) {
                this._autoplay(autoplayTime);
            }
        }
    },
    // public method.
    goToSlide: function (slideInput) {
        var elm = this.element;
        var parm = this._parm();
        if(slideInput == 'current') {
            slideInput = parm.currentSlide;
        }
        setTimeout(function () {
            elm.trigger('ma5.activeSlide', [slideInput]);
        },1);
        var widgetThis = this;

        if (slideInput < 1) {
            slideInput = 1;
        }
        if (slideInput > parm.slideCount) {
            slideInput = parm.slideCount;
        }
        var slide = slideInput;
        if (slide !== parm.currentSlide) {
            elm.find('.slides > .slide--prev').addClass('js-op');
            elm.find('.slides > .slide--active').addClass('js-oa');
            elm.find('.slides > .slide--next').addClass('js-on');
            elm.removeClass('drag-prev drag-next');
            if (parm.loopMode === false) {
                if (parm.currentSlide < slide) {
                    elm.removeClass('dir-prev').addClass('dir-next');
                } else {
                    elm.removeClass('dir-next').addClass('dir-prev');
                }
            }
            elm.find('.slide').removeClass('slide--prev slide--next');
            elm.find('.slide:nth-child(' + slide + ')').addClass('slide--prev js-np');
            elm.find('> .dots .dot[data-target="' + slide + '"]').addClass('active').siblings().removeClass('active');
            this._firstLastDetect(slide);
            this._updateAnim(slide);
            setTimeout(function () {
                elm.find('.slide--active.js-oa').addClass('transition-on').removeClass('slide--active js-oa').addClass('slide--next js-to-del');
                elm.find('.slide--prev.js-np').addClass('transition-on').removeClass('slide--prev js-op js-np').addClass('slide--active js-na');
                if (slide == 1) {
                    elm.find('.slide:nth-child(' + parm.slideCount + ')').addClass('slide--prev js-np');
                } else {
                    elm.find('.slide:nth-child(' + (slide - 1) + ')').addClass('slide--prev js-np');
                }
                if (slide == parm.slideCount) {
                    elm.find('.slide:nth-child(1)').addClass('slide--next js-nn');
                } else {
                    elm.find('.slide:nth-child(' + (slide + 1) + ')').addClass('slide--next js-nn');
                }
                widgetThis._updateDotsColors();
                widgetThis._updateNavsColors();
                widgetThis._updateDirection();
                elm.trigger('ma5.animationStart');

                var one = true;
                elm.find('.js-na').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
                    if (one === true) {
                        one = false;
                        if (slide == parm.slideCount) {
                            elm.find('.js-to-del').removeClass('slide--next transition-on js-on');
                        } else {
                            elm.find('.js-to-del').removeClass('slide--next transition-on');
                        }
                        elm.find('.js-na').removeClass('transition-on');
                        if (parm.currentSlide == 1 && slide == parm.slideCount) {
                            elm.find('.slide:nth-child(1)').addClass('slide--next');
                        }
                        if (slide == (parm.currentSlide - 1)) {
                            elm.find('.slide:nth-child(' + (slide + 1) + ')').addClass('slide--next');
                        }
                        parm.slideAll.removeClass('js-op js-oa js-on js-np js-na js-nn js-to-del');
                        elm.find('> .dots').removeClass('dots-disabled');
                        elm.removeClass('disabled');
                        elm.removeClass('transition-on');
                        slide = 0;
                        parm.currentSlide = 0;
                        parm.slideCount = 0;
                        if (jQuery().draggable) {
                            widgetThis._ma5draggable();
                        }
                        elm.trigger('ma5.animationEnd');
                        return false;
                    }
                });
            }, 60);
        } else {
            if (jQuery().draggable) {
                widgetThis._ma5draggable();
            }
        }
    },
    goToPrev: function () {
        var elm = this.element;
        var parm = this._parm();
        if (!elm.hasClass('disabled')) {
            counter = parm.currentSlide;
            counter--;
            if (counter < 1) {
                counter = parm.slideCount;
            }
            elm.removeClass('dir-next').addClass('dir-prev disabled');
            this.goToSlide(counter);
        }
    },
    goToNext: function () {
        var elm = this.element;
        var parm = this._parm();
        if (!elm.hasClass('disabled')) {
            counter = parm.currentSlide;
            counter++;
            if (counter > parm.slideCount) {
                if (parm.loopMode === true) {
                    counter = 1;
                    elm.removeClass('dir-prev').addClass('dir-next disabled');
                    this.goToSlide(counter);
                } else {
                    return false;
                }
            } else {
                elm.removeClass('dir-prev').addClass('dir-next disabled');
                this.goToSlide(counter);
            }
        }
    },
    goToFirst: function () {
        var elm = this.element;
        if (!elm.hasClass('disabled')) {
            elm.removeClass('dir-next').addClass('dir-prev disabled');
            this.goToSlide(1);
        }
    },
    goToLast: function () {
        var elm = this.element;
        var parm = this._parm();
        if (!elm.hasClass('disabled')) {
            elm.removeClass('dir-prev').addClass('dir-next disabled');
            this.goToSlide(parm.slideCount);
        }
    },
    updateCanvas: function () {
        var elm = this.element;
        var parm = this._parm();
        var activeImage = elm.find('.slide--active img');
        var newWidth = activeImage.width();
        var newHeight = activeImage.height();
        elm.find('.canvas').attr('width', newWidth).attr('height', newHeight);
    },
    // private methods.
    _parm: function () {
        var elm = this.element;
        var slides = elm.find('.slides');
        var slideAll = slides.find('> *').not('.canvas');
        var slideActive = slides.find('.slide--active');
        var slidePrev = slides.find('.slide--prev');
        var slideNext = slides.find('.slide--next');
        return {
            slider: elm,
            slides: slides,
            slideAll: slideAll,
            slideActive: slideActive,
            slidePrev: slidePrev,
            slideNext: slideNext,
            width: slides.width(),
            height: slides.height(),
            slideCount: Number(slides.find('> *').length) - 1,
            loopMode: elm.hasClass('loop-mode'),
            currentSlide: Number(elm.find('.slide--active').index()) + 1,
            initialAnim: elm.attr('data-initial-anim')
        };
    },
    _slideCount: function () {
        var elm = this.element;
        return Number(elm.find('.slides > *').length) - 1;
    },
    _loopMode: function () {
        var elm = this.element;
        return elm.hasClass('loop-mode');
    },
    _getCurrentSlide: function () {
        var elm = this.element;
        return Number(elm.find('.slide--active').index()) + 1;
    },
    _createContainer: function (slides, width, height) {
        slides.children().addClass('slide');
        slides.append('<canvas class="canvas" width="' + width + '" height="' + height + '"></canvas>');
        slides.wrap('<div class="navs-wrapper"><div class="slide-area"></div></div>');
    },
    _makeNav: function () {
        var elm = this.element;
        if (!elm.hasClass('vertical-navs')) {
            elm.addClass('horizontal-navs');
        }
        if (!elm.hasClass('outside-navs')) {
            elm.addClass('inside-navs');
        }
        elm.find('.navs-wrapper').append('<span class="nav--prev"></span><span class="nav--next"></span>');
    },
    _makeDots: function () {
        var elm = this.element;
        var parm = this._parm();
        if (!elm.hasClass('inside-dots')) {
            elm.addClass('outside-dots');
        }
        if (!elm.hasClass('vertical-dots')) {
            elm.addClass('horizontal-dots');
            if (!elm.hasClass('left-dots') && !elm.hasClass('right-dots')) {
                elm.addClass('center-dots');
            }
            if (!elm.hasClass('top-dots')) {
                elm.addClass('bottom-dots');
            }
        }
        if (elm.hasClass('vertical-dots')) {
            if (!elm.hasClass('left-dots') && !elm.hasClass('right-dots')) {
                elm.addClass('right-dots');
            }
            if (elm.hasClass('outside-navs horizontal-navs')) {
                elm.removeClass('outside-dots');
                elm.addClass('inside-dots right-dots');
            }
        }
        if (elm.hasClass('vertical-dots')) {
            if (!elm.hasClass('top-dots') || !elm.hasClass('bottom-dots')) {
                elm.addClass('middle-dots');
            }
        }
        var dotsHTML = '<span class="dots">';
        var active = '';
        for (var i = 1; i <= parm.slideCount; i++) {
            if (i === 1) {
                active = ' active';
            }
            dotsHTML = dotsHTML + '<span class="dot' + active + '" data-target="' + i + '"></span>';
            active = '';
        }
        dotsHTML = dotsHTML + '</span>';
        if (elm.hasClass('top-dots')) {
            elm.prepend(dotsHTML);
        } else {
            elm.append(dotsHTML);
        }
    },
    _firstLastDetect: function (slide) {
        var elm = this.element;
        var parm = this._parm();
        $('.ma5slider__control[data-ma5slider="#' + elm.attr('id') + '"]').removeClass('targeted');
        $('.ma5slider__control[data-ma5slider="#' + elm.attr('id') + '"][data-ma5slide=' + slide + ']').addClass('targeted');
        if (parm.loopMode !== true) {
            elm.removeClass('last-slide first-slide');
            if (slide == parm.slideCount) {
                elm.trigger('ma5.lastSlide');
                elm.addClass('last-slide');
                $('.ma5slider__control[data-ma5slider="#' + elm.attr('id') + '"][data-ma5slide="next"]').addClass('targeted');
                $('.ma5slider__control[data-ma5slider="#' + elm.attr('id') + '"][data-ma5slide="last"]').addClass('targeted');
            }
            if (slide == 1) {
                elm.trigger('ma5.firstSlide');
                elm.addClass('first-slide');
                $('.ma5slider__control[data-ma5slider="#' + elm.attr('id') + '"][data-ma5slide="previous"]').addClass('targeted');
                $('.ma5slider__control[data-ma5slider="#' + elm.attr('id') + '"][data-ma5slide="first"]').addClass('targeted');
            }
        } else {
            if(slide < 1) {
                slide = parm.slideCount;
            } else if( slide > parm.slideCount ) {
                slide = 1;
            }
            if (slide == parm.slideCount) {
                elm.trigger('ma5.lastSlide');
                $('.ma5slider__control[data-ma5slider="#' + elm.attr('id') + '"][data-ma5slide="last"]').addClass('targeted');
            }
            if (slide == 1) {
                elm.trigger('ma5.firstSlide');
                $('.ma5slider__control[data-ma5slider="#' + elm.attr('id') + '"][data-ma5slide="first"]').addClass('targeted');
            }
        }
    },
    _updateAnim: function (slide) {
        var elm = this.element;
        if (elm.find('.slide:nth-child(' + slide + ')').attr('data-ma5-anim') !== undefined) {
            var anim = elm.find('.slide:nth-child(' + slide + ')').attr('data-ma5-anim');
            elm.removeClass('anim-horizontal anim-vertical anim-fade').addClass(anim);
        } else {
            elm.removeClass('anim-horizontal anim-vertical anim-fade').addClass(elm.attr('data-initial-anim'));
        }
    },
    _updateDotsColors: function () {
        var elm = this.element;
        if (elm.find('.slide--active').attr('data-ma5-dot') !== undefined) {
            var dotColor = elm.find('.slide--active').attr('data-ma5-dot');
            elm.find('.dot:not(".active")').css('background-color', dotColor);
        } else {
            elm.find(' .dot:not(".active")').css('background-color', '');
        }
        if (elm.find(' .slide--active').attr('data-ma5-dot-active') !== undefined) {
            var dotActiveColor = 'background-color:' + elm.find('.slide--active').attr('data-ma5-dot-active');
            elm.find('.dot.active').attr('style', dotActiveColor);
        } else {
            elm.find('.dot.active').css('background-color', '');
        }
    },
    _updateNavsColors: function () {
        var elm = this.element;
        if (elm.find('.slide--active').attr('data-ma5-nav') !== undefined) {
            var navColor = elm.find('.slide--active').attr('data-ma5-nav');
            elm.find('.nav--prev, .nav--next').css('color', navColor);
        } else {
            elm.find('.nav--prev, .nav--next').css('color', '');
        }
    },
    _updateDirection: function () {
        var elm = this.element;
        if (elm.find('.slide--active').attr('data-ma5-nav-prev-dir') !== undefined) {
            var navPrevDir = elm.find('.slide--active').attr('data-ma5-nav-prev-dir');
            elm.find('.nav--prev').addClass(navPrevDir);
        } else {
            elm.find('.nav--prev').removeClass('nav__top nav__bottom');
        }
        if (elm.find('.slide--active').attr('data-ma5-nav-next-dir') !== undefined) {
            var navNextDir = elm.find('.slide--active').attr('data-ma5-nav-next-dir');
            elm.find('.nav--next').addClass(navNextDir);
        } else {
            elm.find('.nav--next').removeClass('nav__top nav__bottom');
        }
    },
    _autoplay: function (tempo) {
        var elm = this.element;
        var widgetThis = this;
        var parm = this._parm();
        var counter = parm.currentSlide;
        var autoplay = setInterval(function () {
            counter++;
            if (counter > parm.slideCount) {
                counter = 1;
            }
            widgetThis.goToSlide(counter);
        }, tempo);
        $("body").keydown(function (e) {
            if (e.keyCode == 9) {
                clearInterval(autoplay);
                return true;
            }
        });

        elm.on('touch click', function () {
            clearInterval(autoplay);
            return true;
        });
        parm.slides.mousemove(function () {
            if ($(this).is('.ui-draggable-dragging')) {
                clearInterval(autoplay);
                return true;
            }
        });
    },
    _updateAfterPrevDrag: function () {
        var elm = this.element;
        var parm = this._parm();
        var slides = parm.slides;
        var currentSlide = parm.currentSlide - 1;
        elm.removeClass('dir-next').addClass('dir-prev ' + parm.initialAnim);
        if (currentSlide > 0) {
            elm.trigger('ma5.activeSlide', [currentSlide]);
            elm.find('> .dots .dot[data-target="' + (currentSlide) + '"]').addClass('active').siblings().removeClass('active');
        } else {
            elm.trigger('ma5.activeSlide', [parm.slideCount]);
            elm.find('> .dots .dot[data-target="' + (parm.slideCount) + '"]').addClass('active').siblings().removeClass('active');
        }
        elm.find('.slides > .slide--next').removeClass('slide--next');
        elm.find('.slides > .slide--active').removeClass('slide--active').addClass('slide--next');
        elm.find('.slides > .slide--prev').removeClass('slide--prev').addClass('slide--active');
        if (currentSlide != 1) {
            parm.slidePrev.prev().addClass('slide--prev');
        } else {
            parm.slideAll.last().addClass('slide--prev');
        }
        slides.removeClass('dragged-prev-end dragged-next-end');
        this._ma5draggable();
        this._firstLastDetect(currentSlide);
        this._updateDotsColors();
        this._updateNavsColors();
        this._updateDirection();
        elm.trigger('ma5.animationEnd');
    },
    _updateAfterNextDrag: function () {
        var elm = this.element;
        var parm = this._parm();
        var slideCount = parm.slideCount - 1;
        elm.removeClass('dir-prev').addClass('dir-next ' + parm.initialAnim);
        if (parm.currentSlide <= slideCount) {
            elm.trigger('ma5.activeSlide', [parm.currentSlide + 1]);
            elm.find('> .dots .dot[data-target="' + (parm.currentSlide + 1) + '"]').addClass('active').siblings().removeClass('active');
        } else {
            elm.trigger('ma5.activeSlide', [1]);
            elm.find('> .dots .dot[data-target="1"]').addClass('active').siblings().removeClass('active');
        }
        elm.find('.slides > .slide--prev').removeClass('slide--prev');
        elm.find('.slides > .slide--active').removeClass('slide--active').addClass('slide--prev');
        elm.find('.slides > .slide--next').removeClass('slide--next').addClass('slide--active');
        if (parm.currentSlide != slideCount) {
            parm.slideNext.next().addClass('slide--next');
        } else {
            parm.slideAll.first().addClass('slide--next');
        }
        parm.slides.removeClass('dragged-prev-end dragged-next-end');
        this._ma5draggable();
        this._firstLastDetect(parm.currentSlide + 1);
        this._updateDotsColors();
        this._updateNavsColors();
        this._updateDirection();
        elm.trigger('ma5.animationEnd');
    },
    _goToSlideDotTarget: function (target) {
        var elm = this.element;
        var parm = this._parm();
        if (!elm.find('> .dots').hasClass('dots-disabled')) {
            if (target > parm.currentSlide) {
                elm.removeClass('dir-prev').addClass('dir-next');
            }
            if (target < parm.currentSlide) {
                elm.removeClass('dir-next').addClass('dir-prev');
            }
            if (target != parm.currentSlide) {
                elm.find('> .dots').addClass('dots-disabled');
                this.goToSlide(target);
            }
        }
    },
    _ma5draggable: function () {
        var elm = this.element;
        $.globalVars = {
            originalTop: 0,
            originalLeft: 0
        };
        var widgetThis = this;
        var parm = this._parm();
        var slides = parm.slides;
        var elmWidth = parm.width;
        var elmHeight = parm.height;
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
        if (parm.initialAnim == 'anim-horizontal' || 'anim-fade') {
            slides.draggable({
                axis: "x",
                revert: true,
                start: function (event, ui) {
                    if (ui.position !== undefined) {
                        $.globalVars.originalLeft = ui.position.left;
                    }
                },
                drag: function (event, ui) {
                    elm.removeClass('dir-next dir-prev anim-fade anim-vertical').addClass('anim-horizontal');
                    var newLeft = ui.position.left;
                    if (ui.position.left < Vars.maxWidthRight) {
                        newLeft = Vars.maxWidthRight;
                    }
                    if (ui.position.left > Vars.maxWidthLeft) {
                        newLeft = Vars.maxWidthLeft;
                    }
                    ui.position.left = newLeft;
                    if (ui.position.left > 0) {
                        if (parm.loopMode === false && elm.find('.slide--active').index() === 0) {
                        } else {
                            elm.removeClass('drag-next').addClass('drag-prev dir-prev');
                            if (ui.position.left >= Vars.itemWidthBreakpoint) {
                                slides.draggable("option", "revert", false);
                                elm.trigger('ma5.animationStart');
                                slides.animate({
                                    left: Vars.maxWidth
                                }, 300, function () {
                                    slides.addClass('dragged-prev-end').removeAttr('style');
                                    widgetThis._updateAfterPrevDrag();
                                });
                                return false;
                            }
                        }
                    } else {
                        if (parm.loopMode === false && parm.currentSlide == parm.slideCount) {
                        } else {
                            elm.removeClass('drag-prev').addClass('drag-next dir-prev');
                            if (ui.position.left <= Vars.itemWidthBreakpointSub) {
                                slides.draggable("option", "revert", false);
                                elm.trigger('ma5.animationStart');
                                slides.animate({
                                    left: Vars.maxWidth * -1
                                }, 300, function () {
                                    slides.addClass('dragged-next-end').removeAttr('style');
                                    widgetThis._updateAfterNextDrag();
                                });
                                return false;
                            }
                        }
                    }
                }
            });
        }
        if (parm.initialAnim == 'anim-vertical') {
            slides.draggable({
                axis: "y",
                revert: true,
                start: function (event, ui) {
                    if (ui.position !== undefined) {
                        $.globalVars.originalTop = ui.position.top;
                    }
                },
                drag: function (event, ui) {
                    elm.removeClass('dir-next dir-prev anim-fade anim-horizontal').addClass('anim-vertical');
                    var newTop = ui.position.top;
                    if (ui.position.top > Vars.maxHeightTop) {
                        newTop = Vars.maxHeightTop;
                    }
                    if (ui.position.top < Vars.maxHeightBottom) {
                        newTop = Vars.maxHeightBottom;
                    }
                    ui.position.top = newTop;
                    if (ui.position.top > 0) {
                        if (parm.loopMode === false && elm.find('.slide--active').index() === 0) {
                        } else {
                            elm.removeClass('drag-next').addClass('drag-prev dir-prev');
                            if (ui.position.top >= Vars.itemHeightBreakpoint) {
                                slides.draggable("option", "revert", false);
                                elm.trigger('ma5.animationStart');
                                slides.animate({
                                    top: Vars.maxHeight
                                }, 300, function () {
                                    $(this).addClass('dragged-prev-end').removeAttr('style');
                                    widgetThis._updateAfterPrevDrag();
                                });
                                return false;
                            }
                        }
                    } else {
                        if (parm.loopMode === false && parm.currentSlide == parm.slideCount) {
                        } else {
                            elm.removeClass('drag-prev').addClass('drag-next dir-prev');
                            if (ui.position.top <= Vars.itemHeightBreakpointSub) {
                                slides.draggable("option", "revert", false);
                                elm.trigger('ma5.animationStart');
                                slides.animate({
                                    top: Vars.maxHeight * -1
                                }, 300, function () {
                                    slides.addClass('dragged-next-end').removeAttr('style');
                                    widgetThis._updateAfterNextDrag();
                                });
                                return false;
                            }
                        }
                    }
                }
            });
        }
        return this;
    }
});

// Block link drag
$(document).ready(function () {
    $(document).on("dragstart", ".ma5slider a", function () {
        return false;
    });
});

// Refresh for responsive
$(window).resize(function () {
    $('.ma5slider').ma5slider('goToSlide', 'current');
    setTimeout(function () {
        $('.ma5slider').ma5slider('updateCanvas');
    }, 500);
});

// External control extension
$(window).on('load', function () {
    $('.ma5slider__control').on('touch click', function () {
        var elmText = $(this).attr('data-ma5slider');
        var elmExternal = $(elmText);
        var target = $(this).attr('data-ma5slide');
        if (target == 'next') {
            $(elmText).ma5slider('goToNext');
        } else if (target == 'previous') {
            $(elmText).ma5slider('goToPrev');
        } else if (target == 'first') {
            $(elmText).ma5slider('goToFirst');
        } else if (target == 'last') {
            $(elmText).ma5slider('goToLast');
        } else {
            $(elmText).ma5slider('goToSlide', Number(target));
        }
    });
});
