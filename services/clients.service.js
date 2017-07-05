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
service.updateClient = updateClient;

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
        var client = _.omit(clientParam, '_id');
        
        if (!checkClientStructure(client)) {
            deferred.reject(errorCodes.errorClieDataStruct);
        }
        db.clients.insert(
            client,
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

function updateClient(_id, clientParam) {
    var deferred = Q.defer();
    
    db.clients.findById(_id, function(err, client) {
       if (err) {
            console.log(err.name + ': ' + err.message); 
            deferred.reject(errorCodes.errorApplUnknown);
        }
       
       // update client
       updateClient();
    });
    
    function updateClient() {
        // fields to update
        var set = {
            clientName        : clientParam.clientName,
            clientServiceGroup: clientParam.clientServiceGroup,
            clientIndustry    : clientParam.clientIndustry,
            clientCountry     : clientParam.clientCountry
        };
        
        console.log(set);
        
        db.clients.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) {
                    deferred.reject(errorCodes.errorUpdateDatabase);
                }
                deferred.resolve();
            });
    }
    
    return deferred.promise;
}