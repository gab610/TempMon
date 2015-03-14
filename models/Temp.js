var mongoose = require('mongoose');

// Create a new schema for our temp data
var schema = new mongoose.Schema({
    trend       : Number
  , active     : Boolean
  , value     : Number
  , time       : Date
});

// Create a static getTemps method to return temp data from the db
schema.statics.getTemps = function(page, skip, callback) {

  var temps = [],
      start = (page * 10) + (skip * 1);

  // Query the db, using skip and limit to achieve page chunks
  Temp.find({},'trend active value time',{skip: start, limit: 10}).sort({time: 'desc'}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      docs.forEach(function(doc){
        temps.push({time: doc.time.toLocaleString(), value: doc.value, active:true, trend: doc.trend, id: doc._id})
      });
    }

    // Pass them back to the specified callback
    callback(temps);
  });
};

schema.statics.lastTemp = function(callback) {
	 Temp.findOne().sort('-time').exec(function(err, t) {
		if (err)
            console.log(err);
        callback(t);
	 });
};

// Return a Temp model based upon the defined schema
module.exports = Temp = mongoose.model('Temp', schema);