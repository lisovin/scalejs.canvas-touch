/*global define*/
define('scalejs.canvas-touch/part1',[
    'scalejs!core'
], function (
    core
) {
    

    function function1() {
        core.debug('main.function1 is called');
    }

    return {
        function1: function1
    };
});


/*global define*/
define('scalejs.canvas-touch',[
    'scalejs!core',
    './scalejs.canvas-touch/part1'
], function (
    core,
    part1
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
        part1: part1
    });
});


