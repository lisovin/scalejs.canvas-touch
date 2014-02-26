/*global require*/
require([
    'scalejs!core',
    'scalejs.canvas-touch'
], function (
    core
) {
    'use strict';

    window.canvas = {
        touch: core.canvas.touch
    };
});
