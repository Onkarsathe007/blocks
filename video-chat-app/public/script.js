const socket = io();
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startCallBtn = document.getElementById("startCall");

let localStream;
let peerConnection;
const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }] // STUN server for NAT traversal
};

// ✅ Request camera & microphone access for BOTH users
async function getMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error("Error accessing media devices.", error);
    }
}

// ✅ Call getMedia() immediately to request permissions
getMedia();

startCallBtn.addEventListener("click", async () => {
    await startCall();
});

async function startCall() {
    peerConnection = new RTCPeerConnection(config);

    // ✅ Add local stream to the connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // ✅ Handle remote stream
    peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
    };

    // ✅ Send ICE candidates to the other peer
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("candidate", event.candidate);
        }
    };

    // ✅ Create and send an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
}

// ✅ When an offer is received, handle it
socket.on("offer", async (offer) => {
    peerConnection = new RTCPeerConnection(config);

    // ✅ Request camera & microphone on receiving offer
    await getMedia();

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("candidate", event.candidate);
        }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer", answer);
});

// ✅ When an answer is received, set it
socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

// ✅ When an ICE candidate is received, add it
socket.on("candidate", async (candidate) => {
    if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
});
