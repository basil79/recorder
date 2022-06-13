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

  function getTimestamp() {
    return new Date().getTime();
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


  // Screen
  const screen = new adserve.tv.Screen(document.getElementById('video-screen'));
  console.log('Screen version is', screen.getVersion());

  const startScreenButton = document.getElementById('button-start-screen');
  const stopScreenButton = document.getElementById('button-stop-screen');

  startScreenButton.addEventListener('click', (event) => {
    screen.start();
  }, false);

  stopScreenButton.addEventListener('click', (event) => {
    screen.stop();
  }, false);





  const microphoneBlobs = [];
  const cameraBlobs = [];
  const screenBlobs = [];


  let recording = false;

  // ondataavailable
  microphone.addEventListener('DataAvailable', (blob) => {
    //appendLog('microphone - successfully recorder ' + blob.size + ' bytes of ' + blob.type);
    microphoneBlobs.push(blob);
  });

  camera.addEventListener('DataAvailable', (blob) => {
    //appendLog('camera - successfully recorder ' + blob.size + ' bytes of ' + blob.type);
    /*cameraBlobs.push({
      time: getTimestamp(),
      data: blob
    });
     */
    cameraBlobs.push(blob);
  });

  screen.addEventListener('DataAvailable', (blob) => {
    //appendLog('screen - successfully recorder ' + blob.size + ' bytes of ' + blob.type);
    screenBlobs.push(blob);
  });


  // TODO:
  // Recording
  const startRecordingButton = document.getElementById('button-start-recording');
  const stopRecordingButton = document.getElementById('button-stop-recording');

  startRecordingButton.addEventListener('click', (event) => {
    recording = true;

    microphone.startRecording();
    camera.startRecording();
    screen.startRecording();



  }, false);

  stopRecordingButton.addEventListener('click', (event) => {
    recording = false;

    microphone.stopRecording();
    camera.stopRecording();
    screen.stopRecording();

    setTimeout(() => {
      console.log(microphoneBlobs, cameraBlobs, screenBlobs);
    }, 1000);

  }, false);

})();
