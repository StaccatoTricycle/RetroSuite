import React, { Component } from 'react';
import Video from './Video';
import Toggle from 'react-toggle';

class Jumbotron extends Component {
  constructor(props) {
    super(props)
    this.state = {
      webCamAllowed: false,
      jumboShown: false,
      outsideStream: null,
      alertWrapper: false
    }
  }

  toggleVideo() {
    this.checkCam((camAllowed) => {
      if (!camAllowed) {
        this.state.jumboShown = false;
        // request camera access
        navigator.getUserMedia  = navigator.getUserMedia ||
                                  navigator.webkitGetUserMedia ||
                                  navigator.mozGetUserMedia ||
                                  navigator.msGetUserMedia;
        navigator.getUserMedia({ video: true, audio: false }, () => {}, () => {});
        this.state.alertWrapper = true;
        setTimeout(() => {
          this.setState({alertWrapper: false})
        }, 2000)
      }
      else {
        // otherwise if camera is allowed toggle jumboShown status
        this.state.jumboShown = !this.state.jumboShown;
        if (this.state.jumboShown) {
          this.props.socket.emit('is-a-streamer')
          document.getElementById('chat-box').style.height = "30%"
        }
        if (!this.state.jumboShown) {
          this.props.socket.emit('opt-out-of-jumbo') // if you toggle off the video, let the server know.
          console.log('opt-out-of-jumbo', this.state.outsideStream)
          this.state.outsideStream.getVideoTracks()[0].stop();
          document.getElementById('chat-box').style.height = "90%"
        }
      }
      // trigger a render
      this.setState({webCamAllowed: camAllowed})
    })
  }

  connectVideoToStream() {
    var video = document.getElementById('video-player')
    console.log(this.state.outsideStream)
    video.src = window.URL.createObjectURL(this.state.outsideStream)
    video.play()
  }

  // check if access to webcam is granted. returns bool
  checkCam(cb) {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        // Firefox 38+ seems having support of enumerateDevicesx
        navigator.enumerateDevices = function(callback) {
            navigator.mediaDevices.enumerateDevices().then(callback);
        };
    }

    var MediaDevices = [];
    var isHTTPs = location.protocol === 'https:';
    var canEnumerate = false;

