# ma5slider
Ease to use, lightweight and responsive jQuery Slider. Customizable by CSS classes. Custom animations for each slide. **[Demo]**(http://ma5slider.ma5.pl)

##Quick start

Rule: If you plan to use a few sliders at the page, use the unique ID for each slider.

HTML in <head>:
```html
    <head>
        <!-- jQuery -->
        <script src="http://ma5slider.ma5.pl/js/jquery.min.js"></script>
         
        <!-- jQuery UI mouse draggable widget (optional) -->
        <script src="http://ma5slider.ma5.pl/js/jquery-ui.min.js"></script>
         
        <!-- Touch Event Support for jQuery UI (optional) -->
        <script src="http://ma5slider.ma5.pl/js/jquery.ui.touch-punch.min.js"></script>
         
        <!-- MA5 Slider -->
        <link href="http://ma5slider.ma5.pl/css/ma5slider.min.css" rel="stylesheet" type="text/css">
        <script src="http://ma5slider.ma5.pl/js/ma5slider.min.js"></script>
         
        <!-- Call the script -->
        <script>
            $(document).ready(function () {
                ma5slider({ slider: "#example-1" });
            });
        </script>
    </head>
```
HTML in <body>:
```html
    <body>
        <div id="sample" class="ma5slider outside-navs outside-dots anim-horizontal loop-mode">
            <div class="slides">
                <!-- children = slides -->
                <a href="#slide-1"><img src="http://ma5slider.ma5.pl/images/DSC_0916.jpg" alt=""></a>
                <a href="#slide-2"><img src="http://ma5slider.ma5.pl/images/DSC_0922.jpg" alt=""></a>
                <a href="#slide-3"><img src="http://ma5slider.ma5.pl/images/DSC_1002.jpg" alt=""></a>
                <a href="#slide-4"><img src="http://ma5slider.ma5.pl/images/DSC_1103.jpg" alt=""></a>
                <a href="#slide-5"><img src="http://ma5slider.ma5.pl/images/DSC_1376.jpg" alt=""></a>
                <a href="#slide-6"><img src="http://ma5slider.ma5.pl/images/DSC_1390.jpg" alt=""></a>
            </div>
        </div>
    </body>
```  


## Customize

You can use a **CSS classes** next to **ma5slider** to the final appearance.

```html
    <div id="example..." class="ma5slider anim-horizontal top-dots outside-navs ...">
```

**Tip:** Slider without CSS classes for dots hides dots. Slider without CSS classes for arrows hides arrows.

**Rule:** Use **ID** for each slider.

**Rule:** You can choose **only one parameter** of each module.

**1\. Slide animation module**



| Class name | Description | Example page |
-------------|-------------|---------------
| anim-horizontal <span class="legend">default</span> | Slides animated horizontally. | [Example](http://ma5slider.ma5.pl/index-examples.html#anim-horizontal) |
| anim-vertical | Slides animated vertically. | [Example](http://ma5slider.ma5.pl/index-examples.html#anim-vertical) |
| anim-fade | Slides animated by fade effect. | [Example](http://ma5slider.ma5.pl/index-examples.html#anim-fade) |


**2\. Arrows direction module**


| Class name | Description | Example page |
-------------|-------------|---------------
| horizontal-navs <span class="legend">default</span> | Arrows left and right. | [Example](http://ma5slider.ma5.pl/index-examples.html#horizontal-navs) |
| vertical-navs | Arrows top and bottom. | [Example](http://ma5slider.ma5.pl/index-examples.html#vertical-navs) |


**3\. Nesting arrows module**


| Class name | Description | Example page |
-------------|-------------|---------------
| inside-navs <span class="legend">default</span> | Arrows inside. | [Example](http://ma5slider.ma5.pl/index-examples.html#inside-navs) |
| outside-navs | Arrows outside. | [Example](http://ma5slider.ma5.pl/index-examples.html#outside-navs) |



**4\. Dots direction module**



| Class name | Description | Example page |
-------------|-------------|---------------
| horizontal-dots <span class="legend">default</span> | Dots placed horizontally. You can add additional align parameters: **center-dots** <span class="legend">default</span>, **left-dots**, **right-dots** | [Example](http://ma5slider.ma5.pl/index-examples.html#horizontal-dots) || vertical-dots | Dots placed vertically. You can add additional align parameters: **middle-dots** <span class="legend">default</span>, **top-dots**, **bottom-dots** | [Example](http://ma5slider.ma5.pl/index-examples.html#vertical-dots) |



**5\. Dots ordering module**



| Class name | Description | Example page |
-------------|-------------|---------------
| bottom-dots <span class="legend">default</span> | Dots placed after slides. | [Example](http://ma5slider.ma5.pl/index-examples.html#bottom-dots) || top-dots | Dots placed before slides. | [Example](http://ma5slider.ma5.pl/index-examples.html#top-dots) |



**6\. Nesting dots module**



| Class name | Description | Example page |
-------------|-------------|---------------
| outside-dots <span class="legend">default</span> | Dots outside. | [Example](http://ma5slider.ma5.pl/index-examples.html#outside-dots) |
| inside-dots | Dots inside. | [Example](http://ma5slider.ma5.pl/index-examples.html#inside-dots) |



**7\. Navs hover module**



| Class name | Description | Example page |
-------------|-------------|---------------
| hover-navs | Show arrows at hover | [Example](http://ma5slider.ma5.pl/index-examples.html#hover-navs) |



**8\. Dots hover module**



| Class name | Description | Example page |
-------------|-------------|---------------
| hover-dots | Show dots at hover | [Example](http://ma5slider.ma5.pl/index-examples.html#hover-dots) |



**9\. Autoplay module**



| Class name | Description | Example page |
-------------|-------------|---------------
| autoplay | Auto play slider. Set tempo by data-tempo attribute. For 1500ms: **data-tempo="1500"** | [Example](http://ma5slider.ma5.pl/index-examples.html#autoplay) |



**10\. Loop module**



| Class name | Description | Example page |
-------------|-------------|---------------
| loop-mode | Enable loop for slides | [Example](http://ma5slider.ma5.pl/index-examples.html#loop-mode) |



**11\. Dots visibility module**



| Class name | Description | Example page |
-------------|-------------|---------------
| hidden-dots | Hide dots | [Example](http://ma5slider.ma5.pl/index-examples.html#hidden-dots) |



**12\. Navs visibility module**



| Class name | Description | Example page |
-------------|-------------|---------------
| hidden-navs | Hide navs | [Example](http://ma5slider.ma5.pl/index-examples.html#hidden-navs) |



## Overwrite global settings by specific slide settings

Global settings can be overwrite by attributess added to specific slide.

**1\. Overwrite dots color**



| Attribute name | Description | Example page |
-----------------|-------------|---------------
| data-ma5-dot,
data-ma5-dot-active | Overwrite dots colors for specific slide. | [Example](http://ma5slider.ma5.pl/index-examples.html#data-ma5-dot) |



**2\. Overwrite navs color**



| Attribute name | Description | Example page |
-----------------|-------------|---------------
| data-ma5-nav | Overwrite nav colors for specific slide. | [Example](http://ma5slider.ma5.pl/index-examples.html#data-ma5-nav) |



**3\. Overwrite animation**

Note: During mouse drag animation is always horizontal.



| Attribute name | Description | Example page |
-----------------|-------------|---------------
| data-ma5-anim | Overwrite animation for specific slide. | [Example](http://ma5slider.ma5.pl/index-examples.html#data-ma5-anim) |



## HTML control

External control elements for the slider.

```html
    <a class="ma5slider__control" href="#slide.." data-ma5slider="#example-33" data-ma5slide="4">Go to slide 4</a>
    <a class="ma5slider__control" href="#slide.." data-ma5slider="#example-33" data-ma5slide="first">First slide</a>
    <a class="ma5slider__control" href="#slide.." data-ma5slider="#example-33" data-ma5slide="previous">Previous slide</a>
    <a class="ma5slider__control" href="#slide.." data-ma5slider="#example-33" data-ma5slide="next">Next slide</a>
    <a class="ma5slider__control" href="#slide.." data-ma5slider="#example-33" data-ma5slide="last">Last slide</a>
```

[Example](http://ma5slider.ma5.pl/index-examples.html#ma5slider__control)

## Script control

**1\. Go to slide**

```javascript
    <script>
        $(document).ready(function () {
           ma5sliderGoToSlide('#slider', 3 );
        });
    </script>
```

**2\. Go to next slide**

```javascript
    <script>
        $(document).ready(function () {
           ma5sliderGoToNext('#slider');
        });
    </script>
```

**3\. Go to previous slide**

```javascript
    <script>
        $(document).ready(function () {
           ma5sliderGoToPrev('#slider');
        });
    </script>
```

**4\. Go to first slide**

```javascript
    <script>
        $(document).ready(function () {
           ma5sliderGoToFirst('#slider');
        });
    </script>
```

**4\. Go to last slide**

```javascript
    <script>
        $(document).ready(function () {
           ma5sliderGoToLast('#slider');
        });
    </script>
```

[Example](http://ma5slider.ma5.pl/index-examples.html#script-control-slide-number)

## Mouse Draggable Extension

[jQuery UI](http://jqueryui.com) with "draggable" turns on slider mouse drag action.

Prepare jQuery UI file: [Builder link](http://jqueryui.com/download/#!version=1.12.1&themeParams=none&components=101000000100100000000000010000000000000000000000)

For touch action in jQuery UI you can add Touch Event Support for jQuery UI: [jQuery UI Touch Punch](http://touchpunch.furf.com/)
