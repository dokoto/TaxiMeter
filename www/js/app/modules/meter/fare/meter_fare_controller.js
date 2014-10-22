define(['app', 'modules/meter/fare/meter_fare_view'], function (TAXI, FareView) {
    'use strict';

    TAXI.module('Meter.Fare', function (Fare, TAXI, Backbone, Marionette) {
        var FareController = Marionette.Controller.extend({
            show: function () {    
                Fare.show();          
            }
        });

        Fare.Controller = new FareController();
    });

    return TAXI.Meter.Fare.Controller;
});


