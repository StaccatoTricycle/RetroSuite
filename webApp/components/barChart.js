import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import d3 from 'd3';
import _ from 'lodash';

import './style.scss';


const Chart = React.createClass({
  getInitialState: function() {
    return {
      windowWidth: 0,
      showBarLabel: false   
    }
  },

  componentDidMount: function() {
    window.setTimeout(()=>this.handleResize(), 200);
    window.setTimeout(()=>this.setState({showBarLabel:true}), 1200); //render labels slightly after bar fills up
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },  

  handleResize: function(e) {
    if(window.innerWidth > 600) {
      this.setState({windowWidth: window.innerWidth * 0.18});
    } else {
      this.setState({windowWidth: window.innerWidth * 0.28});
    }
  },

  _getButtonLabel: function(index) {
    switch (index) {
      case 0:
          return 'A';
      case 1:
          return 'B';
      case 2:
          return 'Up';
      case 3:
          return 'Right';
      case 4:
          return 'Down';
      case 5:
          return 'Left';
      case 6:
          return 'Start';
      case 7:
          return 'Select';
      default:
          break;
    }
  },

  _getBarLabelColor: function(x, n) {
    if(x(n)>7) {
      return 'white'; //bar chart is long enough for label to be in it; label renders inside of bar and is white
    } else {
      return 'black'; //bar chart is too short for label to be in it; label renders outside of bar and is black
    }
  },

  _getBarLabelPosition: function(x, n) {
    if(x(n)<=7) {
      return n.toString().length>1 ? +12 : +7; //bar chart too short for label to be in it; move it to the right: by 12 if label is a 2 digit number and by 7 if label is a 1 digit number 
    } else {
      return -2 //bar chart is long enough for label to be in it; move left by 2 
    }
  },
  
  render: function() {
    const data = this.props.data || []
    const width = this.state.windowWidth
    const barHeight = 12;
    const margin = 0;
    const labelSpace = 40;
    
    const x = d3.scale.linear()
                .domain([0, _.max(data)])
                .range([0, width-labelSpace-margin])
    
    const colorScaleBar = d3.scale.linear()
                         .domain(data)
                         .range(["#084594","#2171b5","#4292c6","#6baed6","#9ecae1","#c6dbef","#deebf7", "#f7fbff"])

    return (
      <svg 
        className="chart csstrans" 
        width={width} 
        height={barHeight * data.length}>
        <ReactCSSTransitionGroup
          transitionName="addBar" 
          component="g"
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={3000}
          >
        {
          data.map((n, i) => (
            <g key={i}>
              <g 
                transform={`translate(${margin},${barHeight*i})`}>
                <rect 
                  fill={'white'} 
                  width={labelSpace} 
                  height={barHeight-1}
                 />
                <text 
                  x="30" 
                  y="9" 
                  dy=".005em"
                  style={{fill:'Black'}}
                >
                  {this._getButtonLabel(i)}
                </text>
              </g>
              <g 
                transform={`translate(${labelSpace},${barHeight*i})`}>
                <rect 
                  fill={colorScaleBar(n)} 
                  width={x(n)} 
                  height={barHeight-1}
                 />
                <text 
                  x={x(n)+this._getBarLabelPosition(x, n)} 
                  y="9" 
                  dy=".005em"
                  style={{fill:this._getBarLabelColor(x, n)}}
                >
                  {this.state.showBarLabel ? n : null}
                </text>
              </g>
            </g>
          ))
        }
        </ReactCSSTransitionGroup>
      </svg>
    )
  }
})

export default Chart
