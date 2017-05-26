var config      = require('config.json');
var express     = require('express');
var router      = express.Router();
var userService = require('services/users.service');

// routes
router.post('/register', register);
router.get('/', getAll);
router.get('/test', test);

module.exports = router;

function test(req, res) {
    console.log("Ready to insert first user in database...");
    userService.test()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
