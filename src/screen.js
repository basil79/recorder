import {IS_SAFARI} from './browser';
import {arrayBufferToBlob} from './utils';

const Screen = function(el, options) {

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
      video: {
        cursor: 'always'
      },
      audio: false
    }
  }, options)
}
Screen.prototype.start = async function() {
  console.log('screen - start');
  try {
    this._stream = await navigator.mediaDevices.getDisplayMedia(this._options.media);
    // use the stream
    this._videoSlot.srcObject = this._stream;
    this.dump();

    this._attributes.isStarted = true;
  } catch (e) {
    console.log(e);
    this._attributes.isStarted = false;
  }
}
Screen.prototype.stop = function() {
  console.log('screen - stop');
  try {
    const tracks = this._videoSlot.srcObject.getTracks();
    console.log(tracks);
    tracks.forEach(track => track.stop());
    this._videoSlot.srcObject = null;
  } catch (e) {}
  this._attributes.isStarted = false;
}
Screen.prototype.dump = function() {
  const videoTrack = this._videoSlot.srcObject.getVideoTracks()[0];
  console.log(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.log(JSON.stringify(videoTrack.getConstraints(), null, 2));
}
Screen.prototype.startRecording = function() {
  if(this._attributes.isStarted && this._stream) {
    console.log('screen - start recording');
    this._mediaRecorder = new MediaRecorder(this._stream);
    this._videoChunks = [];

    this._mediaRecorder.addEventListener('dataavailable', (event) => {
      if(event.data.size > 0) {
        // Blob
        const recordedBlob = arrayBufferToBlob(event.data, this._attributes.mimeType);
        console.log('screen - successfully recorded', recordedBlob.size, 'bytes of', recordedBlob.type, recordedBlob);

        this._videoChunks.push(recordedBlob); // TODO: remove
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
Screen.prototype.stopRecording = function() {
  if(this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
    console.log('screen - stop recording');
    this._mediaRecorder.stop();
    console.log(this._mediaRecorder.state);
  }
}
Screen.prototype.onDataAvailable = function(blob) {
  if(this.EVENTS.DataAvailable in this._eventCallbacks) {
    if(typeof this._eventCallbacks[this.EVENTS.DataAvailable] === 'function') {
      this._eventCallbacks[this.EVENTS.DataAvailable](blob);
    }
  }
}
Screen.prototype.requestData = function() {
  if(this._mediaRecorder && this._mediaRecorder.state !== 'recording') {
    return this._mediaRecorder.requestData();
  }
}
Screen.prototype.addEventListener = function(eventName, callback, context) {
  const giveCallback = callback.bind(context);
  this._eventCallbacks[eventName] = giveCallback;
}
Screen.prototype.removeEventListener = function(eventName) {
  if(eventName in this._eventCallbacks) {
    this._eventCallbacks[eventName] = null;
  }
}
Screen.prototype.getVersion = function() {
  return this._attributes.version;
}

export default Screen;
