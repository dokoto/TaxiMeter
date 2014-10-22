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
                    var windowHeight = window.innerHeight;
                    var buttonsHeight = $('.btn-default').height();
                    var buttonFontSize = $('.btn-default').css('font-size');
                    buttonFontSize = parseInt( buttonFontSize.substr(0, buttonFontSize.length - 2) );                    
                    
                    $('.btn-default').css({
                        'padding-top': (buttonsHeight / 2) - (buttonFontSize / 2),
                        'margin-top' : (windowHeight/2) - (buttonsHeight/2)
                    });
                };
                var updateFare = function() {
                    var fare = parseFloat( $('.display-fare').attr('data-fare') );
                    fare += 0.2;
                    $('.display-fare').attr('data-fare', fare);
                    $('.display-fare').text(fare.toFixed(2) + ' £');
                };
                
                Fare.timmer = 0;
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
                            "click .btn-default": "handleMater"
                        },
                        onRender: function () {
                            this.display.show(createDisplay());
                            this.controls.show(createControls());
                        },
                        handleMater: function (event)
                        {
                            event.preventDefault();
                            var status = $('.btn-default').attr('data-status');
                            if (status === 'start') {
                                $('.btn-default').text('STOP');
                                $('.btn-default').attr('data-status', 'stop');
                                $('.btn-default').addClass('active');
                                window.clearInterval(Fare.timmer);
                                Fare.timmer = window.setInterval(updateFare, 300);
                            }
                            else if (status === 'stop') {
                                window.clearInterval(Fare.timmer);
                                $('.display-fare').text('0.00 £');
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
