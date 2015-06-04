var HelloWorld = (function () {
    function HelloWorld() {
    }
    HelloWorld.prototype.welcome = function () {
        console.log('[HelloWorld] Hello World!');
    };
    return HelloWorld;
})();
