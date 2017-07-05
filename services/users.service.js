var config     = require('config.json');
var errorCodes = require('errorcodes.json');
var _          = require('lodash');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcryptjs');
var Q          = require('q');
var mongo      = require('mongoskin');

var db         = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};
service.login        = login;
service.getAll       = getAll;
service.getById      = getById;
service.create       = create;
service.update       = update;
service.delete       = _delete;

module.exports = service;

function login(username, password) { 
    var deferred = Q.defer(); 
    
    db.users.findOne({ userName: username }, function (err, user) { 
        if (err) deferred.reject(err.name + ': ' + err.message); 

        if (user && bcrypt.compareSync(password, user.hash)) { 
            // authentication successful 
            deferred.resolve({ 
                _id: user._id, 
                userName: user.userName, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                token: jwt.sign({ sub: user._id }, config.secret) 
            }); 
        } else { 
            // authentication failed 
            deferred.resolve(); 
        } 
    }); 

    return deferred.promise; 
} 


function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        if (user) {
            // return user (wihtout hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    })
    
    return deferred.promise;
}


function create(userParam) {
    var deferred = Q.defer();

    // validation
    console.log('UserName: ' + userParam.userName);
    db.users.findOne(
        { userName: userParam.userName },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                console.log('User found: %j', user);
                //deferred.reject('Username "' + userParam.userName + '" is already taken');
                deferred.reject(errorCodes.errorUserPass);
                //deferred.reject({errCode: 1001, errMsg: 'fsdljfklsdjf'});
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();
    
    db.users.findById(_id, function(err, user) {
       if (err) deferred.reject(err.name + ': ' + err.message);
       
       // update user
       updateUser();
    });
    
    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName : userParam.lastName,
        };
        
        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }
        
        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }
    
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    
    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            
            deferred.resolve();
        });
        
    return deferred.promise;
}