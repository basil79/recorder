import {arrayBufferToBlob} from './utils';
import {IS_SAFARI} from './browser';

const Microphone = function(el, options) {

  if(!(el instanceof Element || el instanceof HTMLDocument)) {
    throw new Error('microphone audio slot is not defined');
  }

  if(navigator.mediaDevices === undefined) {
    throw new Error('this browser doesn\'t support navigator.mediaDevices');
  }

  this._audioSlot = el;

  this._stream = null;
  this._mediaRecorder = null;
  this._audioChunks = [];

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
    isRecording: false,
    mimeType: IS_SAFARI ? 'audio/mp4' : 'audio/webm',
    version: '!!#Version#!!'
  }
  // Options
  this._options = Object.assign({
    timeSlice: 5000, // ms
    media: {
      audio: true
    }
  }, options);
}
Microphone.prototype.start = async function() {
  console.log('start microphone');
  try {
    this._stream = await navigator.mediaDevices.getUserMedia(this._options.media);
    // use the stream
    this._audioSlot.srcObject = this._stream;
    this.dump();

    this._attributes.isStarted = true;
  } catch (e) {
    console.log(e);
    this._attributes.isStarted = false;
  }
}
Microphone.prototype.stop = function() {
  console.log('stop microphone');
  try {
    const tracks = this._audioSlot.srcObject.getTracks();
    console.log(tracks);
    tracks.forEach(track => track.stop());
    this._audioSlot.srcObject = null;
  } catch (e) {}
  this._attributes.isStarted = false;
}
Microphone.prototype.dump = function() {
  const audioTrack = this._audioSlot.srcObject.getAudioTracks()[0];
  console.log(JSON.stringify(audioTrack.getSettings(), null, 2));
  console.log(JSON.stringify(audioTrack.getConstraints(), null, 2));
}
Microphone.prototype.startRecording = function() {
  if(this._attributes.isStarted && this._stream) {
    console.log('microphone - start recording');
    this._mediaRecorder = new MediaRecorder(this._stream);
    this._audioChunks = [];

    this._mediaRecorder.addEventListener('start', (e) => {
      console.log('microphone - recording start');
      this._attributes.isRecording = true;
    });
    this._mediaRecorder.addEventListener('dataavailable', (e) => {
      if(e.data.size > 0) {
        // Blob
        const recordedBlob = arrayBufferToBlob(e.data, this._attributes.mimeType);
        console.log('microphone - successfully recorded', recordedBlob.size, 'bytes of', recordedBlob.type, recordedBlob);

        this._audioChunks.push(recordedBlob); // TODO: remove
        this.onDataAvailable(recordedBlob);
      }
    });
    this._mediaRecorder.addEventListener('stop', () => {
      // recording stopped & all blobs sent
      console.log('microphone - recording stop');
      this._attributes.isRecording = false;
      console.log(this._audioChunks);
    });

    this._mediaRecorder.start(this._options.timeSlice);
    console.log(this._mediaRecorder.state);
  }
}
Microphone.prototype.stopRecording = function() {
  if(this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
    console.log('microphone - stop recording');
    this._mediaRecorder.stop();
    console.log(this._mediaRecorder.state);
  }
}
Microphone.prototype.onDataAvailable = function(blob) {
  if(this.EVENTS.DataAvailable in this._eventCallbacks) {
    if(typeof this._eventCallbacks[this.EVENTS.DataAvailable] === 'function') {
      this._eventCallbacks[this.EVENTS.DataAvailable](blob);
    }
  }
}
Microphone.prototype.requestData = function() {
  if(this._mediaRecorder && this._mediaRecorder.state !== 'recording') {
    return this._mediaRecorder.requestData();
  }
}
Microphone.prototype.addEventListener = function(eventName, callback, context) {
  const giveCallback = callback.bind(context);
  this._eventCallbacks[eventName] = giveCallback;
}
Microphone.prototype.removeEventListener = function(eventName) {
  if(eventName in this._eventCallbacks) {
    this._eventCallbacks[eventName] = null;
  }
}
Microphone.prototype.getVersion = function() {
  return this._attributes.version;
}

export default Microphone;
