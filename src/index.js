import PlayerSDK from "./dPlayer";
// import  PlayerSDK from "./PlayerSDK.min";
let hlsUrl = 'https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115844608046431584460869631.m3u8?token=eUTGOV1F7-EYp4Wuso5sritphG8plUhz3RxWpfBA3M-e0yunOa87xsKTr6k461u6sS0doQDNqH-2uGvw-TJmmME45RYc9_CSXY4cjcbs75JQRDdAS1M3B58lhi60YmHl'
let flvUrl = 'https://v-test-lzw-http-play-gl.cmcconenet.com:8443/live/live_33098500_1.flv?token=eyJrZXkiOjEzNiwic2lnbiI6Ikd1RmhjU2czb0U0ZWNwVUJDTklLdkJjWTZydG53MlZpUC1mVFBQV1dYMXhDWmV3ZGdtY0JjZkhOaHhBRjIwOGhfdEhfb0tmWXMxS2d3QWw4NWpJRWdwVUl2S0ZCYlRfNEJhZktZVDcwcWtJeXJ1by1hcnpFWEZIM25qYnl4aGk5RHBMNElSdkJvZVhfcVlmZE1ITk1HNG5HVE5oRml2MEhIWTVMWXhjUFJVcTFFOGhPZDlIRmVqOXBidkwzRWh4TDJYbWtxaklMTkpRR1VzaUgzTnBDU0EifQ'
let urlData = [{
        "duration": 1905,
        "end_time": "2020-03-23 09:57:45",
        "end_timestamp": 1584928665790,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849267512601584926813805.m3u8",
        "name": "33875316_1-1584926751260-1584926813805",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849267512601584926813805",
        "size": 101740524,
        "start_time": "2020-03-23 09:25:51",
        "start_timestamp": 1584926751260,
        "videoid": "33875316115849267512601584926813805"
    }, {
        "duration": 1915,
        "end_time": "2020-03-23 10:29:48",
        "end_timestamp": 1584930588090,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849286657901584928727800.m3u8",
        "name": "33875316_1-1584928665790-1584928727800",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849286657901584928727800",
        "size": 103033024,
        "start_time": "2020-03-23 09:57:45",
        "start_timestamp": 1584928665790,
        "videoid": "33875316115849286657901584928727800"
    }, {
        "duration": 401,
        "end_time": "2020-03-23 10:36:35",
        "end_timestamp": 1584930995612,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849305880901584930650082.m3u8",
        "name": "33875316_1-1584930588090-1584930650082",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849305880901584930650082",
        "size": 21727160,
        "start_time": "2020-03-23 10:29:48",
        "start_timestamp": 1584930588090,
        "videoid": "33875316115849305880901584930650082"
    }, {
        "duration": 1914,
        "end_time": "2020-03-23 11:17:28",
        "end_timestamp": 1584933448672,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849315277071584931590414.m3u8",
        "name": "33875316_1-1584931527707-1584931590414",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849315277071584931590414",
        "size": 103033776,
        "start_time": "2020-03-23 10:45:27",
        "start_timestamp": 1584931527707,
        "videoid": "33875316115849315277071584931590414"
    }, {
        "duration": 1927,
        "end_time": "2020-03-23 11:49:42",
        "end_timestamp": 1584935382965,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849334486721584933514675.m3u8",
        "name": "33875316_1-1584933448672-1584933514675",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849334486721584933514675",
        "size": 103814916,
        "start_time": "2020-03-23 11:17:28",
        "start_timestamp": 1584933448672,
        "videoid": "33875316115849334486721584933514675"
    }, {
        "duration": 1901,
        "end_time": "2020-03-23 12:21:31",
        "end_timestamp": 1584937291349,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849353829651584935446964.m3u8",
        "name": "33875316_1-1584935382965-1584935446964",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849353829651584935446964",
        "size": 102289860,
        "start_time": "2020-03-23 11:49:42",
        "start_timestamp": 1584935382965,
        "videoid": "33875316115849353829651584935446964"
    }, {
        "duration": 1912,
        "end_time": "2020-03-23 12:53:31",
        "end_timestamp": 1584939211313,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849372913491584937353339.m3u8",
        "name": "33875316_1-1584937291349-1584937353339",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849372913491584937353339",
        "size": 103431772,
        "start_time": "2020-03-23 12:21:31",
        "start_timestamp": 1584937291349,
        "videoid": "33875316115849372913491584937353339"
    }, {
        "duration": 1913,
        "end_time": "2020-03-23 13:25:31",
        "end_timestamp": 1584941131475,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849392113131584939271309.m3u8",
        "name": "33875316_1-1584939211313-1584939271309",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849392113131584939271309",
        "size": 103333824,
        "start_time": "2020-03-23 12:53:31",
        "start_timestamp": 1584939211313,
        "videoid": "33875316115849392113131584939271309"
    }, {
        "duration": 1895,
        "end_time": "2020-03-23 13:57:13",
        "end_timestamp": 1584943033679,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849411314751584941193519.m3u8",
        "name": "33875316_1-1584941131475-1584941193519",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849411314751584941193519",
        "size": 102579380,
        "start_time": "2020-03-23 13:25:31",
        "start_timestamp": 1584941131475,
        "videoid": "33875316115849411314751584941193519"
    }, {
        "duration": 1646,
        "end_time": "2020-03-23 14:24:45",
        "end_timestamp": 1584944685931,
        "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849430336791584943097662.m3u8",
        "name": "33875316_1-1584943033679-1584943097662",
        "rtmp_url": "rtmpe://testvideo1.cmcconenet.com:1936/vod/33713_33875316_1_33875316115849430336791584943097662",
        "size": 90120620,
        "start_time": "2020-03-23 13:57:13",
        "start_timestamp": 1584943033679,
        "videoid": "33875316115849430336791584943097662"
    }]
