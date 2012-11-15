Package.describe({
    summary: "Login service for Angel List accounts."
});

Package.on_use(function(api) {
    api.use('accounts-base', ['client', 'server']);
    api.use('accounts-oauth2-helper', ['client', 'server']);
    api.use('http', ['client', 'server']);
    api.use('templating', 'client');

    api.add_files(
        ['angellist_configure.html', 'angellist_configure.js'],
        'client');

    api.add_files('angellist_common.js', ['client', 'server']);
    api.add_files('angellist_server.js', 'server');
    api.add_files('angellist_client.js', 'client');
});
