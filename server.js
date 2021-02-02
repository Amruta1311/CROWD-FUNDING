const { createServer } = require('http');

const next = require('next');

const app = next({

    dev: process.env.NODE_ENV !== 'production'  // THis tells the application to look at a global environment variable called node environment and checks if it is set to string productions. If it is then our app is going to run in production mode. That will change the way next behaves

});

const routes = require('./routes');

const handler = routes.getRequestHandler(app); 

// we finally set up the app and tell it to listen to a particular port

app.prepare().then(() => {

    createServer(handler).listen(3000, (err) => {
        if(err) throw err;
        console.log('Ready on localhost:3000');
    });

});