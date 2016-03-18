import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [ { msg: 'I\'ma Wario, I\'ma gonna win!', by: 'Wario'}],
      joined: false,
      input: '',
      placeholder: 'what\'s your name?',
      nickname: null
    };

    this.join = this.join.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSumbit = this.handleSumbit.bind(this)
  }

  componentDidMount() {
    const { socket } = this.props;

    // Listen for socket connection
    socket.on('connect', () => {

      // Render a message telling the user they're connected
      this.renderMessage('Connected!', 'CrowdMU')

      // Check if this is a returning user, if so, join them to the game
      if (window.localStorage && localStorage.nickname) {
        this.join(localStorage.nickname);
      }
    });

    // Start listening for messages
    socket.on('message',(msg, by) => {
      this.renderMessage(msg, by) 
    });
  }

  // Pass message down to ChatMessage children
  renderMessage(msg, by) {
    var message = {
      msg: msg,
      by: by
    }

    var messages = this.state.messages
    messages.push(message)
    messages = messages.slice(-7);
    this.setState({ 
      messages: messages
    });
  }

  // join user to the game
  join(data) {
    const { socket } = this.props;
    var nickname = data;
    // Try-catch necessary because Safari might have locked setItem causing
    // exception
    try {
      if (window.localStorage) localStorage.nickname = data;
    } catch (e) {}

    // Emit user data upon join and update component state
    socket.emit('join', data);
    this.setState({
      joined: true,
      placeholder: '',
      nickname: nickname
    })
  }

  handleInput(e) {
    
    //If it is called by someone pressing enter, then run the submit handler
    if (e.charCode === 13 || e.keyCode === 13) {  
      this.handleSumbit(e.target.value.substr(0, 140), this.state.nickname);
    
    //Update component state
    } else {
      this.setState({ input: e.target.value.substr(0, 140) });
    }

  }

  handleSumbit(msg, by) {
    const { socket } = this.props;

    // If message is empty, don't emit
    if (msg === '' ) return;
    

    // If joined already, render and emit message, else join the chat
    if (this.state.joined) {
      this.renderMessage(msg, by)
      socket.emit('message', msg);
    } else {
      this.join(msg);
    }

    // Set input to null
    this.setState({ input: '' }, ()=>{
    })

  }

  render() {
    return (
      <div className="height-60 margin-4">
        <div>{this.state.joined}</div>
        <input className="white-text" type="text" placeholder={this.state.placeholder} value={this.state.input} 
        onChange={this.handleInput} onKeyPress={this.handleInput} />
        {this.state.messages.map ((message, index) =>
          <ChatMessage message={message} key={index} />
        )}
      </div>
    );
  }
}

export default ChatBox;
