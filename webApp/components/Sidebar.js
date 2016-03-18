import React, { Component } from 'react';
import ChatBox from './ChatBox';
import Jumbotron from './Jumbotron';

class Sidebar extends Component {
  render() {
    return (
      <div className="col m4 hide-on-small-and-down signature-color height-90">
        <Jumbotron />
        <ChatBox socket={this.props.socket} />
      </div>
    );
  }
}

export default Sidebar;
