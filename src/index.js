import _ from 'lodash';
import { PlayerSDK } from "./dPlayer";


function component() {
    var element = document.createElement('div');
    element.innerHTML = _.join(['<div id="mse">', '</div>', ' <button id="playFlv-btn">播放FLV','</div>','<button id="playHls-btn">播放HLS','</div>']);
    return element;
}
document.body.appendChild(component());
let hlsUrl = 'https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115840183862121584018448214.m3u8?token=KvL9AxDcKI3vD7YXeHmXU7gD7cImEQHvdcHUOziRDXD3UD2rSqLNgHeDmhKr-MQCYEtg2CDL10TsQxe1vfVOtrTgiyo2tsztZN1GHlIkq7jSSzinn6bwk2VxJGSB6KBf'
let flvUrl = 'https://v-test.cmcconenet.com:8443/live/live_25096185_1.flv?token=eyJrZXkiOjAsInNpZ24iOiJFZ2FSYjhpdC1mMW5EbHJxb19WQWdSQTRVU2k5OF9ZWkVfYmpyT0JwS1FCWGs2MzRvRUdIcDlFSTdvVVE0cFl2TFR2cVI5S2hCeTEwMFMwSE50Skg2WEhsanpYZ1N3M0ZVTGV0bkxwanAzUm9sang5VEYzaWZURFR6dGE5OHphQ0ZxRjE4aWdWenlTNDlHbHViUUhZbkxxSTBUYnF6c3ZGVWs5dHNfY0JxWU1FZHE2ekR5UjZ5am53cmlReFF0MEUifQ'
let player = new PlayerSDK({
    id: 'mse',
    cors:true,
    // isLive:true,
    autoplay:true,
    url:hlsUrl
});
player.initPlayer()
window.PlayerSDK = player
document.getElementById("playFlv-btn").onclick = ()=>{
    player.switchPlayType('flv',flvUrl)
}
document.getElementById("playHls-btn").onclick = ()=>{
    player.switchPlayType('hls',hlsUrl)
}



player.Events("PLAYER_INIT",()=>{
    console.log("PLAYER_INIT")
})
// player.Events("PLAYER_PLAY",()=>{
//     console.log("PLAYER_PLAY")
// })
// player.Events("PLAYER_PAUSE",()=>{
//     console.log("PLAYER_PAUSE")
// })
// player.Events("PLAYER_PLAY_LOADING",()=>{
//     console.log("PLAYER_PLAY_LOADING")
// })
