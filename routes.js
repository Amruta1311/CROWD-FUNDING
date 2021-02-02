const routes = require('next-routes')();    // returns a function that is invoked immediately after requiring it in this file

routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')        // :address signifies to be a wildcard or a variable of sorts, the second argument concerns what component we would want to show from the pages directory whenever someone follows the first argument of dynamic routing through addresses
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;    // Exports some helpers that will allow us to automatically nevigate users around our application

