// the middleware function
var mongo = require('mongodb'); // 2.0.31
module.exports = function() {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1/hr_system');
    var db = new mongo.Db('hr_system', new mongo.Server('127.0.0.1', 27017));
    var conn = mongoose.connection;
    var users_schema = mongoose.Schema({
        user_name: { type: String, index: { unique: true }},
        email: { type: String, index: { unique: true }},
        password: String,
        user_type: {type: String, enum: ['USER' , 'ADMIN']}
    }, {
        strict: true,
        collection: 'Users'
    });
    var userobject = conn.model('hr_system', users_schema); // user object
    return function(req, res, next) {
        req.user = userobject;
        next();
    }

};