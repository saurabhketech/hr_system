var express = require('express'); // Require express module
var app = express()
var mongoose = require('mongoose'); //Require mongoose module
var router = express.Router(); //creatig insatnce of express function
var crypto = require('crypto'); // Require crypto module for encryption
var moment = require("moment");
var jwt = require("jsonwebtoken");

<!---- user Registration ------>

router.post('/user/register', function(req, res, next) {
    var user_name = req.body.user_name;
    var password = req.body.password;
    var cpassword = req.body.confirm_password;
    var email = req.body.email;
    var user_type = req.body.user_type
    if ((user_name.length > 0) && (password.length > 0) && (cpassword.length > 0) && (email.length > 0) && (user_type.length > 0)) {
        if (password == cpassword) {
            var pass = crypto.createHash('md5').update(password).digest('hex');
            var record = new req.user({
                "user_name": user_name,
                "password": pass,
                "email": email,
                "user_type": user_type
            });
            record.save(function(err, details) {
                if (err) {
                    req.err = err;
                    next(req.err);
                } else {
                    res.json({
                        status: 1,
                        message: "record sucessfully inserted"
                    })
                }
            });
        } else {
            req.err = "password not matched";
            next(req.err);
        }
    } else {
        req.err = "all fields are necessary";
        next(req.err);
    }
});

<!--------- login -------->

router.post('/user/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if ((email.length > 0) && (password.length > 0)) {
        req.user.findOne({
            "email": email,
        }, function(err, docs) {
            var pass = crypto.createHash('md5').update(password).digest('hex');
            if (!docs) {
                req.err = "Invalid email";
                next(req.err)
            } else if (pass == docs.password) {
                let token = jwt.sign({
                    token: docs.id
                }, "secret_key", {
                    expiresIn: 60 * 60
                });
                res.json({
                    status: 1,
                    token: token
                })
            } else {
                req.err = "invalid password";
                next(req.err);
            }
        });
    } else {
        req.err = "All fields are must be filled";
        next(req.err);
    }

});


module.exports = router;