define(['app', 'bootstrap', 'underscore',
    'tpl!modules/meter/fare/templates/meter_fare_controls_template.html',
    'tpl!modules/meter/fare/templates/meter_fare_display_template.html',
    'tpl!modules/meter/fare/templates/meter_fare_layout_template.html',
    'models/fares'],
        function (TAXI, bootstrap, _, ControlsTemplate, DisplayTemplate, LayoutTemplate) {
            'use strict';

            TAXI.module('Meter.Fare', function (Fare, TAXI, Backbone, Marionette) {

                var createDisplay = function () {
                    var ItemViewDisplay = Marionette.ItemView.extend({
                        template: DisplayTemplate,
                        tagName: 'div',
                        id: 'meter-display-section',
                        className: 'row row-display'
                    });
                    return new ItemViewDisplay();
                };

                var createControls = function () {
                    var constrolsModel = new Backbone.Model({label: 'START'});
                    var ItemViewConstrols = Marionette.ItemView.extend({
                        template: ControlsTemplate,
                        tagName: 'div',
                        id: 'meter-constrols-section',
                        className: 'row row-controls'
                    });
                    return new ItemViewConstrols({model: constrolsModel});
                };

                var adaptLayoutStyleContent = function () {
                    $('.btn-success').hide();
                    var windowHeight = window.innerHeight;
                    var buttonsHeight = $('.btn-default').height();
                    var buttonFontSize = $('.btn-default').css('font-size');
                    buttonFontSize = parseInt(buttonFontSize.substr(0, buttonFontSize.length - 2));

                    $('.btn-default').css({
                        'padding-top': (buttonsHeight / 2) - (buttonFontSize / 2),
                        'margin-top': (windowHeight / 2) - (buttonsHeight / 2)
                    });
                };

                var getMinutesBetweenDates = function (startDate, endDate) {
                    var diff = endDate.getTime() - startDate.getTime();
                    return (diff / 60000);
                };

                var calcFareFor = function (tariff, minutes) {
                    if (minutes < 12)
                    {
                        return tariff['12'] / (12 * 60);
                    }
                    else if (minutes < 15)
                    {
                        return tariff['15'] / (15 * 60);
                    }
                    else if (minutes < 30)
                    {
                        return tariff['30'] / (30 * 60);
                    }
                    else if (minutes < 40)
                    {
                        return tariff['40'] / (40 * 60);
                    }
                };

                var calcFare = function (faresRaw) {
                    var now = new Date();
                    var isWeekEnd = now.getUTCDay() === 0 || now.getUTCDay() === 6;
                    var initMoment = new Date(Fare.beginAt.getFullYear(), (Fare.beginAt.getMonth() + 1), Fare.beginAt.getDate(), Fare.beginAt.getHours(), Fare.beginAt.getMinutes(), Fare.beginAt.getSeconds(), Fare.beginAt.getMilliseconds());
                    var thisMoment = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

                    var t1_from = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), faresRaw[0].from.split(':')[0], faresRaw[0].from.split(':')[1], '00', '000');
                    var t1_to = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), faresRaw[0].to.split(':')[0], faresRaw[0].to.split(':')[1], '00', '000');

                    var t2_from = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), faresRaw[1].from.split(':')[0], faresRaw[1].from.split(':')[1], '00', '000');
                    var t2_to = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), faresRaw[1].to.split(':')[0], faresRaw[1].to.split(':')[1], '00', '000');

                    var t2B_from = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), faresRaw[2].from.split(':')[0], faresRaw[2].from.split(':')[1], '00', '000');
                    var t2B_to = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), faresRaw[2].to.split(':')[0], faresRaw[2].to.split(':')[1], '00', '000');

                    var t3_from = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), faresRaw[3].from.split(':')[0], faresRaw[3].from.split(':')[1], '00', '000');
                    var t3_to = new Date(now.getFullYear(), (now.getMonth() + 1), now.getDate(), faresRaw[3].to.split(':')[0], faresRaw[3].to.split(':')[1], '00', '000');

                    var minutes = getMinutesBetweenDates(initMoment, thisMoment);

                    if (thisMoment >= t1_from && thisMoment <= t1_to)
                    {
                        if (isWeekEnd)
                        {
                            return calcFareFor(Fare.fares[2], minutes);
                        }
                        else
                        {
                            return calcFareFor(Fare.fares[0], minutes);
                        }
                    }
                    else if (thisMoment >= t2_from && thisMoment <= t2_to)
                    {
                        if (isWeekEnd)
                        {
                            return calcFareFor(Fare.fares[2], minutes);
                        }
                        else
                        {
                            return calcFareFor(Fare.fares[1], minutes);
                        }
                    } else if (thisMoment >= t3_from && thisMoment <= t3_to)
                    {
                        return calcFareFor(Fare.fares[3], minutes);
                    }

                };

                var updateFare = function () {
                    var fare = parseFloat($('.display-fare').attr('data-fare'));
                    fare += calcFare(Fare.fares);
                    $('.display-fare').attr('data-fare', fare);
                    $('.display-fare').text(fare.toFixed(3) + ' £');
                    navigator.geolocation.getCurrentPosition(function (position) {
                        Fare.coords.push({'timestamp': Date.now(), 'latitude': position.coords.latitude,
                            'longitude': position.coords.longitude});
                    },
                            function (error) {
                                logger.MSG_DESP(error.message);
                            }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
                };

                Fare.timmer = 0;
                Fare.fares = {};
                Fare.beginAt = 0;
                Fare.coords = [];
                Fare.show = function () {
                    var LayoutView = Marionette.LayoutView.extend({
                        template: LayoutTemplate,
                        tagName: 'div',
                        id: 'fareMeter',
                        initialize: function (options) {
                            logger.MSG_DESP('Building Meter.Fare layout');
                        },
                        destroy: function () {
                            logger.MSG_DESP('Destroying Meter.Fare layout');
                        },
                        regions: {
                            display: "#display",
                            controls: "#controls"
                        },
                        events: {
                            "click .btn-default": "handleMater",
                            "click .btn-success": "gotoRide"
                        },
                        onRender: function () {
                            this.display.show(createDisplay());
                            this.controls.show(createControls());
                        },
                        gotoRide: function (event) {
                            event.preventDefault();
                            /*
                             var coords = [{'timestamp': '1203', 'latitude': '267.23', 'longitude': '23.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'},
                             {'timestamp': '1233', 'latitude': '27.23', 'longitude': '93.4'}];
                             
                             TAXI.trigger('meter:ride:show', coords);
                             */
                            TAXI.trigger('meter:ride:show', Fare.coords);
                        },
                        handleMater: function (event)
                        {
                            event.preventDefault();
                            var status = $('.btn-default').attr('data-status');
                            if (status === 'start') {
                                $('.display-fare').text('0.000 £');
                                $('.display-fare').attr('data-fare', '0.000');
                                $('.btn-default').text('STOP');
                                $('.btn-default').attr('data-status', 'stop');
                                $('.btn-default').addClass('active');
                                window.clearInterval(Fare.timmer);
                                var fareQuery = TAXI.request('models:fares:raw');
                                $.when(fareQuery).done(function (faresRaw) {
                                    Fare.fares = faresRaw;
                                    Fare.beginAt = new Date();
                                    Fare.timmer = window.setInterval(updateFare, 1000);
                                }).fail(function (error) {
                                    logger.ERROR_DESP(error);
                                });
                            }
                            else if (status === 'stop') {
                                window.clearInterval(Fare.timmer);
                                $('.btn-success').toggle();
                                var fare = parseFloat($('.display-fare').attr('data-fare'));
                                if (fare < 2.400)
                                {
                                    $('.display-fare').attr('data-fare', '2.400');
                                    $('.display-fare').text('2.400 £');
                                }
                                $('.btn-default').text('START');
                                $('.btn-default').attr('data-status', 'start');
                                $('.btn-default').removeClass('active');
                            }
                        }
                    });
                    var layoutView = new LayoutView();
                    TAXI.containerRegion.show(layoutView);
                    adaptLayoutStyleContent();
                };


            });

            return TAXI.Meter.Fare;

        });
