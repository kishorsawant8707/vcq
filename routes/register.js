var express = require('express');
var router = express.Router();
var api = require('../models/user');
var mail = require('../config/mail');
var sms = require('../config/sms');
var config = require('../config/settings');
//Registration page
router.get('/', function(req, res) {
    res.render('register');
});


router.post('/registration', function(req, res) {
    api.createUser(req.body, function (err, results, fields) {
        if (err) {
            req.flash('error_msg', err.message + ' ' + config.authoring.genericError);
            res.redirect('/register');
        } else{
            const user = req.body.mobile;
            req.login(user, function (err) {
                var mailPromise = mail.triggerMail(req.body, 'REGISTRATION');
                var smsPromise = sms.sendSMS(req.body, 'REGISTRATION');
                Promise.all([mailPromise, smsPromise]).then(function(){
                    req.flash('success_msg', config.authoring.registrationSuccess);
                    res.redirect('/');
                });
            });
        }
    });
});

module.exports = router;
