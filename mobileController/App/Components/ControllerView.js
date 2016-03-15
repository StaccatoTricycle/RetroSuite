var React = require('react-native');
var IconIon = require('react-native-vector-icons/Ionicons');
var Orientation = require('react-native-orientation');
var api = require('../Utils/api');
var Settings = require('./Settings');
var _ = require('lodash');
var StatusBarAndroid = require('react-native-android-statusbar');

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
      dPadSize: undefined,
      shoulderButtonSize: undefined,
      selectStartButtonSize: undefined,
      //used to control logic in the D-Pad
      dPadButton: undefined, //currently pressed D-pad button
      dPadStartX: undefined,
      dPadStartY: undefined,
      dPadTouchesIdentifier: undefined //identifier of the D-Pad touch within the evt.nativeEvent.touches array
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
        // The gesture has started; player's finger has touched the D-Pad area
        var x2 = evt.nativeEvent.locationX;
        var y2 = evt.nativeEvent.locationY;
        this.setState({
          dPadStartX: x2,
          dPadStartY: y2,
        });

        var distanceToUp = Math.sqrt( (79-x2)*(79-x2) + (58-y2)*(58-y2) );
        var distanceToRight = Math.sqrt( (127.5-x2)*(127.5-x2) + (105.5-y2)*(105.5-y2) );
        var distanceToDown = Math.sqrt( (81-x2)*(81-x2) + (150.5-y2)*(150.5-y2) );
        var distanceToLeft = Math.sqrt( (32.5-x2)*(32.5-x2) + (107-y2)*(107-y2) );

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
      onPanResponderMove: (evt, gestureState) => {
        // the player has moved their finger after touching the area
        // console.log('move evt', evt.nativeEvent.touches);
 
        // Find the identifier of the touch that corresponds to the D-Pad: this is done because if another button is clicked (ex. A/B/X/Y with the right thumb)
        // and the user moves their finger, it will throw off the D-Pad
        var initialX = this.state.dPadStartX;
        var initialY = this.state.dPadStartY;
        var mapped = evt.nativeEvent.touches.map(function(touch){
          var distance=Math.sqrt( (initialX-touch.pageX)*(initialX-touch.pageX) + (initialY-touch.pageY)*(initialY-touch.pageY) );
          return {'distance':distance, 'identifier': touch.identifier};
        });
        var closest = _.sortBy(mapped, 'distance');
        var identifier = closest[0]['identifier'];
        this.setState({dPadTouchesIdentifier:identifier});

        // Register dpad controls based on filtered evt.nativeevent.touches where identifier is the state. 
        var dPadTouch = evt.nativeEvent.touches.filter(function(touch){
          return touch.identifier = identifier;
        })
        var x2 = dPadTouch[0].locationX;
        var y2 = dPadTouch[0].locationY;

        var distanceToUp = Math.sqrt( (79-x2)*(79-x2) + (58-y2)*(58-y2) );
        var distanceToRight = Math.sqrt( (127.5-x2)*(127.5-x2) + (105.5-y2)*(105.5-y2) );
        var distanceToDown = Math.sqrt( (81-x2)*(81-x2) + (150.5-y2)*(150.5-y2) );
        var distanceToLeft = Math.sqrt( (32.5-x2)*(32.5-x2) + (107-y2)*(107-y2) );

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
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches within the responder
        if(gestureState.moveX===0 && gestureState.moveY===0) {
          // if gestureState.moveX and gestureState.moveY are 0, that means that there is no movement (the user has tapped and not dragged)
          // distance should therefore be calculated based on starting tap location (evt.nativeEvent.locationX and evt.nativeEvent.locationY)
          var x2 = evt.nativeEvent.locationX
          var y2 = evt.nativeEvent.locationY

          //TODO: don't hardcode theses points of the D-Pad buttons
          var distanceToUp = Math.sqrt( (79-x2)*(79-x2) + (58-y2)*(58-y2) );
          var distanceToRight = Math.sqrt( (127.5-x2)*(127.5-x2) + (105.5-y2)*(105.5-y2) );
          var distanceToDown = Math.sqrt( (81-x2)*(81-x2) + (150.5-y2)*(150.5-y2) );
          var distanceToLeft = Math.sqrt( (32.5-x2)*(32.5-x2) + (107-y2)*(107-y2) );
        } else {
          var x2 = gestureState.moveX;
          var y2 = gestureState.moveY;

          //TODO: don't hardcode theses points of the D-Pad buttons
          var distanceToUp = Math.sqrt( (140-x2)*(140-x2) + (132.5-y2)*(132.5-y2) );
          var distanceToRight = Math.sqrt( (186.5-x2)*(186.5-x2) + (180-y2)*(180-y2) );
          var distanceToDown = Math.sqrt( (140-x2)*(140-x2) + (228.5-y2)*(228.5-y2) );
          var distanceToLeft = Math.sqrt( (94.5-x2)*(94.5-x2) + (180-y2)*(180-y2) );
        }

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
        circleButtonSize: 105,
        dPadSize: 200,
        shoulderButtonSize: 0,
        selectStartButtonSize: 45
      })
    } else if (Dimensions.get('window').width===414) { //iPhone 6+/6s+
      this.setState({
        circleButtonSize: 115,
        dPadSize: 225,
        shoulderButtonSize: 0,
        selectStartButtonSize: 45
      })
    } else if (Dimensions.get('window').width===320) { //iPhone 5/5s
      this.setState({
        circleButtonSize: 88,
        dPadSize: 170,
        shoulderButtonSize: 0,
        selectStartButtonSize: 40
      })
    }
  }

  /////////////////////////////////////////////////////////////////////
  //Right thumb buttons: A, B, X, Y
  /////////////////////////////////////////////////////////////////////
  _APressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'b', function () { //emulator has a and b switched, so we switch again to make it normal
      console.log('A pressed');
    });
  }
  _APressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'b', function () { //emulator has a and b switched, so we switch again to make it normal
      console.log('A released');
    });
  }

  _BPressIn() {
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'a', function () { //emulator has a and b switched, so we switch again to make it normal
      console.log('B pressed');
    });
  }
  _BPressOut() {
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'a', function () { //emulator has a and b switched, so we switch again to make it normal
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
      if(this.state.dPadButton==='down') {
        this._downArrowPressOut();
      } else if(this.state.dPadButton==='left') {
        this._leftArrowPressOut();
      } else if(this.state.dPadButton==='right') {
        this._rightArrowPressOut();
      }
    }
    this.setState({dPadButton: "up"});
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'up', function () {
      console.log('up arrow pressed');
    });
  }
  _upArrowPressOut() {
    this.setState({dPadButton: undefined});
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'up', function () {
      console.log('up arrow released');
    });
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
    this.setState({dPadButton: "down"});
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'down', function () {
      console.log('down arrow pressed');
    });
  }
  _downArrowPressOut() {
    this.setState({dPadButton: undefined});
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'down', function () {
      console.log('down arrow released');
    });
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
    this.setState({dPadButton: "right"});
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'right', function () {
      console.log('right arrow pressed');
    });
  }
  _rightArrowPressOut() {
    this.setState({dPadButton: undefined});
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'right', function () {
      console.log('right arrow released');
    });
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
    this.setState({dPadButton: "left"});
    api.Press(this.props.route.ipAddress, this.props.route.playerID, 'left', function () {
      console.log('left arrow pressed');
    });
  }
  _leftArrowPressOut() {
    this.setState({dPadButton: undefined});
    api.Release(this.props.route.ipAddress, this.props.route.playerID, 'left', function () {
      console.log('left arrow released');
    });
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
            <IconIon name="record" size={this.state.circleButtonSize} color="red"/>
          </View>
          <View style={styles.BButton} onTouchStart={this._BPressIn.bind(this)} onTouchEnd={this._BPressOut.bind(this)}> 
            <IconIon name="record" size={this.state.circleButtonSize} color="red"/>
          </View>
          <View style={styles.XButton} onTouchStart={this._XPressIn.bind(this)} onTouchEnd={this._XPressOut.bind(this)}> 
            <IconIon name="record" size={this.state.circleButtonSize} color="red"/>
          </View>
          <View style={styles.YButton} onTouchStart={this._YPressIn.bind(this)} onTouchEnd={this._YPressOut.bind(this)}> 
            <IconIon name="record" size={this.state.circleButtonSize} color="red"/>
          </View>

          <View {...this._panResponder.panHandlers}>
            <View style={styles.dPad} > 
              <IconIon name="record" size={this.state.dPadSize} color="transparent"/>
            </View>
          </View>

          <View style={styles.leftShoulderButton} onTouchStart={this._leftShoulderPressIn.bind(this)} onTouchEnd={this._leftShoulderPressOut.bind(this)}> 
            <IconIon name="minus-round" size={this.state.shoulderButtonSize} color="red"/>
          </View>
          <View style={styles.rightShoulderButton} onTouchStart={this._rightShoulderPressIn.bind(this)} onTouchEnd={this._rightShoulderPressOut.bind(this)}> 
            <IconIon name="minus-round" size={this.state.shoulderButtonSize} color="red"/>
          </View>

          <View style={styles.selectButton} onTouchStart={this._selectPressIn.bind(this)} onTouchEnd={this._selectPressOut.bind(this)}> 
            <IconIon name="edit" size={this.state.selectStartButtonSize} color="red"/>
          </View>
          <View style={styles.startButton} onTouchStart={this._startPressIn.bind(this)} onTouchEnd={this._startPressOut.bind(this)}> 
            <IconIon name="edit" size={this.state.selectStartButtonSize} color="red"/>
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
    top: Dimensions.get('window').width * 0.34,
    left: Dimensions.get('window').height * 0.83,
  },
  BButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.48,
    left: Dimensions.get('window').height * 0.73,
  },
  XButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.2,
    left: Dimensions.get('window').height * 0.72,
  },
  YButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.34,
    left: Dimensions.get('window').height * 0.62,
  },
  dPad: {
    position: 'absolute',
    top: Dimensions.get('window').width * 0.2,
    left: Dimensions.get('window').height * 0.09,
  },
  leftShoulderButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * -0.35,
    left: Dimensions.get('window').height * 0.03,
  },
  rightShoulderButton: {
    position: 'absolute',
    top: Dimensions.get('window').width * -0.35,
    left: Dimensions.get('window').height * 0.63,
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