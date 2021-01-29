
const optionsRtm = {
    // Pass your app ID here.
    appId: "7043ebacbee442b3a23bcd8feadb176f",
    // Set the channel name.
    channel: "test",
    // Pass a token if your project enables the App Certificate.
    token: '0067043ebacbee442b3a23bcd8feadb176fIADmvZIpdNiAcqfpB3CtmWBbeU6hdnv6KuZ7WkhApX/XzQx+f9gAAAAAEABI+NBcqPMUYAEAAQCo8xRg',
    // Set the user role in the channel.
    role: "host",

    rtmToken: '0067043ebacbee442b3a23bcd8feadb176fIADrdC6GxS8f+OTWPS1A1PGT1FBqAgBqn3NyyzBzDxL+bxw69csAAAAAEAAfbsCyI/MUYAEA6APjHxlg'
};

let rtmChannel;
const commentsArr = [];

function renderComments(val, uid){
    const commentList = document.getElementById('commentList');
    if(uid) {
        commentList.insertAdjacentHTML('beforebegin', `<div class="chatMsg"><span>${uid}</span>${val}</div>`); 
    } else {
        commentList.insertAdjacentHTML('beforebegin', `<div class="chatMsg"><span>You</span>${val}</div>`); 
    }
    if (commentsArr.length > 10) {
        document.getElementsByClassName('chatMsg')[0].remove()
    }
}

function sendMsg (){
    const val = document.getElementById('commentBox').value;
    rtmChannel
      .sendMessage({ text: val })
      .then(() => {
        console.log("Success sent!", val);
        document.getElementById('commentBox').value = '';
        commentsArr.push(val);
        console.log(commentsArr);
        renderComments(val, null);
      })
      .catch((error) => {
        console.log(error);
      });
}


async function startBasicRtmCall () {
    const client = AgoraRTM.createInstance(optionsRtm.appId); 

    await client.on('ConnectionStateChanged', (newState, reason) => {
        console.log('on connection state changed to ' + newState + ' reason: ' + reason);
    });
    
    await client.login({ token: optionsRtm.rtmToken, uid: '12345' }).then(() => {
        console.log('AgoraRTM client login success');
    }).catch(err => {
        console.log('AgoraRTM client login failure', err);
    });

    rtmChannel = await client.createChannel("test");
    await rtmChannel.join();

    console.log(rtmChannel.getMembers())

    rtmChannel.on("ChannelMessage", (data, uid) => {
        console.log("Success Recvd", data, uid);
        commentsArr.push(data.text);
        renderComments(data.text, uid);
    });    
};


