import "xgplayer";
import FlvPlayer from 'xgplayer-flv.js';
import HlsJsPlayer from 'xgplayer-hls.js';

class PlayerSDK {
    constructor(options) {
        this.options = options
        this.initPlayer()
    }
    initPlayer(){
        // this.prototype =null
        if (this.options.isLive) {
            this.prototype = new FlvPlayer(this.options)
        } else {
            this.prototype = new HlsJsPlayer(this.options)
        }
    }
    Events(event, fn) {
        switch (event) {
            case "PLAYER_INIT":
                this.prototype.on('ready', () => {
                    console.log('PLAYER_INIT')
                    //console.log(this.prototype.video)   //对应vidoe标签，不晓得后面有什么用
                    if(fn) fn()
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
            case "destroy":
                this.prototype.on('destroy', () => {
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
    switchPlayType(type,url,fn) {
        this.prototype.destroy()
        this.prototype.once('destroy',()=>{
            this.options.url = url
            if (type == "flv") {
                this.options.isLive = true
            } else {
                this.options.isLive = false
            }
            this.initPlayer()
            this.prototype.on('play', () => {
                console.log("newPlay")
            })
            if(fn) return fn()
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
