var config      = require('config.json');
var express     = require('express');
var router      = express.Router();
var clientService = require('services/clients.service');

// routes
router.post('/new', createClient);

module.exports = router;

function createClient(req, res) {
    clientService.createClient(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}