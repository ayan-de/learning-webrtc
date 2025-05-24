const constraints = { audio: false, video: true };

let peerConnection;
let localStream;
let remoteStream;

//created STUN servers
let servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
};

let init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia(constraints);

  document.getElementById("user-1").srcObject = localStream;
};

let createOffer = async () => {
  //creating peer connection
  peerConnection = new RTCPeerConnection(servers);

  //getting media stream from remoteSteam
  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = localStream;

  //adding our all media tracks to the peerconnection
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  //adding that track to the remote stream
  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  //ice candidate
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById("offer-sdp").value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  document.getElementById("offer-sdp").value = JSON.stringify(offer);
};

let createAnswer = async () => {
  //creating peer connection
  peerConnection = new RTCPeerConnection(servers);

  //getting media stream from remoteSteam
  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = localStream;

  //adding our all media tracks to the peerconnection
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  //adding that track to the remote stream
  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  //ice candidate
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById("answer-sdp").value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };

  let offer = document.getElementById("offer-sdp").value;

  if (!offer) return alert("Get offer from peer first");

  offer = JSON.parse(offer);
  await peerConnection.setRemoteDescription(offer);

  let answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  document.getElementById("answer-sdp").value = JSON.stringify(answer);
};

init();

document.getElementById("create-offer").addEventListener("click", createOffer);
document
  .getElementById("create-answer")
  .addEventListener("click", createAnswer);
