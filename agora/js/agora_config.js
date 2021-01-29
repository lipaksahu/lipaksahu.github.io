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
    token: '0067043ebacbee442b3a23bcd8feadb176fIADmvZIpdNiAcqfpB3CtmWBbeU6hdnv6KuZ7WkhApX/XzQx+f9gAAAAAEABI+NBcqPMUYAEAAQCo8xRg',
    // Set the user role in the channel.
    role: "host"
};
  
async function startBasicCall() {
/**
 * Put the following code snippets here.
 */
    
    const client = await AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    let remoteContainer= document.getElementById("videoPlayer");

    // Set role as "host" or "audience".
    client.setClientRole(options.role);

    const uid = await client.join(options.appId, options.channel, options.token, null);

    client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        const videoTrack = user.videoTrack;
        videoTrack.play(remoteContainer);
    });

};

async function start() {
    await startBasicCall();
    await startBasicRtmCall();
}

start();