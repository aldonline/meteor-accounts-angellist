(function () {
    Meteor.loginWithAngelList = function (options, callback) {
        // support both (options, callback) and (callback).
        if (!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        var config = Accounts.loginServiceConfiguration.findOne({service: 'angelList'});
        if (!config) {
            callback && callback(new Accounts.ConfigError("Service not configured"));
            return;
        }

        var state = Meteor.uuid();
        // XXX need to support configuring access_type and scope
        var loginUrl =
            'https://angel.co/api/oauth/authorize' +
                '?client_id=' + config.clientId +
                // '&redirect_uri=' + Meteor.absoluteUrl('_oauth/angellist?close=close', {replaceLocalhost: true}) +
                '&response_type=code' +
                // '&scope=' + config.scope +
                '&state=' + state;

        Accounts.oauth.initiateLogin(state, loginUrl, callback);
    };

}) ();
