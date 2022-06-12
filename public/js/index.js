(function() {


  const clearLogsButton = document.getElementById('clear-logs-button');
  // Logs
  const logs = document.getElementById('logs');

  clearLogsButton.addEventListener('click', function() {
    logs.innerHTML = '';
  }, false);

  function appendLog(text) {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
    var logItem = document.createElement('li');
    logItem.innerHTML = time + ' ' + text;
    logs.appendChild(logItem);
  }


  // Microphone
  const microphone = new adserve.tv.Microphone(document.getElementById('audio-microphone'));
  console.log('Microphone version is', microphone.getVersion());

  const startMicrophoneButton = document.getElementById('button-start-microphone');
  const stopMicrophoneButton = document.getElementById('button-stop-microphone');

  startMicrophoneButton.addEventListener('click', (event) => {
    microphone.start();
  }, false);

  stopMicrophoneButton.addEventListener('click', (event) => {
    microphone.stop();
  }, false);

  // Camera
  const camera = new adserve.tv.Camera(document.getElementById('video-camera'));
  console.log('Camera version is', camera.getVersion());

  const startCameraButton = document.getElementById('button-start-camera');
  const stopCameraButton = document.getElementById('button-stop-camera');

  startCameraButton.addEventListener('click', (event) => {
    camera.start();
  }, false);

  stopCameraButton.addEventListener('click', (event) => {
    camera.stop();
  }, false);


  // Screen Capture
  const screenCapture = new adserve.tv.ScreenCapture(document.getElementById('video-screen'));
  console.log('ScreenCapture version is', screenCapture.getVersion());

  const startScreenCaptureButton = document.getElementById('button-start-screen-capture');
  const stopScreenCaptureButton = document.getElementById('button-stop-screen-capture');

  startScreenCaptureButton.addEventListener('click', (event) => {
    screenCapture.start();
  }, false);

  stopScreenCaptureButton.addEventListener('click', (event) => {
    screenCapture.stop();
  }, false);


  // ondataavailable
  microphone.addEventListener('DataAvailable', (blob) => {
    appendLog('microphone - successfully recorder ' + blob.size + ' bytes of ' + blob.type);
  });

  camera.addEventListener('DataAvailable', (blob) => {
    appendLog('camera - successfully recorder ' + blob.size + ' bytes of ' + blob.type);
  });

  screenCapture.addEventListener('DataAvailable', (blob) => {
    appendLog('screen - successfully recorder ' + blob.size + ' bytes of ' + blob.type);
  });


  // TODO:
  // Recording
  const startRecordingButton = document.getElementById('button-start-recording');
  const stopRecordingButton = document.getElementById('button-stop-recording');

  startRecordingButton.addEventListener('click', (event) => {

  }, false);

  stopRecordingButton.addEventListener('click', (event) => {

  }, false);

})();
