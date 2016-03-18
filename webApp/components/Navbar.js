import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (
      <nav className="signature-color height-10">
        <div className="nav-wrapper">
          <a className="brand-logo">crowd<span className="a-little-bigger">MU</span></a>
          <a data-activates="slide-in" className="right button-collapse"><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down">
            <li><a>OSnes</a></li>
            <li><a>CrowdMash</a></li>
          </ul>
          <ul id="slide-in" className="side-nav">
            <li><a>OSnes</a></li>
            <li><a>CrowdMash</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
