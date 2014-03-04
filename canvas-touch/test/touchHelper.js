/*global define */
define([
    'scalejs!core',
    'hammer'
], function (
    core,
    hammer
) {
    'use strict';

    function Color(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = (a !== undefined ? a : 255);

        this.toHex = function () {
            return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
        }

        this.toRGBA = function () {
            return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        }

        this.equals = function (col) {
            var compareRGB = (this.r === col.r && this.g === col.g && this.b === col.b),
            // Alpha comparison (which works only in these non-complex rendering tests) is to fix floating precision errors, and satisfy scaling colors.
                compareAlpha = ((this.a >= 128) === (col.a >= 128)),
                compareTransparent = ((this.a < 128) && (col.a < 128));
            return (compareRGB && compareAlpha) || compareTransparent;
        };

        return this;
    }

    function Canvas(canvasWidth, canvasHeight) {
        var divElement = document.createElement("div"),
            element = document.createElement("canvas"),
            context = element.getContext('2d'),
            touchElement,
            touchObj,
            hammerObj,
            instance = [],
            object = {
                Rectangle: function (options) {
                    this.x = options.x || 0;
                    this.y = options.y || 0;
                    this.width = options.width || 0;
                    this.height = options.height || 0;

                    this.render = function () {
                        context.save();
                        var hwidth = this.width / 2,
                            hheight = this.height / 2;
                        context.fillStyle = "#000000";
                        context.fillRect(this.x, this.y, hwidth, hheight);
                        context.fillStyle = "#FF0000";
                        context.fillRect(this.x + hwidth, this.y, hwidth, hheight);
                        context.fillStyle = "#00FF00";
                        context.fillRect(this.x, this.y + hheight, hwidth, hheight);
                        context.fillStyle = "#0000FF";
                        context.fillRect(this.x + hwidth, this.y + hheight, hwidth, hheight);
                        context.restore();
                    }

                    return this;
                }
            },
            leftVal = 0,
            topVal = 0,
            rotateVal = 0,
            scaleVal = 1;

        function getTouchCanvas() {
            var canvas = divElement.getElementsByTagName("canvas");
            if (canvas.length == 2) {
                return canvas[1];
            }
        }
        this.getTouchCanvas = getTouchCanvas;

        function getTouchPixel(x, y) {
            var data = touchElement.getContext('2d').getImageData(x, y, 1, 1).data;
            return new Color(data[0], data[1], data[2], data[3]);
        }
        this.getTouchPixel = getTouchPixel;

        function expectTouchPixel(x, y, col) {
            //expect(getTouchPixel(x, y).equals(col)).toBe(true);
            var pix = getTouchPixel(x, y);
            if (getTouchPixel(x, y).equals(col)) {
                expect(true).toBe(true);
            } else {
                // Slight hack to make fail messages easier to read through:
                expect("xy(" + x + "," + y + ")=" + getTouchPixel(x, y).toRGBA()).toBe("xy(" + x + "," + y + ")=" + col.toRGBA());
            }
        }
        this.expectTouchPixel = expectTouchPixel;

        function clear() {
            instance.length = 0;
            context.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        this.clear = clear;

        function add(options) {
            instance.push(object[options.type](options));
        }
        this.add = add;

        function render() {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.translate(leftVal, topVal);
            context.scale(scaleVal, scaleVal);
            context.rotate(rotateVal / 180 * Math.PI);
            //context.translate(-leftVal, -topVal);
            for (var i = 0; i < instance.length; i += 1) {
                instance[i].render();
            }
        }
        this.render = render;

        function getPixel(x, y) {
            var data = context.getImageData(x, y, 1, 1).data;
            return new Color(data[0], data[1], data[2], data[3]);
        }
        this.getPixel = getPixel;

        function triggerTouch(touches) {
            hammerObj.trigger("touch", {
                preventDefault: function () { return; },
                touches: touches
            });
        }
        this.triggerTouch = triggerTouch;

        function triggerDrag(touches) {
            hammerObj.trigger("drag", {
                preventDefault: function () { return; },
                touches: touches
            });
        }
        this.triggerDrag = triggerDrag;

        function triggerPinch(touches) {
            hammerObj.trigger("pinch", {
                preventDefault: function () { return; },
                touches: touches
            });
        }
        this.triggerPinch = triggerPinch;

        function triggerWheel(touches, wheelDelta) {    // Most code in this function comes from hammer, but modified to be able to use wheelDelta:
            // Create DOM mousewheel event:
            var event = window.document.createEvent("Event");
            event.initEvent("mousewheel", true, true);
            event.gesture = {
                preventDefault: function () { return; },
                touches: touches
            };
            event.pageX = touches[0].pageX;
            event.pageY = touches[0].pageY;
            event.wheelDelta = wheelDelta;

            // Trigger event:
            divElement.dispatchEvent(event);
        }
        this.triggerWheel = triggerWheel;

        function triggerRotate(touches) {
            hammerObj.trigger("rotate", {
                preventDefault: function () { return; },
                touches: touches
            });
        }
        this.triggerRotate = triggerRotate;

        function triggerRelease(touches) {
            hammerObj.trigger("release", {
                preventDefault: function () { return; },
                touches: touches
            });
        }
        this.triggerRelease = triggerRelease;

        function remove() {
            instance.length = 0;
            touchObj.remove();
            hammerObj.enable(false);
            element.parentNode.removeChild(element);
            divElement.parentNode.removeChild(divElement);
        }
        this.remove = remove;

        function renderCallback(left, top, rotate, scale) {
            leftVal = left;
            topVal = top;
            rotateVal = rotate;
            scaleVal = scale;
            render();
        }
        function startCallback() {
            return {
                left: leftVal,
                top: topVal,
                rotate: rotateVal,
                scale: scaleVal
            };
        }

        divElement.style.position = "absolute";
        divElement.style.left = 0;
        divElement.style.top = 0;
        divElement.style.display = "";
        divElement.style.width = canvasWidth;
        divElement.style.height = canvasHeight;
        divElement.setAttribute("width", canvasWidth);
        divElement.setAttribute("height", canvasHeight);
        element.style.position = "absolute";
        element.style.left = 0;
        element.style.top = 0;
        element.style.display = "";
        element.style.width = canvasWidth;
        element.style.height = canvasHeight;
        element.setAttribute("width", canvasWidth);
        element.setAttribute("height", canvasHeight);
        divElement.appendChild(element);
        document.body.appendChild(divElement);
        touchObj = core.canvas.touch({
            canvas: element,
            renderCallback: renderCallback,
            startCallback: startCallback
        });
        touchElement = getTouchCanvas();
        hammerObj = hammer(element, {
            prevent_default: true
        });

        return this;
    }

    return {
        Canvas: Canvas,
        Color: Color
    };
});