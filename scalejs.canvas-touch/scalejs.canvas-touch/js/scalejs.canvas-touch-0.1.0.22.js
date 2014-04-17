/*global define*/
/*jslint browser: true */
define('scalejs.canvas-touch/canvas-touch',[
    //'scalejs!core',
    'hammer'
], function (
    //core,
    hammer
) {
    

    return function (
        options
    ) {
        var // Get options:
            // External canvas, which holds image to pinch&zoom. NOTE: This extension REQUIRES a canvas with position=absolute, top=0, left=0, and a constant valid parentNode:
            canvasElement = options.canvas,
            // Callback used to force the external canvas to render, with a given transform. Calls with parameters: (top, left, rotate, scale):
            renderCallback = options.renderCallback,
            // (Optional) Callback used to return the start transform when something is touching the screen. Calls with parameters: (left, top, rotate, scale)
            startCallback = options.startCallback || function () { return; },
            // (Optional) Callback used to return the transform updates when something is touching the screen. Calls with parameters: (left, top, rotate, scale)
            stepCallback = options.stepCallback || function () { return; },
            // (Optional) Callback used to return the final transform when nothing is touching the screen. Calls with parameters: (left, top, rotate, scale)
            endCallback = options.endCallback || function () { return; },
            // (Optional) Parameter to disable rotate:
            enableRotate = options.enableRotate !== undefined ? options.enableRotate : true,
            // Initialize variables:
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
            lastCenter,
            touchInProgress = false;

        function parseCallback(transform) {
            if (Object.prototype.toString.call(transform) === "[object Object]") {
                leftVal = transform.left;
                topVal = transform.top;
                rotateVal = transform.rotate;
                scaleVal = transform.scale;
            }
        }

        function setRotateState(state) {
            if (Object.prototype.toString.call(state) === "[object Boolean]") {
                enableRotate = state;
            }
        }

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

        // Function to resize pinch&zoom canvas to the dimensions of the external canvas:
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
                rotateDiff = 0, // Initial value, useful for if disableScale is true.
                pagePos,
                elementPos,
                groupPos,
                rotatePos,
                scalePos,
                transPos,
                sin = 0,    // Initial value, useful for if disableScale is true.
                cos = 1,    // Initial value, useful for if disableScale is true.
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
                // Set variable to know touch is in progress:
                touchInProgress = true;
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

                // Callback for onStart event:
                parseCallback(startCallback(leftVal, topVal, rotateVal, scaleVal));

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
                // Render external canvas to off-screen buffer:
                contextRender.clearRect(0, 0, canvasWidth, canvasHeight);
                contextRender.drawImage(canvasElement, 0, 0);
            } else if (event.type === "release") {
                // Set variable to know touch is not in progress:
                touchInProgress = false;
                // Reset all last* variables, and update fabric canvas to get crisper image:
                lastTouches = undefined;
                lastCenter = undefined;

                // Callback for onStep event:
                parseCallback(endCallback(leftVal, topVal, rotateVal, scaleVal));

                // Set external canvas visualization's pinch&zoom settings, and render:
                renderCallback(leftVal, topVal, rotateVal, scaleVal);
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
                        lastCenter = undefined; // Prevent action when adding finger.
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
                    // Apply Scale:
                    scaleVal *= scaleDiff;

                    if (enableRotate) {
                        // Calculate Rotation:
                        rotateDiff = Math.atan2(lastTouches[0].pageX - lastCenter.x, lastTouches[0].pageY - lastCenter.y) - Math.atan2(touches[0].pageX - center.x, touches[0].pageY - center.y);
                        // Get sin and cos of angle in radians (for later):
                        sin = Math.sin(rotateDiff);
                        cos = Math.cos(rotateDiff);
                        // Convert to degrees for fabric:
                        rotateDiff *= 180 / Math.PI;
                        // Apply Rotation:
                        rotateVal += rotateDiff;
                    }

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

                    // Translate deltaDistance in center position:
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

                // Callback for onStep event:
                parseCallback(stepCallback(leftVal, topVal, rotateVal, scaleVal));

                lastTouches = touches;
                lastCenter = center;
            }
        }

        // Function to handle mousewheel events (zoom):
        function mousewheelHandler(event) {
            // create some hammerisch eventData
            var touches = hammer.event.getTouchList(event, 'scroll'),
                delta = event.wheelDelta,
                gesture = {
                    preventDefault: function () { return; },
                    touches: [{
                        pageX: touches[0].pageX + 100,
                        pageY: touches[0].pageY
                    }, {
                        pageX: touches[0].pageX - 100,
                        pageY: touches[0].pageY
                    }]
                },
                backupTouches,
                backupCenter;

            // Calculate scale:
            if (delta > 0) {
                delta = 100 / 3;    // Scale up 33%
            } else if (delta < 0) {
                delta = -25;        // Scale down 25%
            } else {
                delta = 0;          // Invalid, or zero delta.
            }

            if (touchInProgress) {
                // Backup last* variables:
                backupTouches = lastTouches;
                backupCenter = lastCenter;

                // Setup center and touches for event:
                lastTouches = [{
                    pageX: touches[0].pageX + 100,
                    pageY: touches[0].pageY
                }, {
                    pageX: touches[0].pageX - 100,
                    pageY: touches[0].pageY
                }];
                lastCenter = {
                    x: touches[0].pageX,
                    y: touches[0].pageY
                };

                // Simulate pinch:
                gesture.touches[0].pageX += delta;
                gesture.touches[1].pageX -= delta;
                hammerObj.trigger("pinch", gesture);

                // Restore last* variables:
                lastTouches = backupTouches;
                lastCenter = backupCenter;
            } else {
                // Simulate starting touch:
                hammerObj.trigger("touch", gesture);

                // Simulate pinch:
                gesture.touches[0].pageX += delta;
                gesture.touches[1].pageX -= delta;
                hammerObj.trigger("pinch", gesture);

                // Simulate release:
                hammerObj.trigger("release", gesture);
            }

            // prevent scrolling
            event.preventDefault();
        }

        // Subscribe to touch events:
        //hammer.plugins.showTouches();
        hammer.plugins.fakeMultitouch();

        hammerObj = hammer(canvasParent, {
            prevent_default: true
        });
        hammerObj.on("touch drag swipe pinch rotate transform release", touchHandler);
        hammerObj.on("mousewheel", mousewheelHandler);

        // Function to remove canvas-touch from canvas:
        function remove() {
            hammerObj.off("touch drag swipe pinch rotate transform release", touchHandler);
            hammerObj.off("mousewheel", mousewheelHandler);
            hammerObj.enable(false);
            canvasParent.removeChild(canvasShow);
        }

        // Return object that can be used to change the canvas-touch instance:
        return {
            hammerObj: hammerObj,   // Used for testing purposes.
            setRotateState: setRotateState,
            remove: remove
        };
    };
});


/*global define*/
define('scalejs.canvas-touch',[
    'scalejs!core',
    './scalejs.canvas-touch/canvas-touch'
], function (
    core,
    canvastouch
) {
    

    // There are few ways you can register an extension.
    // 1. Core and Sandbox are extended in the same way:
    //      core.registerExtension({ part1: part1 });
    //
    // 2. Core and Sandbox are extended differently:
    //      core.registerExtension({
    //          core: {corePart: corePart},
    //          sandbox: {sandboxPart: sandboxPart}
    //      });
    //
    // 3. Core and Sandbox are extended dynamically:
    //      core.registerExtension({
    //          buildCore: buildCore,
    //          buildSandbox: buildSandbox
    //      });
    core.registerExtension({
        canvas: {
            touch: canvastouch
        }
    });
});


