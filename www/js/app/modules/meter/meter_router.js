define(['app' ], function (TAXI) {
    'use strict';

    var MeterRouter = Marionette.AppRouter.extend({
        appRoutes: {
            "meter/fare/init": "initFareMeter",
            "meter/fare/stop": "stopFareMeter",
            "meter/ride/show": "showRide"
        },
        before: function () {
            logger.MSG_DESP('before going to build sections view');
        }
    });

    return MeterRouter;
});

