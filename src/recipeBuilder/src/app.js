requirejs.config({
    shim: {
        underscore: {
            exports: '_'
        }
    },
    paths: {
        underscore: '../bower_components/underscore/underscore',
        d3: ['//d3js.org/d3.v3.min', '../lib/d3.v3.min']
    },
    baseUrl: 'src'
});

require(['underscore'], function(_) {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
});