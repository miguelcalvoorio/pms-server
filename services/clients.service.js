var config     = require('config.json');
var errorCodes = require('errorcodes.json');
var _          = require('lodash');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcryptjs');
var Q          = require('q');
var mongo      = require('mongoskin');

var db         = mongo.db(config.connectionString, { native_parser: true });
db.bind('clients');

var service = {};
service.createClient = createClient;
service.getAll       = getAll;
service.deleteClient = deleteClient;

module.exports = service;

function createClient(clientParam) {
    
    var deferred = Q.defer(); 
    
    db.clients.findOne({ clientName: clientParam.clientName }, function (err, client) { 
        if (err) {
            console.log(err.name + ': ' + err.message); 
            deferred.reject(errorCodes.errorApplUnknown);
        }
        
        if (client) {
            // Client exist
            deferred.reject(errorCodes.errorClieExists);
        } else {
            createClientData();
        }
    }); 
    
    function createClientData() {
        if (!checkClientStructure(clientParam)) {
            deferred.reject(errorCodes.errorClieDataStruct);
        }
        db.clients.insert(
            clientParam,
            function (err, doc) {
                if (err) {
                    console.log(err.name + ': ' + err.message);
                    deferred.reject(errorCodes.errorApplUnknown);
                }
                deferred.resolve();
            });
    }

    return deferred.promise; 
}

function checkClientStructure(clientData) {
    if (!clientData.clientName)         return false;
    if (!clientData.clientCountry)      return false;
    if (!clientData.clientIndustry)     return false;
    if (!clientData.clientServiceGroup) return false;
    return true;
}

function getAll() {
    var deferred = Q.defer();
    
    db.clients.find().toArray(function (err, clients) {
        if (err) {
            console.log(err.name + ': ' + err.message); 
            deferred.reject(errorCodes.errorApplUnknown);
        }

        // return clients
        clients = _.map(clients);
        deferred.resolve(clients);
    });

    return deferred.promise;
}

function deleteClient(id) {
    var deferred = Q.defer();
    
    db.clients.remove(
        { _id: mongo.helper.toObjectID(id) },
        function (err) {
            if (err) {
                console.log(err.name + ': ' + err.message); 
                deferred.reject(errorCodes.errorApplUnknown);
            }
            
            deferred.resolve();
        });
        
    return deferred.promise;
}