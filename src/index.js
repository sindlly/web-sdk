import  PlayerSDK from "./playerSDK.min";

let hlsUrl = 'https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115839424033791583942488052.m3u8?token=kh8P1qywY7oEiLxi8osRYvYMK063KDpzWP8V2U0cdUOhIw2y9o8tXvtvO3BIVYW7RKGjskmKTaFKVfuTpa1WRgsNROlYQnFi4CL9mUi0_ZRWjpR58uStkdq9R3JzjpoQ'
let flvUrl = 'https://v-test.cmcconenet.com:8443/live/live_33098500_1.flv?token=eyJrZXkiOjcsInNpZ24iOiJMLU1keVkySWJLdUZVMlViNEs3MTRENmlLQlhhWXhxYk9YZ2trTWN2MElGZGNvTm1OOUxoek8yVFIzRUx4R3U2QXoxR3pyd3U0Q0M4ZjFyRFN2RGtDMlN2YU1ySS1JbWRJZ3FIOG5OREdEVkZhNnJCMGoySTFUeEg2MkNUSWh5cWZGQV9LSUlyVTJnOWFmcnZGZXFZZTFZT3BVcWpKbERnRXdhaWszdVhiSVl6OEo1Tks1amo2NEFhQl8tR05XX0YifQ'
console.log(PlayerSDK)
let player = new PlayerSDK({
    id: 'mse',
    cors:true,
    url:flvUrl
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
player.Events("PLAYER_PLAY_LOADING",()=>{
    console.log("PLAYER_PLAY_LOADING")
})
player.Events("PLAYER_INIT_ERROR",()=>{
    console.log("PLAYER_INIT_ERROR")
})
player.Events("PLAYER_STOP",()=>{
    console.log("PLAYER_STOP")
})
