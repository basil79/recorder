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
  this._videoChunks = [];

  // Events
  this.EVENTS = {
    StartRecording: 'StartRecording',
    StopRecording: 'StopRecording',
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
    timeSlice: 5000, // ms
    media: {
      video: true,
      audio: false
    }
  }, options);
}
Camera.prototype.start = async function() {
  console.log('camera - start');
  try {
    this._stream = await navigator.mediaDevices.getUserMedia(this._options.media);
    // use the stream
    this._videoSlot.srcObject = this._stream;
    this.dump();

    this._attributes.isStarted = true;
  } catch (e) {
    console.log(e);
    this._attributes.isStarted = false;
  }
}
Camera.prototype.stop = function() {
  console.log('camera - stop');
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
Camera.prototype.startRecording = function() {
  if(this._attributes.isStarted && this._stream) {
    console.log('camera - start recording');
    this._mediaRecorder = new MediaRecorder(this._stream);
    this._videoChunks = [];

    this._mediaRecorder.addEventListener('dataavailable', (event) => {
      if(event.data.size > 0) {
        // Blob
        const recordedBlob = arrayBufferToBlob(event.data, this._attributes.mimeType);
        console.log('camera - successfully recorded', recordedBlob.size, 'bytes of', recordedBlob.type, recordedBlob);
        // TODO:
        this._videoChunks.push(recordedBlob);
        this.onDataAvailable(recordedBlob);
      }
    });
    this._mediaRecorder.addEventListener('stop', () => {
      // recording stopped & all blobs sent
      // TODO:
      console.log(this._videoChunks);
    });

    this._mediaRecorder.start(this._options.timeSlice);
    console.log(this._mediaRecorder.state);
  }
}
Camera.prototype.stopRecording = function() {
  if(this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
    console.log('camera - stop recording');
    this._mediaRecorder.stop();
    console.log(this._mediaRecorder.state);
  }
}
Camera.prototype.onDataAvailable = function(blob) {
  if(this.EVENTS.DataAvailable in this._eventCallbacks) {
    if(typeof this._eventCallbacks[this.EVENTS.DataAvailable] === 'function') {
      this._eventCallbacks[this.EVENTS.DataAvailable](blob);
    }
  }
}
Camera.prototype.requestData = function() {
  if(this._mediaRecorder && this._mediaRecorder.state !== 'recording') {
    return this._mediaRecorder.requestData();
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
