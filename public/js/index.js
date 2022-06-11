(function() {

  const camera = new adserve.tv.Camera(document.getElementById('video-camera'));
  console.log('Camera version is', camera.getVersion());

  // Camera
  const startCameraButton = document.getElementById('button-start-camera');
  const stopCameraButton = document.getElementById('button-stop-camera');

  startCameraButton.addEventListener('click', (event) => {
    camera.start();
  }, false);

  stopCameraButton.addEventListener('click', (event) => {
    camera.stop();
  }, false);


  const screenCapture = new adserve.tv.ScreenCapture(document.getElementById('video-screen'));
  console.log('ScreenCapture version is', screenCapture.getVersion());

  // Screen Capture
  const startScreenCaptureButton = document.getElementById('button-start-screen-capture');
  const stopScreenCaptureButton = document.getElementById('button-stop-screen-capture');

  startScreenCaptureButton.addEventListener('click', (event) => {
    screenCapture.start();
  }, false);

  stopScreenCaptureButton.addEventListener('click', (event) => {
    screenCapture.stop();
  }, false);



  // Recording
  const startRecordingButton = document.getElementById('button-start-recording');
  const stopRecordingButton = document.getElementById('button-stop-recording');

  startRecordingButton.addEventListener('click', (event) => {
    camera.startRecording();
  }, false);

  stopRecordingButton.addEventListener('click', (event) => {
    camera.stopRecording();
  }, false);

})();
