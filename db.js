let mongoose = require('mongoose'),
    util = require('util');

// Connecting to database
//"mongodb://<url>"
var connectionString = process.env.mongoString;

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
var db = mongoose.connect(connectionString,{
    useMongoClient: true
}).then(function(data){
    console.log("connected successfuly to mongo");
}).catch(function(err){
    console.log("connection issue with mongo"+err);
})
module.exports = db