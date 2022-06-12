import {IS_SAFARI} from './browser';
import {arrayBufferToBlob} from './utils';

const Camera = function(el, options) {

  if(!(el instanceof Element || el instanceof HTMLDocument)) {
    throw new Error('screen video slot is not defined');
  }

  if(navigator.mediaDevices === undefined) {
    throw new Error('this browser doesn\'t support navigator.mediaDevices');
  }

  this._videoSlot = el;

  this._stream = null;
  this._mediaRecorder = null;
  this._recordedChunks = [];

  // Events
  this.EVENTS = {
    DataAvailable: 'DataAvailable'
  }
  this._eventCallbacks = {};

  // Attributes
  this._attributes = {
    isStarted: false,
    mimeType: IS_SAFARI ? 'video/mp4' : 'video/webm',
    version: '!!#Version#!!'
  }
  // Options
  this._options = Object.assign({
    segmentSize: 5000, // ms
    media: {
      video: true,
      audio: false
    }
  }, options);
}
Camera.prototype.start = function() {
  console.log('start camera');
  navigator.mediaDevices.getUserMedia(this._options.media)
    .then(stream => {
      // use the stream
      this._videoSlot.srcObject = stream;
      this.dump();

      this._mediaRecorder = new MediaRecorder(stream);
      this._recordedChunks = [];

      this._mediaRecorder.addEventListener('dataavailable', (event) => {
        // Blob
        const recorderBlob = arrayBufferToBlob(event.data, this._attributes.mimeType);
        console.log('camera successfully recorded', recorderBlob.size, 'bytes of', recorderBlob.type, recorderBlob);
        // TODO:
        this._recordedChunks.push(recorderBlob);
        this.onDataAvailable(recorderBlob);
      });
      this._mediaRecorder.addEventListener('stop', () => {
        // recording stopped & all blobs sent
        // TODO:
        console.log(this._recordedChunks);
      });

      this._mediaRecorder.start(this._options.segmentSize); // 5000
      console.log(this._mediaRecorder.state);

      this._attributes.isStarted = true;
    })
    .catch(error => {
      console.log(error);
      this._attributes.isStarted = false;
    });
}
Camera.prototype.stop = function() {
  console.log('stop camera');
  if(this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
    this._mediaRecorder.stop();
    console.log(this._mediaRecorder.state);
  }
  try {
    const tracks = this._videoSlot.srcObject.getTracks();
    console.log(tracks);
    tracks.forEach(track => track.stop());
    this._videoSlot.srcObject = null;
  } catch (e) {}
  this._attributes.isStarted = false;
}
Camera.prototype.dump = function() {
  const videoTrack = this._videoSlot.srcObject.getVideoTracks()[0];
  console.log(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.log(JSON.stringify(videoTrack.getConstraints(), null, 2));
}
Camera.prototype.onDataAvailable = function(blob) {
  if(this.EVENTS.DataAvailable in this._eventCallbacks) {
    if(typeof this._eventCallbacks[this.EVENTS.DataAvailable] === 'function') {
      this._eventCallbacks[this.EVENTS.DataAvailable](blob);
    }
  }
}
Camera.prototype.addEventListener = function(eventName, callback, context) {
  const giveCallback = callback.bind(context);
  this._eventCallbacks[eventName] = giveCallback;
}
Camera.prototype.removeEventListener = function(eventName) {
  if(eventName in this._eventCallbacks) {
    this._eventCallbacks[eventName] = null;
  }
}
Camera.prototype.getVersion = function() {
  return this._attributes.version;
}

export default Camera;
