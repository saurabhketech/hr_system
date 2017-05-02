var express = require('express'); // require express module
var router = express.Router();
var mongoose = require('mongoose'); // require moongose module
var app = express(); // creatig insatnce of express function
var bodyParser = require('body-parser'); // required body-parser module
var db = require('./database/db.js');
var routes = require('./routes/routes.js'); // create route for index
app.use(db());
app.use(bodyParser.urlencoded({ // getting the data from url
    extended: true
}));
app.use('/', routes);
app.use(errorHandler);

function errorHandler(err, req, res, next) {
    if (req.err) {
        return next(err)
    }
    res.status(500);
    res.render('error', { error: req.err });

}
app.listen(8080, function() {
    console.log("Server started at port number: 8080");
});