const constraints = { audio: false, video: true };

let localStream;
let remoteStream;

let init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  remoteStream = new MediaStream();

  document.getElementById("user-1").srcObject = localStream;
  document.getElementById("user-2").srcObject = localStream;
};

init();
