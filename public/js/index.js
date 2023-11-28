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


      (async () => {
        let type = cameraBlobs[0].type;
        let blob = new Blob(cameraBlobs, {
          type: type
        });
        let url = URL.createObjectURL(blob);
        previewScreen.src = url;

        let a = document.createElement('a');
        a.innerHTML = 'Download file';
        a.href = url;
        a.download = type.replace('.', '/');
        document.body.appendChild(a);




        /*
        // By chunks
        let chunk = await blobToArrayBuffer(cameraBlobs[0]);
        console.log(chunk);
        //transmitting(data, 'video/mp4'); //; codecs="avc1.42E01E, mp4a.40.2" // 'video/mp4; codecs="avc1.4D401F"'
        transmitting(chunk, 'video/webm; codecs="vorbis,vp8"');
         */

      })()
    }, 1000);

  }, false);





  const previewScreen = document.getElementById('preview-screen');
  const previewScreen2 = document.getElementById('preview-screen-2');

  let cache = [];
  let mediaSource, sourceBuffer;
  function transmitting(chunk, mimeCodec) {
    console.log('transmitting', chunk, mimeCodec);
    // init playing
    if(!mediaSource) {
      if (MediaSource.isTypeSupported(mimeCodec)) {
        mediaSource = new MediaSource();
        previewScreen2.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', function() {
          console.log(mediaSource.readyState); // open
          console.log('sourceopen', chunk, mimeCodec);
          sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
          sourceBuffer.mode = 'sequence';
          sourceBuffer.addEventListener('updateend', () => {
            //mediaSource.endOfStream();
            console.log(mediaSource.readyState); // ended
          });
          sourceBuffer.addEventListener('error', (event) => {
            console.error('sourceBuffer error:', event);
          });
          sourceBuffer.appendBuffer(Uint8Array.from(chunk));
        }, false);
      } else {
        console.error('Unsupported MIME type or codec', mimeCodec);
      }
    }
    // mediaSource not ready
    if(!sourceBuffer) {
      cache.push(chunk);
      return;
    }
    if(cache.length) {
      chunk = [...cache, chunk];
      cache = [];
    }
    console.log('appendBuffer');
    sourceBuffer.appendBuffer(Uint8Array.from(chunk));
  }



  /*
  let reader = new FileReader();
        let rawData = new ArrayBuffer();
        reader.loadend = function() {}
        reader.onload = function(e) {
            rawData = e.target.result;
            streamsocket.send(rawData)
        }
        reader.readAsArrayBuffer(data)
   */





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
