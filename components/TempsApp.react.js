/** @jsx React.DOM */

var React = require('react');
var Temps = require('./Temps.react.js');
var Loader = require('./Loader.react.js');
//var NotificationBar = require('./NotificationBar.react.js');

// Export the TempsApp component
module.exports = TempsApp = React.createClass({

  // Method to add a temp to our timeline
  addTemp: function(temp){

    // Get current application state
    var updated = this.state.temps;

    // Increment the unread count
    var count = this.state.count + 1;

    // Increment the skip count
    var skip = this.state.skip + 1;

    // Add temp to the beginning of the temps array
    updated.unshift(temp);

    // Set application state
    this.setState({temps: updated, count: count, skip: skip});

  },

  // Method to get JSON from server by page
  getPage: function(page){

    // Setup our ajax request
    var request = new XMLHttpRequest(), self = this;
    request.open('GET', 'page/' + page + "/" + this.state.skip, true);
    request.onload = function() {

      // If everything is cool...
      if (request.status >= 200 && request.status < 400){

        // Load our next page
        self.loadPagedTemps(JSON.parse(request.responseText));

      } else {

        // Set application state (Not paging, paging complete)
        self.setState({paging: false, done: true});

      }
    };

    // Fire!
    request.send();

  },

  // Method to show the unread temps
  showNewTemps: function(){

    // Get current application state
    var updated = this.state.temps;

    // Mark our temps active
    updated.forEach(function(temp){
      temp.active = true;
    });

    // Set application state (active temps + reset unread count)
    this.setState({temps: updated, count: 0});

  },

  // Method to load temps fetched from the server
  loadPagedTemps: function(temps){

    // So meta lol
    var self = this;

    // If we still have temps...
    if(temps.length > 0) {

      // Get current application state
      var updated = this.state.temps;

      // Push them onto the end of the current temps array
      temps.forEach(function(temp){
        updated.push(temp);
      });

      // This app is so fast, I actually use a timeout for dramatic effect
      // Otherwise you'd never see our super sexy loader svg
      setTimeout(function(){

        // Set application state (Not paging, add temps)
        self.setState({temps: updated, paging: false});

      }, 1000);

    } else {

      // Set application state (Not paging, paging complete)
      this.setState({done: true, paging: false});

    }
  },

  // Method to check if more temps should be loaded, by scroll position
  checkWindowScroll: function(){

    // Get scroll pos & window data
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var s = (document.body.scrollTop || document.documentElement.scrollTop || 0);
    var scrolled = (h + s) > document.body.offsetHeight;

    // If scrolled enough, not currently paging and not complete...
    if(scrolled && !this.state.paging && !this.state.done) {

      // Set application state (Paging, Increment page)
      this.setState({paging: true, page: this.state.page + 1});

      // Get the next page of temps from the server
      this.getPage(this.state.page);

    }
  },

  // Set the initial component state
  getInitialState: function(props){

    props = props || this.props;

    // Set initial application state using props
    return {
      temps: props.temps,
      count: 0,
      page: 0,
      paging: false,
      skip: 0,
      done: false
    };

  },

  componentWillReceiveProps: function(newProps, oldProps){
    this.setState(this.getInitialState(newProps));
  },

  // Called directly after component rendering, only on client
  componentDidMount: function(){

    // Preserve self reference
    var self = this;

    // Initialize socket.io
    var socket = io.connect();

    // On temp event emission...
    socket.on('temp', function (data) {

        // Add a temp to our queue
        self.addTemp(data);

    });

    // Attach scroll event to the window for infinity paging
    window.addEventListener('scroll', this.checkWindowScroll);

  },

  // Render the component
  render: function(){

    return (
      <div className="temps-app">
        <Temps temps={this.state.temps} />
        <Loader paging={this.state.paging}/>
      </div>
    )

  }

});