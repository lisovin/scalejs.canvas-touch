/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core',
    'scalejs.canvas-touch',
    './touchHelper',
    'jasmine-html'
], function (core, touch, helper) {
    describe('A simple pan', function () {
        var currentCanvas, pointer;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 100,
                y: 100,
                width: 50,
                height: 50
            });
            currentCanvas.render();

            // Initialize pointer:
            pointer = [{
                pageX: 125,
                pageY: 125
            }];

            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(pointer);
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly renders rectangle', function () {
            // Translate Nowhere:
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
        it('correctly translates rectangle up', function () {
            // Translate Up:
            pointer[0].pageY -= 50;
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 50, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 49, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 50, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 99, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
        it('correctly translates rectangle left', function () {
            // Translate Left:
            pointer[0].pageX -= 50;
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(49, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(100, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(99, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(99, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
        it('correctly translates rectangle right and down', function () {
            // Translate Right&Down:
            pointer[0].pageX += 50;
            pointer[0].pageY += 50;
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(150, 150, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(200, 199, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(199, 200, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(199, 199, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
    });

    describe('A simple centered rotate', function () {
        var currentCanvas, touches;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 100,
                y: 100,
                width: 50,
                height: 50
            });
            currentCanvas.render();

            // Initialize touches:
            touches = [{
                pageX: 100,
                pageY: 125
            }, {
                pageX: 150,
                pageY: 125
            }];

            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(touches);
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly renders rectangle', function () {
            // Rotate Nowhere:
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly rotates rectangle clockwise', function () {
            // Rotate Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 100;
            touches[1].pageX = 125;
            touches[1].pageY = 150;
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 255, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(255, 0, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly rotates rectangle counter-clockwise', function () {
            // Rotate Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 150;
            touches[1].pageX = 125;
            touches[1].pageY = 100;
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(255, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 255, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
    });

    describe('A simple centered scale', function () {
        var currentCanvas, pointer, touches;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 75,
                y: 75,
                width: 100,
                height: 100
            });
            currentCanvas.render();

            // Initialize pointer:
            pointer = [{
                pageX: 125,
                pageY: 125
            }];
            // Initialize touches:
            touches = [{
                pageX: 75,
                pageY: 125
            }, {
                pageX: 175,
                pageY: 125
            }];

            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(touches);
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly renders rectangle using pinch', function () {
            // Scale Nowhere:
            currentCanvas.triggerPinch(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(74, 75, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 74, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 75, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(175, 174, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 175, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 174, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle inwards using pinch', function () {
            // Scale Inward:
            touches[0].pageX = 100;
            touches[0].pageY = 125;
            touches[1].pageX = 150;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle outwards using pinch', function () {
            // Scale Outward:
            touches[0].pageX = 25;
            touches[0].pageY = 125;
            touches[1].pageX = 225;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(24, 25, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(25, 24, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(25, 25, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(225, 224, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(224, 225, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(224, 224, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly renders rectangle using mousewheel', function () {
            // Scale Nowhere:
            currentCanvas.triggerWheel(pointer, 0);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(74, 75, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 74, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 75, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(175, 174, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 175, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 174, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
        it('correctly scales rectangle inwards using mousewheel', function () {
            // Scale Inward:
            currentCanvas.triggerWheel(pointer, -120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(87, 88, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 87, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 88, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(163, 162, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(162, 163, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(161, 161, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
        it('correctly scales rectangle outwards using mousewheel', function () {
            // Scale Outward:
            currentCanvas.triggerWheel(pointer, 120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(57, 58, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(58, 57, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(59, 59, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(192, 191, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(191, 192, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(190, 190, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
    });

    describe('An additive pan', function () {
        var currentCanvas, pointer;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 100,
                y: 100,
                width: 50,
                height: 50
            });
            currentCanvas.render();

            // Initialize pointer:
            pointer = [{
                pageX: 125,
                pageY: 125
            }];

            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(pointer);
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly translates rectangle right, then up', function () {
            // Translate Right:
            pointer[0].pageX += 50;
            currentCanvas.triggerDrag(pointer);
            // Translate Down:
            pointer[0].pageY += 50;
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(150, 150, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(200, 199, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(199, 200, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(199, 199, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
        it('correctly translates rectangle down, then left', function () {
            // Translate Up:
            pointer[0].pageY -= 50;
            currentCanvas.triggerDrag(pointer);
            // Translate Left:
            pointer[0].pageX -= 50;
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(49, 50, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 49, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 50, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(99, 99, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
        it('correctly translates rectangle left&up, then right&down', function () {
            // Translate Left&Up:
            pointer[0].pageX -= 50;
            pointer[0].pageY -= 50;
            currentCanvas.triggerDrag(pointer);
            // Translate Right&Down:
            pointer[0].pageX += 50;
            pointer[0].pageY += 50;
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
        it('correctly translates rectangle left&up, then left&down, then right&up', function () {
            // Translate Left&Up:
            pointer[0].pageX -= 50;
            pointer[0].pageY -= 50;
            currentCanvas.triggerDrag(pointer);
            // Translate Left&Down:
            pointer[0].pageX -= 50;
            pointer[0].pageY += 50;
            currentCanvas.triggerDrag(pointer);
            // Translate Right&Up:
            pointer[0].pageX += 50;
            pointer[0].pageY -= 50;
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(49, 50, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 49, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 50, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(99, 99, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(pointer);
        });
    });

    describe('An additive centered rotate', function () {
        var currentCanvas, touches;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 100,
                y: 100,
                width: 50,
                height: 50
            });
            currentCanvas.render();

            // Initialize touches:
            touches = [{
                pageX: 100,
                pageY: 125
            }, {
                pageX: 150,
                pageY: 125
            }];

            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(touches);
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly rotates rectangle clockwise, then counter-clockwise', function () {
            // Rotate Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 100;
            touches[1].pageX = 125;
            touches[1].pageY = 150;
            currentCanvas.triggerRotate(touches);
            // Rotate Counter-Clockwise:
            touches[0].pageX = 100;
            touches[0].pageY = 125;
            touches[1].pageX = 150;
            touches[1].pageY = 125;
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly rotates rectangle counter-clockwise, then clockwise', function () {
            // Rotate Counter-Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 150;
            touches[1].pageX = 125;
            touches[1].pageY = 100;
            currentCanvas.triggerRotate(touches);
            // Rotate Clockwise:
            touches[0].pageX = 100;
            touches[0].pageY = 125;
            touches[1].pageX = 150;
            touches[1].pageY = 125;
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly rotates rectangle clockwise, then counter-clockwise, then clockwise', function () {
            // Rotate Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 100;
            touches[1].pageX = 125;
            touches[1].pageY = 150;
            currentCanvas.triggerRotate(touches);
            // Rotate Counter-Clockwise:
            touches[0].pageX = 100;
            touches[0].pageY = 125;
            touches[1].pageX = 150;
            touches[1].pageY = 125;
            currentCanvas.triggerRotate(touches);
            // Rotate Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 100;
            touches[1].pageX = 125;
            touches[1].pageY = 150;
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 255, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(255, 0, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly rotates rectangle counter-clockwise, then clockwise, then clockwise, then clockwise', function () {
            // Rotate Counter-Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 150;
            touches[1].pageX = 125;
            touches[1].pageY = 100;
            currentCanvas.triggerRotate(touches);
            // Rotate Clockwise:
            touches[0].pageX = 100;
            touches[0].pageY = 125;
            touches[1].pageX = 150;
            touches[1].pageY = 125;
            currentCanvas.triggerRotate(touches);
            // Rotate Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 100;
            touches[1].pageX = 125;
            touches[1].pageY = 150;
            currentCanvas.triggerRotate(touches);
            // Rotate Clockwise:
            touches[0].pageX = 150;
            touches[0].pageY = 125;
            touches[1].pageX = 100;
            touches[1].pageY = 125;
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 255));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
    });

    describe('An additive centered scale', function () {
        var currentCanvas, pointer, touches;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 75,
                y: 75,
                width: 100,
                height: 100
            });
            currentCanvas.render();

            // Initialize pointer:
            pointer = [{
                pageX: 125,
                pageY: 125
            }];
            // Initialize touches:
            touches = [{
                pageX: 75,
                pageY: 125
            }, {
                pageX: 175,
                pageY: 125
            }];

            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(touches);
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly scales rectangle inwards, then outwards using pinch', function () {
            // Scale Inwards:
            touches[0].pageX = 100;
            touches[0].pageY = 125;
            touches[1].pageX = 150;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Scale Outwards:
            touches[0].pageX = 50;
            touches[0].pageY = 125;
            touches[1].pageX = 200;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(49, 50, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 49, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 50, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(200, 199, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(199, 200, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(199, 199, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle outwards, then inwards using pinch', function () {
            // Scale Outwards:
            touches[0].pageX = 50;
            touches[0].pageY = 125;
            touches[1].pageX = 200;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Scale Inwards:
            touches[0].pageX = 100;
            touches[0].pageY = 125;
            touches[1].pageX = 150;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle inwards, then outwards using mousewheel', function () {
            // Scale Inwards:
            currentCanvas.triggerWheel(pointer, -120);
            // Scale Outwards:
            currentCanvas.triggerWheel(pointer, 120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(74, 75, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 74, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 75, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(175, 174, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 175, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 174, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle outwards, then inwards using mousewheel', function () {
            // Scale Inwards:
            currentCanvas.triggerWheel(pointer, 120);
            // Scale Outwards:
            currentCanvas.triggerWheel(pointer, -120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(74, 75, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 74, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 75, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(175, 174, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 175, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 174, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle inwards using pinch, then outwards using mousewheel', function () {
            // Scale Inwards:
            touches[0].pageX = 87.5;
            touches[0].pageY = 125;
            touches[1].pageX = 162.5;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Scale Outwards:
            currentCanvas.triggerWheel(pointer, 120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(74, 75, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 74, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 75, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(175, 174, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 175, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 174, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle inwards using mousewheel, then outwards using pinch', function () {
            // Scale Inwards:
            currentCanvas.triggerWheel(pointer, -120);
            // Scale Outwards:
            touches[0].pageX = 75 - 100 / 6;
            touches[0].pageY = 125;
            touches[1].pageX = 175 + 100 / 6;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(74, 75, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 74, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(75, 75, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(175, 174, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 175, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(174, 174, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle inwards, then outwards, then inwards using pinch', function () {
            // Scale Inwards:
            touches[0].pageX = 120;
            touches[0].pageY = 125;
            touches[1].pageX = 130;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Scale Outwards:
            touches[0].pageX = 50;
            touches[0].pageY = 125;
            touches[1].pageX = 200;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Scale Inwards:
            touches[0].pageX = 100;
            touches[0].pageY = 125;
            touches[1].pageX = 150;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle inwards, then outwards, then inwards using mousewheel', function () {
            // Scale Inwards:
            currentCanvas.triggerWheel(pointer, -120);
            // Scale Outwards:
            currentCanvas.triggerWheel(pointer, 120);
            // Scale Inwards:
            currentCanvas.triggerWheel(pointer, -120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(87, 88, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 87, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 88, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(163, 162, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(162, 163, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(161, 161, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle outwards using pinch, then inwards using mousewheel and pinch, then outwards using mousewheel', function () {
            // Scale Outwards 33.3%:
            touches[0].pageX = 75 - 100 / 6;
            touches[0].pageY = 125;
            touches[1].pageX = 175 + 100 / 6;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Scale Inwards 25%:
            currentCanvas.triggerWheel(pointer, -120);
            // Scale Inwards 25% twice:
            touches[0].pageX = 87.5;
            touches[0].pageY = 125;
            touches[1].pageX = 162.5;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Scale Outwards 33.3%:
            currentCanvas.triggerWheel(pointer, 120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(87, 88, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 87, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 88, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(163, 162, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(162, 163, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(161, 161, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
    });

    describe('A mix of translation and rotation', function () {
        var currentCanvas, pointer, touches;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 100,
                y: 100,
                width: 50,
                height: 50
            });
            currentCanvas.render();

            // Initialize pointer:
            pointer = [{
                pageX: 125,
                pageY: 125
            }];
            // Initialize touches:
            touches = [{
                pageX: 100,
                pageY: 125
            }, {
                pageX: 150,
                pageY: 125
            }];
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly translates rectangle up, then rotates clockwise', function () {
            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(pointer);

            // Translate Up:
            pointer[0].pageY -= 50;
            currentCanvas.triggerDrag(pointer);
            // Rotate Clockwise:
            touches[0].pageX = 100;
            touches[0].pageY = 75;
            touches[1].pageX = 150;
            touches[1].pageY = 75;
            currentCanvas.triggerRotate(touches);   // Initiates two touch points for pinch.
            touches[0].pageX = 125;
            touches[0].pageY = 50;
            touches[1].pageX = 125;
            touches[1].pageY = 100;
            currentCanvas.triggerRotate(touches);   // Applies rotation.

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 50, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 49, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 50, helper.Color(0, 255, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 99, helper.Color(255, 0, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly rotates rectangle counter-clockwise, then translates left', function () {
            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(touches);

            // Rotate Counter-Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 150;
            touches[1].pageX = 125;
            touches[1].pageY = 100;
            currentCanvas.triggerRotate(touches);
            // Translate Left:
            currentCanvas.triggerDrag(pointer); // Initiates pan.
            pointer[0].pageX -= 50;
            currentCanvas.triggerDrag(pointer); // Applies translation.

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(49, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(50, 100, helper.Color(255, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(100, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(99, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(99, 149, helper.Color(0, 255, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
    });

    describe('A mix of translation and scale', function () {
        var currentCanvas, pointer, touches;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 75,
                y: 75,
                width: 100,
                height: 100
            });
            currentCanvas.render();

            // Initialize pointer:
            pointer = [{
                pageX: 125,
                pageY: 125
            }];
            // Initialize touches:
            touches = [{
                pageX: 75,
                pageY: 125
            }, {
                pageX: 175,
                pageY: 125
            }];
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly translates rectangle up, then scales inwards using pinch', function () {
            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(pointer);

            // Translate Up:
            pointer[0].pageY -= 50;
            currentCanvas.triggerDrag(pointer);
            // Scale Inward:
            touches[0].pageX = 75;
            touches[0].pageY = 75;
            touches[1].pageX = 175;
            touches[1].pageY = 75;
            currentCanvas.triggerPinch(touches);   // Initiates two touch points for pinch.
            touches[0].pageX = 100;
            touches[0].pageY = 75;
            touches[1].pageX = 150;
            touches[1].pageY = 75;
            currentCanvas.triggerPinch(touches);   // Applies scale.

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 50, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 49, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 50, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 99, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle outwards using pinch, then translates left', function () {
            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(touches);

            // Scale Outward:
            touches[0].pageX = 25;
            touches[0].pageY = 125;
            touches[1].pageX = 225;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Translate Left:
            currentCanvas.triggerDrag(pointer); // Initiates pan.
            pointer[0].pageX -= 20;
            currentCanvas.triggerDrag(pointer); // Applies translation.

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(4, 25, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(5, 24, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(5, 25, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(205, 224, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(204, 225, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(204, 224, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly translates rectangle down, then scales inwards using mousewheel', function () {
            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(pointer);

            // Translate Down:
            pointer[0].pageY += 50;
            currentCanvas.triggerDrag(pointer);
            // Scale Inward:
            currentCanvas.triggerWheel(pointer, -120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(87, 138, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 137, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 138, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(163, 212, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(162, 213, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(161, 211, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle inwards using mousewheel, then translates right', function () {
            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(pointer);

            // Scale Outward:
            currentCanvas.triggerWheel(pointer, 120);
            // Translate Right:
            pointer[0].pageX += 50;
            currentCanvas.triggerDrag(pointer);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(107, 58, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(108, 57, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(109, 59, helper.Color(0, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(242, 191, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(241, 192, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(240, 190, helper.Color(0, 0, 255));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
    });

    describe('A mix of rotation and scale', function () {
        var currentCanvas, pointer, touches;

        beforeEach(function () {
            // Create canvas, and render:
            currentCanvas = helper.Canvas(250, 250);
            currentCanvas.add({
                type: "Rectangle",
                x: 75,
                y: 75,
                width: 100,
                height: 100
            });
            currentCanvas.render();

            // Initialize pointer:
            pointer = [{
                pageX: 125,
                pageY: 125
            }];
            // Initialize touches:
            touches = [{
                pageX: 75,
                pageY: 125
            }, {
                pageX: 175,
                pageY: 125
            }];

            // Trigger a touch event (to start rendering the touch canvas):
            currentCanvas.triggerTouch(touches);
        });
        afterEach(function () {
            currentCanvas.remove();
        });

        it('correctly rotates rectangle clockwise, then scales inwards using pinch', function () {
            // Rotate Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 75;
            touches[1].pageX = 125;
            touches[1].pageY = 175;
            currentCanvas.triggerRotate(touches);
            // Scale Inward:
            touches[0].pageX = 125;
            touches[0].pageY = 100;
            touches[1].pageX = 125;
            touches[1].pageY = 150;
            currentCanvas.triggerPinch(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(99, 100, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 99, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(100, 100, helper.Color(0, 255, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(150, 149, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 150, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(149, 149, helper.Color(255, 0, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle outwards using pinch, then rotates counter-clockwise', function () {
            // Scale Outward:
            touches[0].pageX = 25;
            touches[0].pageY = 125;
            touches[1].pageX = 225;
            touches[1].pageY = 125;
            currentCanvas.triggerPinch(touches);
            // Rotate Counter-Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 225;
            touches[1].pageX = 125;
            touches[1].pageY = 25;
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(24, 25, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(25, 24, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(25, 25, helper.Color(255, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(225, 224, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(224, 225, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(224, 224, helper.Color(0, 255, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly rotates rectangle counter-clockwise, then scales inwards using mousewheel', function () {
            // Rotate Counter-Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 175;
            touches[1].pageX = 125;
            touches[1].pageY = 75;
            currentCanvas.triggerRotate(touches);
            // Scale Inward:
            currentCanvas.triggerWheel(pointer, -120);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(86, 87, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(87, 86, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(88, 88, helper.Color(255, 0, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(163, 162, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(162, 163, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(161, 161, helper.Color(0, 255, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
        it('correctly scales rectangle outwards using mousewheel, then rotates clockwise', function () {
            // Scale Outward:
            currentCanvas.triggerWheel(pointer, 120);
            // Rotate Clockwise:
            touches[0].pageX = 125;
            touches[0].pageY = 75;
            touches[1].pageX = 125;
            touches[1].pageY = 175;
            currentCanvas.triggerRotate(touches);

            // Make sure top-left corner is a black corner:
            currentCanvas.expectTouchPixel(57, 58, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(58, 57, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(59, 59, helper.Color(0, 255, 0));

            // Make sure bottom-right corner is a black corner:
            currentCanvas.expectTouchPixel(192, 191, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(191, 192, helper.Color(0, 0, 0, 0));
            currentCanvas.expectTouchPixel(190, 190, helper.Color(255, 0, 0));

            // Trigger release:
            currentCanvas.triggerRelease(touches);
        });
    });
});