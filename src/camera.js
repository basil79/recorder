const Camera = function(el, options) {

  if(!(el instanceof Element || el instanceof HTMLDocument)) {
    throw new Error('screen video slot is not defined');
  }

  this._videoSlot = el;
  this._mediaRecorder = null;
  // Attributes
  this._attribute = {
    segmentSize: 5000, // ms
    version: '!!#Version#!!'
  }
  // Options
  this._options = Object.assign({
    video: true,
    audio: true
  }, options);
}
Camera.prototype.start = async function() {
  console.log('start camera');
  try {
    this._videoSlot.srcObject = await navigator.mediaDevices.getUserMedia(this._options);
    this.dump();
  } catch (e) {
    console.log(e);
  }
}
Camera.prototype.stop = function() {
  console.log('stop camera');
  const tracks = this._videoSlot.srcObject.getTracks();
  console.log(tracks);
  tracks.forEach(track => track.stop());
  this._videoSlot.srcObject = null;
}
Camera.prototype.dump = function() {
  const videoTrack = this._videoSlot.srcObject.getVideoTracks()[0];
  console.log(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.log(JSON.stringify(videoTrack.getConstraints(), null, 2));
}
Camera.prototype.startRecording = function() {
  console.log('start camera recording');
}
Camera.prototype.stopRecording = function() {
  console.log('stop camera recording');
}
Camera.prototype.getVersion = function() {
  return this._attribute.version;
}

export default Camera;
