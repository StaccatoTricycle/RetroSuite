import React, { Component } from 'react';
import Chart from './barChart.js'

class CrowdChoice extends Component {
  
  render() {
    return (
      <div className="col s4 height-100">
        CrowdChoice
        <Chart data={[35, 15, 4, 20, 9, 2, 0, 1]}/>
      </div>
    );
  }
}

export default CrowdChoice;
