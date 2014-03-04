/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core',
    'scalejs.canvas-touch',
    'jasmine-html'
], function (core) {
    describe('`extension registered`', function () {
        it('core.canvas is defined', function () {
            expect(core.canvas).toBeDefined();
        });

        it('core.canvas.touch is defined', function () {
            expect(core.canvas.touch).toBeDefined();
        });
    });
});