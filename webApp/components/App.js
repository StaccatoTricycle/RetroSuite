import React, { Component } from 'react';
import Navbar from './Navbar';
import GameConsole from './GameConsole';
import Sidebar from './Sidebar';


const configURL = "http://localhost:3001";
const socket = io(configURL)

class App extends Component {

  render() {
    return (
      <div className="row height-100 no-bottom-margin">
        <Navbar />
        <GameConsole socket={socket} />
        <Sidebar socket={socket} />
      </div>
    );
  }

}

export default App;
