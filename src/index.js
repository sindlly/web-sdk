// import  PlayerSDK from "./dPlayer";
import  PlayerSDK from "./PlayerSDK.min";
let hlsUrl = 'https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115844077128781584407787356.m3u8?token=LXANICbMwaOHAbfxugjyoRr0xGm1vCdvVuF0ITqOAhIsl2EOxAtL-Se86UG5oFozOEsCYD8cKkhMjQuSNKeWUf280QYZxvW7DQ2rfaKAUgjOmhleBrMR_GF_IW53O_s'
let flvUrl = 'https://v-test.cmcconenet.com:8443/live/live_25096185_1.flv?token=eyJrZXkiOjAsInNpZ24iOiJFZ2FSYjhpdC1mMW5EbHJxb19WQWdSQTRVU2k5OF9ZWkVfYmpyT0JwS1FCWGs2MzRvRUdIcDlFSTdvVVE0cFl2TFR2cVI5S2hCeTEwMFMwSE50Skg2WEhsanpYZ1N3M0ZVTGV0bkxwanAzUm9sang5VEYzaWZURFR6dGE5OHphQ0ZxRjE4aWdWenlTNDlHbHViUUhZbkxxSTBUYnF6c3ZGVWs5dHNfY0JxWU1FZHE2ekR5UjZ5am53cmlReFF0MEUifQ'
console.log(PlayerSDK)
let player = new PlayerSDK({
    id: 'mse',
    el:document.querySelector('#mse'),
    cors:true,
    url:flvUrl,
    fluid: true,
});
window.PlayerSDK = player
document.getElementById("play-btn").onclick = ()=>{
    player.playLive()
}
document.getElementById("pause-btn").onclick = ()=>{
    player.pause()
}

document.getElementById("playFlv-btn").onclick = ()=>{
    player.switchPlayType('flv',flvUrl,()=>{
        console.log(player)
    })
}
document.getElementById("playHls-btn").onclick = ()=>{
    player.switchPlayType('hls',hlsUrl,()=>{
        console.log("switch")
    })
}
document.getElementById("replayFlv-btn").onclick = ()=>{
    player.resume()
}
document.getElementById("stop-btn").onclick = ()=>{
    player.stop()
}
document.getElementById("fullscreen").onclick = ()=>{
    player.getCssFullscreen()
}

console.log(player)
player.Events("PLAYER_INIT",()=>{
    console.log("可以播放了")
})
player.Events("PLAYER_PLAY",()=>{
    console.log("PLAYER_PLAY")
})
player.Events("PLAYER_PAUSE",()=>{
    console.log("PLAYER_PAUSE")
})
// player.Events("PLAYER_PLAY_LOADING",()=>{
//     console.log("PLAYER_PLAY_LOADING")
// })
player.Events("PLAYER_INIT_ERROR",()=>{
    console.log("PLAYER_INIT_ERROR")
})
player.Events("PLAYER_STOP",()=>{
    console.log("PLAYER_STOP")
})
// player.Events("PLAYER_PLAYING",()=>{
//     console.log("PLAYER_PLAYING")
// })
// player.Events("timeupdate",()=>{
//     console.log("timeupdate")
// })
