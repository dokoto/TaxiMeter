define(['app', './meter_router'], function (TAXI, FareRouter) {
    'use strict';

    TAXI.module('MeterPModule', function (Fare, TAXI) {
        Fare.Router = FareRouter;

        var API = {
            showFareMeter: function () {
                require(['MeterPModule/fare/meter_fare_controller'], function (FareController) {
                    logger.MSG_DESP('Loading Fare Meter Tool');
                    TAXI.navigate('builds/fare');
                    FareController.show();
                });
            },
            stopFareMeter: function () {
            },
            showRide: function () {
                require(['MeterPModule/ride/meter_ride_controller'], function (RideController) {
                    logger.MSG_DESP('Loading Ride Reporting Tool');
                    TAXI.navigate('builds/ride');
                    RideController.show();
                });
            }

        };

        TAXI.on('meter:fare:show', function () {
            API.showFareMeter();
        });

        TAXI.on('builds:fare:stop', function () {
            API.stopFareMeter();
        });

        TAXI.on('builds:ride:show', function () {
            API.showRide();
        });

        TAXI.addInitializer(function () {
            var router = new Fare.Router({
                controller: API
            });
        });
    });

    return TAXI.FareLModule;
});


