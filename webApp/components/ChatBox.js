import React, { Component } from 'react';
import ChatMessage from './ChatMessage';
import Toggle from 'react-toggle';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: 'what\'s your name?',
      nickname: null,
      joined: false,
      messages: [{}],
      displayMoves: true,
      chatInput: ''
    };

    this.join = this.join.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.handleChatInput = this.handleChatInput.bind(this)
    this.handleSumbit = this.handleSumbit.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount() {
    const { socket } = this.props;

    // Listen for socket connection
    socket.on('connect', () => {

      // Render a message telling the user they're connected
      var timestamp = new Date();
      this.renderMessage('Connected!', 'crowdMU', timestamp, true);

      // Check if this is a returning user, if so, join them to the game
      if (window.localStorage && localStorage.nickname) {
        this.join(localStorage.nickname);
      }
    });

    // Start listening for chats
    socket.on('message',(msg, by, timestamp) => {

      // Render all incoming chats as messages
      this.renderMessage(msg, by, timestamp, true);
    });

    // Start listening for moves
    socket.on('submitMove', (move, by, timestamp) => {
      move = 'Pushed ' + move.charAt(0).toUpperCase() + move.slice(1);

      // render moves as messages
      this.renderMessage(move, by, timestamp, false);
    })

  }

  // join user to the game. Fires automatically for returning users, otherwise fires when first message is submitted
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

  // Pass message down to ChatMessage component. Message is either a chat or move
  renderMessage(msg, by, timestamp, isTrue) {
    var message = {
      msg: msg,
      by: by,
      date: timestamp,
      isChat: isTrue
    };

    var messages = this.state.messages
    messages.push(message)

    // Only keep most recent 200 messages (chats and moves)
    messages = messages.slice(-200);
    this.setState({
      messages: messages
    });
  }


  handleChatInput(e) {
    // If someone presses 'enter' on input box, check the content type (img,vid or plain text)
    // and then run the submit handler
    if (e.charCode === 13 || e.keyCode === 13) {
      var input = this.state.chatInput

      //Check if input is a url
      var isURL = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/i;
      if (isURL.test(input)) {

        // Then check if url is a youtube url
        var isYoutubeURL = /(^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$)/i;
        if (isYoutubeURL.test(input)) {

          // convert to video markdown syntax and then submit
          var video = '[![video]()](' + input + ')';
          return this.handleSumbit(video, this.state.nickname);
        }

        // Then check if url refers to an image (jpg, jpeg, gif, png, svg, bmp)
        var isImageURL = /(?:jpe?g|gif[^v]|png|svg|bmp)/i;
        if (isImageURL.test(input)) {

          // convert to image markdown syntax and then submit
          var image = '![image](' + input + ')'
          return  this.handleSumbit(image, this.state.nickname);
        }

        // URL is neither an image or youtube link, so call handleSubmit with plain input
        return this.handleSumbit(input, this.state.nickname);


      //Input is not a URL. Call handleSubmit with plain input
      } else {
        return this.handleSumbit(input, this.state.nickname);
      }


    // User did NOT press 'enter'. Update component state
    } else {
      return this.setState({ chatInput: e.target.value.substr(0, 280) });
    }

  }

  handleSumbit(msg, by) {
    const { socket } = this.props;

    // If message is empty, don't emit
    if (msg === '' ) return;


    // If joined already, render and emit message
    if (this.state.joined) {
      var timestamp = new Date();
      this.renderMessage(msg, by, timestamp, true)
      socket.emit('message', msg, timestamp);

    // else join the chat
    } else {
      this.join(msg);
    }

    // After emitting message, reset input
    this.setState({
      chatInput: ''
    })

  }

  handleToggle (e) {
    this.setState({
      displayMoves: !this.state.displayMoves
    })
  }

  render() {
    return (
      <div id="chat-box" className="height-90 grey lighten-4">
        <div className="messages">
          {this.state.messages.map ((message, index) =>
          <ChatMessage message={message} key={index} displayMoves={this.state.displayMoves} />
          )}
        </div>
        <div className="input-field grey lighten-4 row no-bottom-margin">
          <input className="col s8 m9 l10 black-text .rounded-10 valign-wrapper" type="text" placeholder={this.state.placeholder}
            value={this.state.chatInput} onChange={this.handleChatInput} onKeyPress={this.handleChatInput} />
          <div className="right tooltipped" data-position="top" data-delay="800" data-tooltip="Show/hide moves">
            <Toggle className="col s5 m4 l3 valign-wrapper" defaultChecked={this.state.displayMoves} onChange={this.handleToggle}/>
          </div>
        </div>
        <div className="grey lighten-4" style={ (this.state.chatInput) ? reveal : hide }>
        *italic*,   **bold**,   **_combined_**,   ~~strikethrough~~
        </div>
      </div>
    );
  }
}

export default ChatBox;

var reveal = {
  color: '#9e9e9e',
  fontSize: '0.8em',
  wordSpacing: '1em'
}

var hide = {
  display: 'hide',
  color: '#f5f5f5',
  fontSize: '0.8em',
  wordSpacing: '1em'
}
