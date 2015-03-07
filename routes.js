var JSX = require('node-jsx').install(),
  React = require('react'),
  TempsApp = require('./components/TempsApp.react'),
  Temp = require('./models/Temp');

module.exports = {

  index: function(req, res) {
    // Call static model method to get temps in the db
    Temp.getTemps(0,0, function(temps, pages) {

      // Render React to a string, passing in our fetched temps
      var markup = React.renderComponentToString(
        TempsApp({
          temps: temps
        })
      );

      // Render our 'home' template
      res.render('home', {
        markup: markup, // Pass rendered react markup
        state: JSON.stringify(temps) // Pass current state to client side
      });

    });
  },

  page: function(req, res) {
    // Fetch temps by page via param
    Temp.getTemps(req.params.page, req.params.skip, function(temps) {

      // Render as JSON
      res.send(temps);
		
    });
  },
  
  post: function(io) {
	return function(req, res) {
		//console.log(req.body.Temp);
		var t = req.body.Temp;	
		var d = new Date();
		// construct a new temp object	
		var temp = {
		  trend: 0,
		  active: true,
		  value: t,
		  time: d.toLocaleString(),
		};

		// create a new model instance with our object
		var tempentry = new Temp(temp);

		// save 'er to the database
		tempentry.save(function(err) {
		  if (!err) {
			// if everything is cool, socket.io emits the temp.
			temp.id = tempentry._id;
			io.emit('temp', temp);
		  }
		});
		
		res.status(200).send('RECD'); 
	  }
	}
}