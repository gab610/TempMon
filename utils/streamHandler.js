var Temp = require('../models/Temp');

module.exports = function(stream, io){

  // When temps are posted ...
  stream.on('data', function(data) {

    // Construct a new temp object
    var temp = {
      trend: data['id'],
      active: false,
      value: data['user']['name'],
      time: data['user']['profile_image_url'],
    };

    // Create a new model instance with our object
    var tempEntry = new Temp(temp);

    // Save 'er to the database
    tempEntry.save(function(err) {
      if (!err) {
        // If everything is cool, socket.io emits the temp.
        io.emit('temp', temp);
      }
    });

  });

};