/*global define*/
/*jslint browser: true */
define([
    //'scalejs!core',
    'hammer'
], function (
    //core,
    hammer
) {
    'use strict';

    return function (
        canvasElement,  // External canvas, which holds image to pinch&zoom. NOTE: This extension REQUIRES a canvas with position=absolute, top=0, left=0, and a constant valid parentNode.
        renderCallback, // Callback used to force the external canvas to render, with a given transform. Calls with parameters: (top, left, rotate, scale)
        endCallback     // Callback used to return the final transform when nothing is touching the screen. Calls with parameters: (top, left, rotate, scale)
    ) {
        var // Initialize variables:
            canvasStyle = window.getComputedStyle(canvasElement),
            canvasWidth = Math.max(parseInt(canvasStyle.width, 10), 1),
            canvasHeight = Math.max(parseInt(canvasStyle.height, 10), 1),
            canvasParent = canvasElement.parentNode,
            canvasRender,
            contextRender,
            canvasShow,
            contextShow,
            hammerObj,
            leftVal = 0,
            topVal = 0,
            rotateVal = 0,
            scaleVal = 1,
            lastTouches,
            lastCenter;

        // Create off-screen buffer canvas:
        canvasRender = document.createElement("canvas");
        canvasRender.width = canvasWidth;
        canvasRender.height = canvasHeight;
        contextRender = canvasRender.getContext('2d');
        // Create zoom canvas:
        canvasShow = document.createElement("canvas");
        canvasShow.style.position = "absolute";
        canvasShow.style.left = 0;
        canvasShow.style.top = 0;
        canvasShow.style.display = "none";
        canvasShow.style.width = canvasWidth;
        canvasShow.style.height = canvasHeight;
        canvasShow.setAttribute("width", canvasWidth);
        canvasShow.setAttribute("height", canvasHeight);
        contextShow = canvasShow.getContext('2d');
        canvasParent.appendChild(canvasShow);

        function resizeCanvas() {
            // Get external canvas size:
            canvasStyle = window.getComputedStyle(canvasElement);
            canvasWidth = Math.max(parseInt(canvasStyle.width, 10), 1);
            canvasHeight = Math.max(parseInt(canvasStyle.height, 10), 1);

            // Resize off-screen buffer:
            canvasRender.width = canvasWidth;
            canvasRender.height = canvasHeight;

            // Resize pinch&zoom canvas:
            canvasShow.style.width = canvasWidth;
            canvasShow.style.height = canvasHeight;
            canvasShow.setAttribute("width", canvasWidth);
            canvasShow.setAttribute("height", canvasHeight);
        }

        // Function to handle touch events (for pinch and zoom):
        function touchHandler(event) {
            //console.log(event);
            if (!event.gesture) {
                return;
            }
            event.gesture.preventDefault();

            var gesture = event.gesture,
                touches = [],
                center,
                scaleDiff,
                rotateDiff,
                pagePos,
                elementPos,
                groupPos,
                rotatePos,
                scalePos,
                transPos,
                sin,
                cos,
                i;

            // Convert touches to an array (to avoid safari's reuse of touch objects):
            for (i = 0; i < gesture.touches.length; i += 1) {
                touches[i] = {
                    pageX: gesture.touches[i].pageX,
                    pageY: gesture.touches[i].pageY
                };
            }

            function distance(p1, p2) { // Get distance between two points:
                var x = p1.pageX - p2.pageX,
                    y = p1.pageY - p2.pageY;
                return Math.sqrt(x * x + y * y);
            }

            if (event.type === "touch") {
                // Set all last* variables to starting gesture:
                lastTouches = touches;
                // Calculate Center:
                if (touches.length === 2) {
                    lastCenter = {
                        x: (touches[0].pageX - touches[1].pageX) / 2 + touches[1].pageX,
                        y: (touches[0].pageY - touches[1].pageY) / 2 + touches[1].pageY
                    };
                } else {
                    lastCenter = {
                        x: touches[0].pageX,
                        y: touches[0].pageY
                    };
                }

                // Update width and height of pinch&zoom canvas, and off-screen buffer:
                resizeCanvas();

                // Render external canvas to pinch&zoom canvas:
                contextShow.setTransform(1, 0, 0, 1, 0, 0);
                contextShow.clearRect(0, 0, canvasWidth, canvasHeight);
                contextShow.drawImage(canvasElement, 0, 0);
                // Show pinch&zoom canvas:
                canvasShow.style.display = "";
                // Hide external canvas:
                canvasElement.style.display = "none";
                // Reset external canvas visualization to default pinch&zoom settings, and render:
                renderCallback(0, 0, 0, 1);
                /*canvas.select("group")
                    .attr("scaleX", 1)//scaleVal
                    .attr("scaleY", 1)//scaleVal
                    .attr("angle", 0)//rotateVal
                    .attr("left", 0)//leftVal
                    .attr("top", 0);//topVal
                canvas.pumpRender();*/
                // Render external canvas to off-screen buffer:
                contextRender.clearRect(0, 0, canvasWidth, canvasHeight);
                contextRender.drawImage(canvasElement, 0, 0);
            } else if (event.type === "release") {
                // Reset all last* variables, and update fabric canvas to get crisper image:
                //lastEvent = undefined;
                //lastGesture = undefined;
                lastTouches = undefined;
                lastCenter = undefined;

                // Set external canvas visualization's pinch&zoom settings, and render:
                endCallback(leftVal, topVal, rotateVal, scaleVal);
                /*canvas.select("group")
                    .attr("scaleX", scaleVal)
                    .attr("scaleY", scaleVal)
                    .attr("angle", rotateVal)
                    .attr("left", leftVal)
                    .attr("top", topVal);
                canvas.pumpRender();*/
                // Show external canvas:
                canvasElement.style.display = "";
                // Hide pinch&zoom canvas:
                canvasShow.style.display = "none";
            } else {
                // Last action was a release, so fix lastTouches:
                if (lastTouches === undefined) {
                    lastTouches = touches;
                }
                if (touches.length === 1) {
                    // Starting action, so reset lastTouches:
                    if (lastTouches.length !== 1) {
                        lastTouches = touches;
                        lastCenter = undefined; // Prevent rotating when removing finger.
                    }

                    // Calculate Center:
                    center = {
                        x: touches[0].pageX,
                        y: touches[0].pageY
                    };

                    // Translate:
                    leftVal += touches[0].pageX - lastTouches[0].pageX;
                    topVal += touches[0].pageY - lastTouches[0].pageY;
                } else if (touches.length === 2) {
                    // Starting action, so reset lastTouches:
                    if (lastTouches.length !== 2) {
                        lastTouches = touches;
                        lastCenter = undefined; // Prevent rotating when adding finger.
                    }

                    // Calculate Center:
                    center = {
                        x: (touches[0].pageX - touches[1].pageX) / 2 + touches[1].pageX,
                        y: (touches[0].pageY - touches[1].pageY) / 2 + touches[1].pageY
                    };
                    if (lastCenter === undefined) {
                        lastCenter = center;
                    }

                    // Calculate Scale:
                    scaleDiff = distance(touches[0], touches[1]) / distance(lastTouches[0], lastTouches[1]);

                    // Calculate Rotation:
                    rotateDiff = Math.atan2(lastTouches[0].pageX - lastCenter.x, lastTouches[0].pageY - lastCenter.y) - Math.atan2(touches[0].pageX - center.x, touches[0].pageY - center.y);
                    // Get sin and cos of angle in radians (for later):
                    sin = Math.sin(rotateDiff);
                    cos = Math.cos(rotateDiff);
                    // Convert to degrees for fabric:
                    rotateDiff *= 180 / Math.PI;

                    // Apply Scale:
                    scaleVal *= scaleDiff;

                    // Apply Rotation:
                    rotateVal += rotateDiff;

                    // Get canvas position:
                    pagePos = event.currentTarget.getBoundingClientRect();
                    // Convert page coords to canvas coords:
                    elementPos = {
                        pageX: center.x,
                        pageY: center.y
                    };
                    elementPos.pageX -= pagePos.left;
                    elementPos.pageY -= pagePos.top;

                    // Get difference between center position and group:
                    groupPos = {
                        x: leftVal - elementPos.pageX,
                        y: topVal - elementPos.pageY
                    };

                    // Rotate around point:
                    rotatePos = {
                        x: groupPos.x * cos - groupPos.y * sin + elementPos.pageX,
                        y: groupPos.x * sin + groupPos.y * cos + elementPos.pageY
                    };

                    // Scale relative to center point:
                    scalePos = {
                        x: scaleDiff * (rotatePos.x - elementPos.pageX) + elementPos.pageX - leftVal,
                        y: scaleDiff * (rotatePos.y - elementPos.pageY) + elementPos.pageY - topVal
                    };

                    // Translate delta in center position:
                    transPos = {
                        x: scalePos.x + (center.x - lastCenter.x),
                        y: scalePos.y + (center.y - lastCenter.y)
                    };

                    // Apply Translate:
                    leftVal += transPos.x;
                    topVal += transPos.y;
                }

                // Set pinch&zoom canvas's pinch&zoom settings, and render:
                contextShow.setTransform(1, 0, 0, 1, 0, 0);
                contextShow.clearRect(0, 0, canvasWidth, canvasHeight);
                contextShow.translate(leftVal, topVal);
                contextShow.scale(scaleVal, scaleVal);
                contextShow.rotate(rotateVal / 180 * Math.PI);
                contextShow.translate(-leftVal, -topVal);
                contextShow.drawImage(canvasRender, leftVal, topVal);
                contextShow.setTransform(1, 0, 0, 1, 0, 0);

                //lastEvent = event;
                //lastGesture = gesture;
                lastTouches = touches;
                lastCenter = center;
            }
        }

        // Subscribe to touch events:
        hammer.plugins.showTouches();
        hammer.plugins.fakeMultitouch();

        hammerObj = hammer(canvasParent, {
            prevent_default: true
        });
        hammerObj.on("touch drag swipe pinch rotate transform release", touchHandler);

        // Function to get current transform:
        function getTransform() {
            return {
                left: leftVal,
                top: topVal,
                rotate: rotateVal,
                scale: scaleVal
            };
        }
        // Function to set new transform:
        function setTransform(top, left, rotate, scale) {
            topVal = top;
            leftVal = left;
            rotateVal = rotate;
            scaleVal = scale;
        }
        // Function to reset the transform to initial values:
        function resetTransform() {
            leftVal = 0;
            topVal = 0;
            rotateVal = 0;
            scaleVal = 1;
        }

        // Expose functions:
        return {
            getTransform: getTransform,
            setTransform: setTransform,
            resetTransform: resetTransform
        };
    };
});

