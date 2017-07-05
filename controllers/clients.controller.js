var config      = require('config.json');
var express     = require('express');
var router      = express.Router();
var clientService = require('services/clients.service');

// routes
router.post('/new', createClient);
router.get('/', getAll);
router.delete('/:_id', deleteClient); 

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

function getAll(req, res) {
    clientService.getAll()
        .then(function(clients) {
            res.send(clients);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function deleteClient(req, res) {
    clientService.deleteClient(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}