    if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
        canEnumerate = true;
    } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
        canEnumerate = true;
    }

    var hasMicrophone = false;
    var hasSpeakers = false;
    var hasWebcam = false;

    var isMicrophoneAlreadyCaptured = false;
    var isWebcamAlreadyCaptured = false;

    function checkDeviceSupport(callback) {
        if (!canEnumerate) {
            return;
        }

        if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
            navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
        }

        if (!navigator.enumerateDevices && navigator.enumerateDevices) {
            navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
        }

        if (!navigator.enumerateDevices) {
            if (callback) {
                callback();
            }
            return;
        }

        MediaDevices = [];
        navigator.enumerateDevices((devices) => {
            devices.forEach((_device) => {
                var device = {};
                for (var d in _device) {
                    device[d] = _device[d];
                }

                if (device.kind === 'audio') {
                    device.kind = 'audioinput';
                }

                if (device.kind === 'video') {
                    device.kind = 'videoinput';
                }

                var skip;
                MediaDevices.forEach(function(d) {
                    if (d.id === device.id && d.kind === device.kind) {
                        skip = true;
                    }
                });

                if (skip) {
                    return;
                }

                if (!device.deviceId) {
                    device.deviceId = device.id;
                }

                if (!device.id) {
                    device.id = device.deviceId;
                }

                if (!device.label) {
                    device.label = 'Please invoke getUserMedia once.';
                    if (!isHTTPs) {
                        device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
                    }
                } else {
                    if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
                        isWebcamAlreadyCaptured = true;
                    }

                    if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
                        isMicrophoneAlreadyCaptured = true;
                    }
                }

                if (device.kind === 'audioinput') {
                    hasMicrophone = true;
                }

                if (device.kind === 'audiooutput') {
                    hasSpeakers = true;
                }

                if (device.kind === 'videoinput') {
                    hasWebcam = true;
                }

                // there is no 'videoouput' in the spec.

                MediaDevices.push(device);
            });

            if (callback) {
                callback();
            }
        });
    }

    // check for microphone/camera support!
    checkDeviceSupport(() => {
      console.log('GOT CALLED', isWebcamAlreadyCaptured)
      if (!cb) this.setState({webCamAllowed: isWebcamAlreadyCaptured});
      else cb(isWebcamAlreadyCaptured)
    });
  }


  componentDidMount() {
    this.checkCam() // update the state of camera

    navigator.getUserMedia  = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia;

    var peers = {
      'id': { // <- actual id
        'peer': null,
        'isConnected': false
      }
    };

    var outsideStream;
    var myID;
    this.props.socket.on('become-streamer', (idInfo) => {
      console.log('become-streamer')
      // get video stream
      navigator.getUserMedia({ video: true, audio: false }, (stream) => {
        // make stream global for peers who connect later
        outsideStream = stream;
        this.setState({outsideStream: stream})
        var video = document.getElementById('video-player')
        video.src = window.URL.createObjectURL(outsideStream)
        // create peer connections wil all sockets and stream to them
          idInfo.allIDs.forEach((id) => {
            if (idInfo.myID !== id) {
              peers[id] = {};
              peers[id].isConnected = false;
              peers[id].peer = new SimplePeer({ initiator: true, stream: stream, trickle: false})
              peers[id].peer.on('signal', (data) => {
                if (!peers[id].isConnected) {
                  this.props.socket.emit('connect-to-peer', {id: id, SDP: data})
                  peers[id].isConnected = true
                }
              })
            }
          })
      }, (error) => {
        console.log(error)
      })
    })

    // as new peers join give them the stream
    this.props.socket.on('new-peer', (id) => {
      console.log('new-peer', id)
      peers[id] = {};
      peers[id].peer = new SimplePeer({ initiator: true, stream: outsideStream, trickle: false })
      peers[id].peer.on('signal', (data) => {
        if (!peers[id].isConnected) {
          console.log(data)
          this.props.socket.emit('connect-to-peer', {id: id, SDP: data})
          peers[id].isConnected = true;
        }
      })
    })

    this.props.socket.on('signal-peer2', (data) => {
      console.log('signal peer 2', data.id)
      console.log(peers[data.id].peer)
      // peers[data.id] = {};
      peers[data.id].peer.signal(data.SDP);
    })

    // if you are not the streamer connect with them
    this.props.socket.on('connect-to-streamers-peer', (data) => {
      console.log('connect-to-streamers-peer', data.id)
      // handle the case where video streamer is the peer
      console.log('not undefined:', peers[data.id])

        peers[data.id] = {};
        peers[data.id].isConnected = false;
        peers[data.id].peer = new SimplePeer();
        peers[data.id].peer.signal(data.SDP);
        peers[data.id].peer.on('signal', (SDP) => {
          console.log('sending SDP back to streamer:', data.id)
          if (!peers[data.id].isConnected) {
            this.props.socket.emit('signal-peer1', {id: data.id, SDP: SDP})
            peers[data.id].isConnected = true;
          }
        })
        peers[data.id].peer.on('stream',  (stream) => {
          // got remote video stream, now let's show it in a video tag
          this.setState({outsideStream: stream});
          var video = document.getElementById('video-player')
          video.src = window.URL.createObjectURL(stream)
          video.play()
        })
    })
    // turn off webcam if not streaming
    this.props.socket.on('stop-streaming', () => {
      console.log('stop-streaming')
      outsideStream.getVideoTracks()[0].stop();
      peers = {}; // clear all peers in case we become the streamer again
    })
  }


  render() {

   console.log('checkstates', this.state.webCamAllowed, this.state.jumboShown)
    return (
      <div>
        <div id="jumbo-wrapper"><div className="inline toggle-jumbo left-align">Toggle Jumbotron</div><Toggle id="toggle-btn" checked={this.state.jumboShown && this.state.webCamAllowed} onChange={this.toggleVideo.bind(this)}/></div>
        {this.state.jumboShown && this.state.webCamAllowed ? <Video connectVideoToStream={this.connectVideoToStream.bind(this)} /> : ''}
        {this.state.alertWrapper ? <div id="alert-wrapper"><div className="inline" id="allow-camera">Allow camera access to view jumbotron</div><img className="inline up-arrow" src="./webcam_off.png"/></div> : ''}
      </div>
    )
  }
}
export default Jumbotron;
