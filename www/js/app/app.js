define(['marionette', 'backbone', './app_router'], function (Marionette, Backbone, AppRouter) {
    'use strict';

    var TAXI = new Marionette.Application();
    TAXI.Router = AppRouter;

    TAXI.on('start', function () {
        logger.APP_TITLE('Livware - Test - TaxiMeter');

        if (Backbone.history) {
            require(['MainPModule'], function () {
                Backbone.history.start();
                TAXI.trigger('main:show');
            });
        }

    });

    TAXI.addInitializer(function () {
        var router = new TAXI.Router({
            controller: API
        });
    });

    TAXI.navigate = function (route, options) {
        if (!options) {
            options = {};
        }
        $('div[data-role="page"]').attr('id', (route.indexOf('/') !== -1) ? route.split('/')[1] : route);
        Backbone.history.navigate(route, options);
    };

    TAXI.getCurrentRoute = function () {
        return Backbone.history.fragment;
    };

    var API = {
        initialize: function () {
            logger.MSG_DESP('TAXI-Test for Livware initialized');
        }
    };

    return TAXI;

});

