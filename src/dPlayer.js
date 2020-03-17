import "xgplayer";
import FlvPlayer from 'xgplayer-flv.js';
// import HlsJsPlayer from 'xgplayer-hls.js';

class PlayerSDK {
    constructor(options) {
        this.options ={
            //这里设置默认值
            autoplay:true,
            isLive:true,
            isStoped:false
        }
        this.options = Object.assign(this.options,options)   // 如果options中有默认的字段，则会覆盖this.options中字段的值
        this.initPlayer()
    }
    initPlayer(){
        if (this.options.isLive) {
            this.prototype = new FlvPlayer(this.options)
        } else {
            // this.prototype = new HlsJsPlayer(this.options)
        }
    }
    Events(event, fn) {
        switch (event) {
            case "PLAYER_INIT":
                this.prototype.on('ready', () => {
                    //console.log(this.prototype.video)   //对应vidoe标签，不晓得后面有什么用
                    if(fn) fn()
                });
                break;
            case "PLAYER_INIT_ERROR":
                this.prototype.on('error', (err) => {
                    if(fn) fn(err)
                });
                break;
            case "PLAYER_CAN_PLAY":
                this.prototype.on('canplay', () => {
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
            case "PLAYER_STOP":
                this.prototype.on('ended', () => {
                    fn()
                })
                break;
        }
    }
    playLive(){
        if(this.options.autoplay){
            this.prototype.switchURL(this.options.url)
        }else{
            this.prototype.start(this.options.url)
        }

    }
    play(){
        this.prototype.play()
    }
    pause(){
        this.prototype.pause()
    }
    stop(){
        this.prototype.destroy()
        document.getElementById(this.options.id).style.background = "black"
        this.isStoped = true
    }
    resume(){
        if(this.isStoped){
            //如果是停止播放，恢复播放需要重新加载
            this.initPlayer()
        }else{
            //暂停后恢复播放
            this.prototype.switchURL(this.options.url)
        }
        this.isStoped = false
    }
    switchLive(url){
        this.options.url = url
        this.prototype.switchURL(this.options.url)
    }
    setVolume(val){
        this.prototype.volume = val
    }
    destroy(boolean){
        if(boolean == false) this.prototype.destroy(false)
        else this.prototype.destroy()
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

            })
            if(fn) return fn()
        })

    }

}
export default PlayerSDK
