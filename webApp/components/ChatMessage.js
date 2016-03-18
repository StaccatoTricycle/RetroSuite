import React, { Component } from 'react';

class ChatMessage extends Component {
  render() {
    return (
      <div className="row" style={{marginBottom: 0 + 'px'}}>
        <div className="left-algin col s9 push-s3 white-text">{this.props.message.msg}</div>
        <div className="left-align col s3 pull-s9 white-text">{this.props.message.by}</div>
      </div>
    );
  }
}

export default ChatMessage;
