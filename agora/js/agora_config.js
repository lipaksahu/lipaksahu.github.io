const rtc = {
    // For the local client.
    client: null,
    // For the local audio and video tracks.
    localAudioTrack: null,
    localVideoTrack: null,
};

const injectStreamConfig = {
    width: 0,
    height: 0,
    videoGop: 30,
    videoFramerate: 15,
    videoBitrate: 400,
    audioSampleRate: 44100,
    audioChannels: 1,
  };
  
const options = {
    // Pass your app ID here.
    appId: "7043ebacbee442b3a23bcd8feadb176f",
    // Set the channel name.
    channel: "test",
    // Pass a token if your project enables the App Certificate.
    token: '0067043ebacbee442b3a23bcd8feadb176fIAAUT15STamjwZYHG4Fi4t15owbY3bLs2vgEDpBDxru+Bgx+f9gAAAAAEAC0V+LrAEYSYAEAAQAARhJg',
    // Set the user role in the channel.
    role: "host"
};

let remoteContainer= document.getElementById("me");

function addVideoStream(streamId){
    let streamDiv=document.createElement("div"); // Create a new div for every stream
    streamDiv.id=streamId;                       // Assigning id to div
    streamDiv.style.transform="rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
    remoteContainer.appendChild(streamDiv);      // Add new div to container
}
  
async function startBasicCall() {
/**
 * Put the following code snippets here.
 */
    
    const client = await AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    // Set role as "host" or "audience".
    client.setClientRole(options.role);

    const uid = await client.join(options.appId, options.channel, options.token, null);

    // const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    // Create a video track from the video captured by a camera.
    // const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    // await client.publish([localAudioTrack, localVideoTrack]);
    // await client.publish([localVideoTrack]);

    console.log("publish success!", uid);

    console.log("client",client);
    

    client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("user", user);
        const videoTrack = user.videoTrack;
        videoTrack.play(remoteContainer);
        //     // Play the video
        //     videoTrack.play(remoteContainer);
        // user.videoTrack.play(remoteContainer);
        // Initiate the subscription
        // await client.subscribe(user, mediaType);
        
        // If the subscribed track is an audio track
        // if (mediaType === "audio") {
        //     const audioTrack = user.audioTrack;
        //     // Play the audio
        //     audioTrack.play();
        // } else {
        //     const videoTrack = user.videoTrack;
        //     // Play the video
        //     videoTrack.play(remoteContainer);
        // }
    });

    

    // Inject an online media stream.
    // await client.addInjectStreamUrl("rtsp://192.168.43.53:8080/video/H264", injectStreamConfig).then(() => {
    //     console.log("add inject stream url success");
    // }).catch(e => {
    //     console.log("add inject stream failed", e);
    // });

    // client.on("user-published", async (user, mediaType) => {
    //     // Subscribe to a remote user.
    //     await rtc.client.subscribe(user, mediaType);
    //     console.log("subscribe success");
      
    //     // If the subscribed track is video.
    //     if (mediaType === "video") {
    //       // Get `RemoteVideoTrack` in the `user` object.
    //       const remoteVideoTrack = user.videoTrack;
    //       // Dynamically create a container in the form of a DIV element for playing the remote video track.
    //       const playerContainer = document.createElement("div");
    //       // Specify the ID of the DIV container. You can use the `uid` of the remote user.
    //       playerContainer.id = user.uid.toString();
    //       playerContainer.style.width = "640px";
    //       playerContainer.style.height = "480px";
    //       document.body.append(playerContainer);
      
    //       // Play the remote video track.
    //       // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
    //       remoteVideoTrack.play(playerContainer);
      
    //       // Or just pass the ID of the DIV container.
    //       // remoteVideoTrack.play(playerContainer.id);
    //     }
      
    //     // If the subscribed track is audio.
    //     if (mediaType === "audio") {
    //       // Get `RemoteAudioTrack` in the `user` object.
    //       const remoteAudioTrack = user.audioTrack;
    //       // Play the audio track. No need to pass any DOM element.
    //       remoteAudioTrack.play();
    //     }
    //   });

}

startBasicCall();



