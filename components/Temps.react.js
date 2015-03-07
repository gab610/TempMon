/** @jsx React.DOM */

var React = require('react');
var Temp = require('./Temp.react.js');

module.exports = Temps = React.createClass({

  // Render our temps
  render: function(){

    // Build list items of single temp components using map
    var content = this.props.temps.map(function(temp){
      return (
        <Temp key={temp.id} temp={temp} />
      )
    });

    // Return ul filled with our mapped temps
    return (
      <ul className="temps">{content}</ul>
    )

  }

}); 