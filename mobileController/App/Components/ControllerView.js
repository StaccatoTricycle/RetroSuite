var React = require('react-native');
var IconIon = require('react-native-vector-icons/Ionicons');
var Orientation = require('react-native-orientation');
var api = require('../Utils/api');
var Settings = require('./Settings');
var _ = require('lodash');

var {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StatusBarIOS,
  VibrationIOS,
  PanResponder
} = React;

class ControllerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //used to scale sizes of buttons depending on phone resolution
      circleButtonSize: undefined,
      arrowButtonSize: undefined,
      selectStartButtonSize: undefined,
      //used to detect changes in the D-Pad
      dPadButton: undefined, //currently pressed D-pad button
    }
  }

  componentWillMount() {
    //The following code is used to make the D-Pad into a joystick so the user can roll their thumb between buttons and trigger a response
    //instead of having to lift a finger and tap 
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('move gestureState', gestureState);

        var x2 = gestureState.moveX;
        var y2 = gestureState.moveY;

        var distanceToUp = Math.sqrt( (140-x2)*(140-x2) + (132.5-y2)*(132.5-y2) );
        var distanceToRight = Math.sqrt( (186.5-x2)*(186.5-x2) + (180-y2)*(180-y2) );
        var distanceToDown = Math.sqrt( (140-x2)*(140-x2) + (228.5-y2)*(228.5-y2) );
        var distanceToLeft = Math.sqrt( (94.5-x2)*(94.5-x2) + (180-y2)*(180-y2) );

        var closest = Math.min(distanceToUp, distanceToRight, distanceToDown, distanceToLeft);

        if(closest===distanceToUp && this.state.dPadButton!=='up') {
          this._upArrowPressIn(); 
        } else if (closest===distanceToRight && this.state.dPadButton!=='right') {
          this._rightArrowPressIn(); 
        } else if (closest===distanceToDown && this.state.dPadButton!=='down') {
          this._downArrowPressIn(); 
        } else if (closest===distanceToLeft && this.state.dPadButton!=='left') {
          this._leftArrowPressIn(); 
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches within the responder
        // This typically means a gesture has succeeded

        // if gestureState.moveX and gestureState.moveY are 0, that means that there is no movement (the user has tapped and not dragged)
        // distance should therefore be calculated based on starting tap location (gestureState.x0 and gestureState.y0)
        var x2 = gestureState.moveX===0 ? gestureState.x0 : gestureState.moveX;
        var y2 = gestureState.moveY===0 ? gestureState.y0 : gestureState.moveY;

        //TODO: don't hardcode theses points of the D-Pad buttons
        var distanceToUp = Math.sqrt( (140-x2)*(140-x2) + (132.5-y2)*(132.5-y2) );
        var distanceToRight = Math.sqrt( (186.5-x2)*(186.5-x2) + (180-y2)*(180-y2) );
        var distanceToDown = Math.sqrt( (140-x2)*(140-x2) + (228.5-y2)*(228.5-y2) );
        var distanceToLeft = Math.sqrt( (94.5-x2)*(94.5-x2) + (180-y2)*(180-y2) );

        var closest = Math.min(distanceToUp, distanceToRight, distanceToDown, distanceToLeft);

        if(closest===distanceToUp) {
          this._upArrowPressOut(); 
        } else if (closest===distanceToRight) {
          this._rightArrowPressOut(); 
        } else if (closest===distanceToDown) {
          this._downArrowPressOut(); 
        } else if (closest===distanceToLeft) {
          this._leftArrowPressOut(); 
        }

      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }


  componentDidMount() {
    Orientation.lockToLandscapeRight(); //this will lock the view to Landscape

    //buttons must scale with size of the phone   
    if(Dimensions.get('window').width===375) { //iPhone 6/6s
      this.setState({
        circleButtonSize: 62,
        arrowButtonSize: 52,
        selectStartButtonSize: 45
      })
    } else if (Dimensions.get('window').width===414) { //iPhone 6+/6s+
      this.setState({
        circleButtonSize: 68,
        arrowButtonSize: 58,
        selectStartButtonSize: 45
      })
    } else if (Dimensions.get('window').width===320) { //iPhone 5/5s
      this.setState({
        circleButtonSize: 53,
        arrowButtonSize: 44,
        selectStartButtonSize: 40
      })
    }
  }

  /////////////////////////////////////////////////////////////////////
  //Right thumb buttons: A, B, X, Y
  /////////////////////////////////////////////////////////////////////
  _APressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'a', function () {
      console.log('A pressed');
    });
  }
  _APressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'a', function () {
      console.log('A released');
    });
  }

  _BPressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'b', function () {
      console.log('B pressed');
    });
  }
  _BPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'b', function () {
      console.log('B released');
    });
  }

  _XPressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'x', function () {
      console.log('X pressed');
    });
  }
  _XPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'x', function () {
      console.log('X released');
    });
  }

  _YPressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'y', function () {
      console.log('Y pressed');
    });
  }
  _YPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'y', function () {
      console.log('Y released');
    });
  }

  /////////////////////////////////////////////////////////////////////
  //Left thumb buttons: Direction pad
  /////////////////////////////////////////////////////////////////////
  _upArrowPressIn() {
    if(this.state.dPadButton!==undefined && this.state.dPadButton!=='up') { //there is already another D-Pad button pressed, which means that we are changing from one D-Pad button to another
      // this.setState({dPadButtonsMoved: true});
      if(this.state.dPadButton==='down') {
        this._downArrowPressOut();
      } else if(this.state.dPadButton==='left') {
        this._leftArrowPressOut();
      } else if(this.state.dPadButton==='right') {
        this._rightArrowPressOut();
      }
    }
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'up', function () {
      console.log('up arrow pressed');
    });
    this.setState({dPadButton: "up"});
  }
  _upArrowPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'up', function () {
      console.log('up arrow released');
    });
    this.setState({dPadButton: undefined});
  }

  _downArrowPressIn() {
    if(this.state.dPadButton!==undefined && this.state.dPadButton!=='down') { //there is already another D-Pad button pressed, which means that we are changing from one D-Pad button to another
      if(this.state.dPadButton==='up') {
        this._upArrowPressOut();
      } else if(this.state.dPadButton==='left') {
        this._leftArrowPressOut();
      } else if(this.state.dPadButton==='right') {
        this._rightArrowPressOut();
      }
    }
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'down', function () {
      console.log('down arrow pressed');
    });
    this.setState({dPadButton: "down"});
  }
  _downArrowPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'down', function () {
      console.log('down arrow released');
    });
    this.setState({dPadButton: undefined});
  }

  _rightArrowPressIn() {
    if(this.state.dPadButton!==undefined && this.state.dPadButton!=='right') { //there is already another D-Pad button pressed, which means that we are changing from one D-Pad button to another
      if(this.state.dPadButton==='down') {
        this._downArrowPressOut();
      } else if(this.state.dPadButton==='left') {
        this._leftArrowPressOut();
      } else if(this.state.dPadButton==='up') {
        this._upArrowPressOut();
      }
    }
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'right', function () {
      console.log('right arrow pressed');
    });
    this.setState({dPadButton: "right"});
  }
  _rightArrowPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'right', function () {
      console.log('right arrow released');
    });
    this.setState({dPadButton: undefined});
  }

  _leftArrowPressIn() {
    if(this.state.dPadButton!==undefined && this.state.dPadButton!=='left') { //there is already another D-Pad button pressed, which means that we are changing from one D-Pad button to another
      if(this.state.dPadButton==='down') {
        this._downArrowPressOut();
      } else if(this.state.dPadButton==='up') {
        this._upArrowPressOut();
      } else if(this.state.dPadButton==='right') {
        this._rightArrowPressOut();
      }
    }
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'left', function () {
      console.log('left arrow pressed');
    });
    this.setState({dPadButton: "left"});
  }
  _leftArrowPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'left', function () {
      console.log('left arrow released');
    });
    this.setState({dPadButton: undefined});
  }

  /////////////////////////////////////////////////////////////////////
  //Shoulder buttons: Left and Right Index Finger Triggers. 
  //TODO: implement shoulder buttons on screen, or ideally with volume rocker
  /////////////////////////////////////////////////////////////////////
  _rightShoulderPressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'r-shoulder', function () {
      console.log('right shoulder pressed');
    });
  }
  _rightShoulderPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'r-shoulder', function () {
      console.log('right arrow released');
    });
  }

  _leftShoulderPressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'l-shoulder', function () {
      console.log('left shoulder pressed');
    });
  }
  _leftShoulderPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'l-shoulder', function () {
      console.log('left arrow released');
    });
  }

  /////////////////////////////////////////////////////////////////////
  //Start and Select buttons
  /////////////////////////////////////////////////////////////////////
  _startPressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'start', function () {
      console.log('start pressed');
      VibrationIOS.vibrate();
    });
  }
  _startPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'start', function () {
      console.log('start released');
    });
  }

  _selectPressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'select', function () {
      console.log('select pressed');
      VibrationIOS.vibrate();
    });
  }
  _selectPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'select', function () {
      console.log('select released');
    });
  }

  render() {
    StatusBarIOS.setHidden('true');
    return (
      <View style={styles.imageContainer}>
        <Image source={require('./Assets/snescontrollercropped.jpg')} style={styles.image}> 

          <View style={styles.AButton} onTouchStart={this._APressIn.bind(this)} onTouchEnd={this._APressOut.bind(this)}> 
            <IconIon name="record" size={this.state.circleButtonSize} color="transparent"/>
          </View>
          <View style={styles.BButton} onTouchStart={this._BPressIn.bind(this)} onTouchEnd={this._BPressOut.bind(this)}> 
            <IconIon name="record" size={this.state.circleButtonSize} color="transparent"/>
          </View>
          <View style={styles.XButton} onTouchStart={this._XPressIn.bind(this)} onTouchEnd={this._XPressOut.bind(this)}> 
            <IconIon name="record" size={this.state.circleButtonSize} color="transparent"/>
          </View>
          <View style={styles.YButton} onTouchStart={this._YPressIn.bind(this)} onTouchEnd={this._YPressOut.bind(this)}> 
            <IconIon name="record" size={this.state.circleButtonSize} color="transparent"/>
          </View>

          <View {...this._panResponder.panHandlers}>
            <View style={styles.upButton} onTouchStart={this._upArrowPressIn.bind(this)}> 
              <IconIon name="stop" size={this.state.arrowButtonSize} color="transparent"/>
            </View>
            <View style={styles.downButton} onTouchStart={this._downArrowPressIn.bind(this)}> 
              <IconIon name="stop" size={this.state.arrowButtonSize} color="transparent"/>
            </View>
            <View style={styles.leftButton} onTouchStart={this._leftArrowPressIn.bind(this)}> 
              <IconIon name="stop" size={this.state.arrowButtonSize} color="transparent"/>
            </View>
            <View style={styles.rightButton} onTouchStart={this._rightArrowPressIn.bind(this)}> 
              <IconIon name="stop" size={this.state.arrowButtonSize} color="transparent"/>
            </View>
          </View>

          <View style={styles.selectButton}> 
            <TouchableOpacity onPressIn={this._selectPressIn.bind(this)} onPressOut={this._selectPressOut.bind(this)}>
              <IconIon name="edit" size={this.state.selectStartButtonSize} color="transparent"/>
            </TouchableOpacity>
          </View>
          <View style={styles.startButton}> 
            <TouchableOpacity onPressIn={this._startPressIn.bind(this)} onPressOut={this._startPressOut.bind(this)}>
              <IconIon name="edit" size={this.state.selectStartButtonSize} color="transparent"/>
            </TouchableOpacity>
          </View>

        </Image>
      </View>

    );
  }
}

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').width,
  },
  AButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.3875,
    left: Dimensions.get('window').height * 0.848,
  },
  BButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.5215,
    left: Dimensions.get('window').height * 0.7525,
  },
  XButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.255,
    left: Dimensions.get('window').height * 0.752,
  },
  YButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.3875,
    left: Dimensions.get('window').height * 0.655,
  },
  rightButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.405,
    left: Dimensions.get('window').height * 0.24,
  },
  downButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.51,
    left: Dimensions.get('window').height * 0.18,
  },
  upButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.30,
    left: Dimensions.get('window').height * 0.18,
  },
  leftButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.405,
    left: Dimensions.get('window').height * 0.12,
  },
  selectButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.47,
    left: Dimensions.get('window').height * 0.38,
  },
  startButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.47,
    left: Dimensions.get('window').height * 0.49,
  }
});

module.exports = ControllerView;