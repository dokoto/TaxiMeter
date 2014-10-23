define(['app', 'bootstrap', 'underscore',
    'text!modules/meter/ride/templates/meter_ride_row_template.html',
    'tpl!modules/meter/ride/templates/meter_ride_back_template.html',
    'tpl!modules/meter/ride/templates/meter_ride_layout_template.html'],
        function (TAXI, bootstrap, _, rowTemplate, backTemplate, layoutTemplate) {
            'use strict';

            TAXI.module('Meter.Ride', function (Ride, TAXI, Backbone, Marionette) {
                var createBack = function() {
                    var ItemView = Marionette.ItemView.extend({
                        template: backTemplate,
                        tagName: 'div'
                    });
                    return  new ItemView();  
                };
                
                var createRideCollection = function (coords) {
                    var model = Backbone.Model.extend({
                        defaults: {
                            timestamp: "",
                            latitude: "",
                            longitude: ""
                        }
                    });

                    var ItemView = Marionette.ItemView.extend({
                        template: function (serialized_model) {
                            var timestamp = serialized_model.timestamp;
                            var latitude = serialized_model.latitude;
                            var longitude = serialized_model.longitude;
                            return _.template(rowTemplate)({
                                timestamp: timestamp,
                                latitude: latitude,
                                longitude: longitude
                            });
                        },
                        tagName: 'div',
                        className: 'col-md-12 text-center'
                    });
                    
                    var CollectionView = Marionette.CollectionView.extend({
                        childView: ItemView,
                        tagName: 'div',
                        id: 'rideSection',
                        className: 'row'
                    });

                    var SubCollection = Backbone.Collection.extend({
                        model: model
                    });

                    var subCollection = new SubCollection();
                    var collectionView = new CollectionView({collection: subCollection});
                    subCollection.add(coords);

                    return collectionView;
                };

                Ride.show = function (coords) {
                    var LayoutView = Marionette.LayoutView.extend({
                        template: layoutTemplate,
                        tagName: 'div',
                        id: 'rideReport',
                        initialize: function (options) {
                            logger.MSG_DESP('Building Meter.Ride layout');
                        },
                        destroy: function () {
                            logger.MSG_DESP('Destroying Meter.Ride layout');
                        },
                        regions: {
                            list: "#list",
                            controls: "#controls"
                        },
                        events: {
                            "click .btn-back": "gotoMeter"
                        },
                        onRender: function () {
                            this.list.show(createRideCollection(coords));
                            this.controls.show(createBack());
                        },
                        gotoMeter: function()
                        {
                            TAXI.trigger('meter:fare:show');
                        }
                    });
                    
                    var layoutView = new LayoutView();
                    TAXI.containerRegion.show(layoutView);
                };
            });
            
            return TAXI.Meter.Ride;
        });


