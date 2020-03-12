import "xgplayer";
import FlvPlayer from 'xgplayer-flv.js';
import HlsJsPlayer from 'xgplayer-hls.js';

class PlayerSDK {
    constructor(options) {
        this.options = options
    }
    initPlayer(){
        // this.prototype =null
        if (this.options.isLive) {
            this.prototype = new FlvPlayer(this.options)
        } else {
            this.prototype = new HlsJsPlayer(this.options)
        }
        this.Events("PLAYER_INIT", () => {
            console.log(this)
        })
    }
    Events(event, fn) {
        switch (event) {
            case "PLAYER_INIT":
                this.prototype.on('ready', () => {
                    console.log('PLAYER_INIT')
                    console.log(this.prototype.video)
                    fn()
                });
                break;
            case "PLAYER_PLAY":
                this.prototype.on('play', () => {
                    fn()
                })
                break;
            case "PLAYER_PAUSE":
                this.prototype.on('pause', () => {
                    fn()
                })
                break;
            case "PLAYER_PLAY_LOADING":
                this.prototype.on('waiting', () => {
                    fn()
                })
                break;
        }
    }
    play(){
        this.prototype.play()
    }
    pause(){
        this.prototype.pause()
    }
    switchPlayType(type, url) {
        this.prototype.destroy()
        this.prototype.once('destroy',()=>{
            this.options.url = url
            if (type == "flv") {
                this.options.isLive = true
            } else {
                this.options.isLive = false
            }
            this.initPlayer()
        })

    }

}

class flvPlayer extends FlvPlayer {
    constructor(options) {
        super(options)
        console.log("flvPlayer")
    }
}

class hlsPlayer extends HlsJsPlayer {
    constructor(options) {
        super(options)
        console.log("hlsPlayer")
    }
}

export {PlayerSDK}
