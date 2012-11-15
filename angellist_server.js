(function () {

    // utility
    var checkAndProcessResponse = function( res ){
        if ( res.error )
            throw res.error; // protocol/transport error
        if ( (typeof res.data !== 'object') && (typeof res.content === "string") )
            res.data = JSON.parse(res.content); // application/json mime type not detected correctly
        if ( res.data.error )
            throw res.error; // application error
    }

    Accounts.oauth.registerService('angelList', 2, function(query) {

        var data = fetchTokenAndProfile(query);

        return {
            serviceData: {
                id: data.id,
                accessToken: data.access_token
            },
            options: {
                profile: {
                    name: data.name,
                    picture: data.image
                }
            }
        };
    });

    var fetchTokenAndProfile = function (query) {
        var config = Accounts.loginServiceConfiguration.findOne({service: 'angelList'});
        if (!config)
            throw new Accounts.ConfigError("Service not configured");
        var response = Meteor.http.post(
            "https://angel.co/api/oauth/token", {params: {
                code: query.code,
                client_id: config.clientId,
                client_secret: config.secret,
                redirect_uri: Meteor.absoluteUrl("_oauth/angellist?close=close", {replaceLocalhost: true}),
                grant_type: 'authorization_code'
            }});
        /* response =
            { statusCode: 200,
              content: '{"access_token":"xxx","token_type":"bearer"}',
              headers: 
               { 'cache-control': 'no-store',
                 'content-type': 'application/json;charset=UTF-8',
                 date: 'Fri, 09 Nov 2012 05:48:58 GMT',
                 etag: '"xxx"',
                 pragma: 'no-cache',
                 server: 'nginx',
                 status: '200 OK',
                 vary: 'Accept-Encoding',
                 'x-process': 'app03 25982',
                 'x-runtime': '265',
                 'x-thanks': 'For using AngelList. Rock on.',
                 'content-length': '73',
                 connection: 'keep-alive' },
              data: 
               { access_token: 'xxx',
                 token_type: 'bearer' },
              error: null }
        */
        checkAndProcessResponse(response);
        var accessToken = response.data.access_token;
        // Angel list does not return profile data right away
        // we need a separate call
        var headers = { Authorization: 'Bearer ' + accessToken };
        result = Meteor.http.get('https://api.angel.co/1/me', {headers: headers} );
        /* result =
            { statusCode: 200,
              content: '{"name":"Aldo Bucchi","id":191133,"bio":null,"follower_count":23000,"angellist_url":"https://angel.co/aldo-bucchi","image":"https://s3.amazonaws.com/photos.angel.co/users/191133-medium_jpg?1351557374","blog_url":null,"online_bio_url":null,"twitter_url":null,"facebook_url":null,"linkedin_url":"http://www.linkedin.com/pub/aldo-bucchi/25/774/6a","aboutme_url":null,"github_url":null,"dribbble_url":null,"behance_url":null,"what_ive_built":null,"locations":[],"roles":[]}',
              headers: 
               { 'cache-control': 'private, max-age=0, must-revalidate',
                 'content-type': 'application/json; charset=utf-8',
                 date: 'Fri, 09 Nov 2012 05:49:09 GMT',
                 etag: '"xxx"',
                 server: 'nginx',
                 status: '200 OK',
                 vary: 'Accept-Encoding',
                 'x-ratelimit-limit': '2000',
                 'x-ratelimit-remaining': '2000',
                 'x-runtime': '20',
                 'content-length': '465',
                 connection: 'keep-alive' },
              data: 
               { name: 'Aldo Bucchi',
                 id: 191133,
                 bio: null,
                 follower_count: 23000,
                 angellist_url: 'https://angel.co/aldo-bucchi',
                 image: 'https://s3.amazonaws.com/photos.angel.co/users/191133-medium_jpg?1351557374',
                 blog_url: null,
                 online_bio_url: null,
                 twitter_url: null,
                 facebook_url: null,
                 linkedin_url: 'http://www.linkedin.com/pub/aldo-bucchi/25/774/6a',
                 aboutme_url: null,
                 github_url: null,
                 dribbble_url: null,
                 behance_url: null,
                 what_ive_built: null,
                 locations: [],
                 roles: [] },
              error: null }
        */
        checkAndProcessResponse(response);
        response.data.access_token = accessToken;
        return response.data;
    };
})();
