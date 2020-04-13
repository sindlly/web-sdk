navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
}).then(function(stream) {
    recorder = new Recorder(stream, ws, {});
    recorder && recorder.start();
});
