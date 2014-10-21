define(['app' ], function (TAXI) {
    'use strict';

    var MainRouter = Marionette.AppRouter.extend({
        appRoutes: {
            "main": "showMain"
        },
        before: function () {
            console.log('before going to main view');
        }
    });

    return MainRouter;
});


