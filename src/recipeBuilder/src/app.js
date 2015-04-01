requirejs.config({
    shim: {
        underscore: {
            exports: '_'
        }
    },
    paths: {
        underscore: '../bower_components/underscore/underscore'
    },
    baseUrl: 'src'
});

require(['underscore'], function(_) {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
})