let player = new PlayerSDK({
    id: 'video',
    el: document.querySelector('#mse'),
    cors: true,
    url: flvUrl,
    fluid: false
});
// player.playAtTime("2020-03-23 10:45:27",'',urlData)
window.PlayerSDK = player
document.getElementById("playHls-btn").onclick = () => {
    player.playAtTime("2020-03-23 09:57:45",'2020-03-23 09:57:50',urlData)
}
document.getElementById("playHls-btn-other").onclick = () => {
    player.playAtTime("2020-03-23 09:25:51",'2020-03-23 09:26:51',urlData)
}

document.getElementById("play-btn").onclick = () => {
    player.playLive()
}
document.getElementById("pause-btn").onclick = () => {
    player.pause()
}

document.getElementById("playFlv-btn").onclick = () => {
    player.switchPlayType('flv', flvUrl, () => {
    })
}
document.getElementById("replayFlv-btn").onclick = () => {
    player.resume()
}
document.getElementById("stop-btn").onclick = () => {
    player.stop()
}
document.getElementById("fullscreen").onclick = () => {
    player.getCssFullscreen()
}
// document.getElementById("start-talk").onclick = () => {
//     player.initTalk()
// }
// document.getElementById("end-talk").onclick = () => {
//     player.stopTalk()
// }

player.Events("PLAYER_INIT", () => {
    // console.log("可以播放了")
})
player.Events("PLAYER_PLAY", () => {
    console.log("PLAYER_PLAY")
})
player.Events("PLAYER_PAUSE", () => {
    console.log("PLAYER_PAUSE")
})
// player.Events("PLAYER_PLAY_LOADING",()=>{
//     console.log("PLAYER_PLAY_LOADING")
// })
player.Events("PLAYER_INIT_ERROR", () => {
    console.log("PLAYER_INIT_ERROR")
})
player.Events("PLAYER_STOP", () => {
    console.log("PLAYER_STOP")
})
// player.Events("timeupdate",()=>{
//     console.log("timeupdate")
// })

