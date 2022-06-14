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


  // Devices
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices = devices.filter((d) => d.kind === 'audioinput');
    console.log(devices);
    console.log(devices[0].deviceId);
    //devices = devices.filter((d) => d.kind === 'videoinput');
  });


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
    cameraBlobs.push(blob);
  });

  screen.addEventListener('DataAvailable', async (blob) => {
    //appendLog('screen - successfully recorder ' + blob.size + ' bytes of ' + blob.type);
    screenBlobs.push(blob);

    //let data = await blobToArrayBuffer(blob);
    //transmitting(data, 'video/mp4'); //; codecs="avc1.42E01E, mp4a.40.2"
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





  const previewScreen = document.getElementById('preview-screen');

  let cache = [];
  let mediaSource, sourceBuffer;
  function transmitting(data, type) {
    console.log('transmitting', data, type);
    // init playing
    if(!mediaSource) {
      mediaSource = new MediaSource();
      previewScreen.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', () => {
        //sourceBuffer = mediaSource.addSourceBuffer(type);
        //previewScreen.play();
      });
    }
    // mediaSource not ready
    if(!sourceBuffer) {
      cache.push(data);
      return;
    }
    if(cache.length) {
      data = [...cache, data];
      cache = [];
    }
    sourceBuffer.appendBuffer(Uint8Array.from(data));
  }

  async function blobToArrayBuffer(blob) {
    if ('arrayBuffer' in blob) return await blob.arrayBuffer();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject;
      reader.readAsArrayBuffer(blob);
    });
  }

})();
