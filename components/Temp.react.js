/** @jsx React.DOM */

var React = require('react');

module.exports = Temp = React.createClass({
  render: function(){
    var temp = this.props.temp;
    return (
      <li className={"temp" + (temp.active ? ' active' : '')}>
        <img src={temp.trend} className="trend"/>
		<span className="temp-value">@{temp.value}</span> 
		<span className="temp-time">@{temp.time}</span> 
      </li>
    )
  }
});