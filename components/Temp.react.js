/** @jsx React.DOM */

var React = require('react');

module.exports = Temp = React.createClass({
  render: function(){
    var temp = this.props.temp;
	var img = 'img/same16.png';
	if (temp.trend < 0) img = 'img/down16.png';
	if (temp.trend > 0) img = 'img/up16.png';
		
    return (
      <li className={"temp" + (temp.active ? ' active' : '')}>
        <img src={img} className="trend"/>
		<span className="temp-value">{temp.value}</span> 
		<span className="temp-time">{temp.time}</span> 
      </li>
    )
  }
});