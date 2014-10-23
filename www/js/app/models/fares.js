define(['app'], function (TAXI) {
    'use strict';

    TAXI.module('Models', function (Models, TAXI, Backbone, Marionette, $, _) {
        var API = {
            getFareModel: function ()
            {
                return Backbone.Model.extend({
                    defaults: {
                        "type": "",
                        "from": "",
                        "to": "",
                        "12": 0.00,
                        "15": 0.00,
                        "30": 0.00,
                        "40": 0.00
                    }});
            },
            getFares: function () {
                var deferred = $.Deferred();
                var files = new getFileModel();
                files.url = 'assets/data/londonTaxiFares.json';
                files.fetch({
                    reset: true,
                    success: function () {
                        deferred.resolve(files);
                    },
                    error: function () {
                        var errorTxt = "[models.files] Couldn't fetch datas from Url : " + this.url;
                        logger.ERROR_H3(errorTxt);
                        deferred.reject(errorTxt);
                    }
                });
                return deferred.promise();
            },
            getRawFares: function () {
                var deferred = $.Deferred();
                $.getJSON('assets/data/londonTaxiFares.json', function (data) {
                    deferred.resolve(data);
                }).fail(function () {
                    var errorTxt = "[models.files] Couldn't fetch datas from Url : " + this.url;
                    logger.ERROR_H3(errorTxt);
                    deferred.reject(errorTxt);
                });
                return deferred.promise();
            }
        };

        TAXI.reqres.setHandler('models:fares:asModel', function () {
            return API.getFares();
        });

        TAXI.reqres.setHandler('models:fares:raw', function () {
            return API.getRawFares();
        });
    });
});





