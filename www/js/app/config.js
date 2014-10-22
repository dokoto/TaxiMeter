requirejs.config({
    paths: {
        backbone: '../vendor/js/backbone-min',
        marionette: '../vendor/js/backbone.marionette.min',
        underscore: '../vendor/js/underscore-min',
        bootstrap: '../vendor/js/bootstrap.min',
        text: '../vendor/js/text',
        tpl: '../vendor/js/underscore-tpl',
        jquery: '../vendor/js/jquery',
        linq: '../vendor/js/jslinq.min'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        marionette: {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        bootstrap: {
            deps: ['jquery']
        },
        tpl: ['text']
    },
    packages: [{
            name: 'MainPModule',
            location: 'modules/main',
            main: 'main_app'
        }, {
            name: 'MeterPModule',
            location: 'modules/meter',
            main: 'meter_app'
        }]
});


var updateModuleProgress = function (context, map, depMaps) {
    var console = window.console;
    if (console && console.log) {
        logger.MSG_DESP('[LOAD PHASE]  ' + map.name + ' at ' + map.url);
    }
};


requirejs.onResourceLoad = function (context, map, depMaps) {
    updateModuleProgress(context, map, depMaps);
};


define(['app'], function (TAXI) {
    'use strict';
    
    //document.addEventListener('deviceready', function() {
        logger.MSG_DESP('Device ready to start');
        TAXI.start();
    //});
});




