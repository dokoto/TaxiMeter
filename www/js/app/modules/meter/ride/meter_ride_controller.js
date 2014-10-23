define(['app', 'modules/meter/ride/meter_ride_view'], function (TAXI, RideView) {
    'use strict';

    TAXI.module('Meter.Ride', function (Ride, TAXI, Backbone, Marionette) {
        var RideController = Marionette.Controller.extend({
            show: function (coors) {                 
                Ride.show(coors);          
            }
        });

        Ride.Controller = new RideController();
    });

    return TAXI.Meter.Ride.Controller;
});


