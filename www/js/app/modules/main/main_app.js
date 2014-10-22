define(['app', './main_router'], function (TAXI, MainRouter) {
    'use strict';

    TAXI.module('MainLModule', function (Main, OPV_CP) {
        Main.Router = MainRouter;

        var API = {
            showMain: function () {
                require(['MeterPModule'], function () {
                    logger.MSG_DESP('Loading TaxiMeter');
                    OPV_CP.navigate('main');
                    OPV_CP.trigger('meter:fare:show');
                });
            }
        };

        TAXI.on('main:show', function () {
            API.showMain();
        });

        TAXI.addInitializer(function () {
            var router = new Main.Router({
                controller: API
            });
        });
    });

    return TAXI.MainLModule;
});


