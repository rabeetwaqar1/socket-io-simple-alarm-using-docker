const ROUTE = '/alarm';
const controller = require('../controllers'+ROUTE);
const api = require('express').Router();
let authCtlr = require('../controllers/authentication.js');


module.exports = (app) => {

    //api routes;
    
    api.post(ROUTE+'/getSignedToken', authCtlr.getSignedToken);
    api.get(ROUTE, controller.get);
    api.post(ROUTE, controller.post); //authenticating call with middleware;
    api.put(ROUTE, controller.update);
    api.delete(ROUTE, controller.delete);

    app.use('/api', authCtlr.authenticate, api); //this will prepend /api as a route for every api route;
};


