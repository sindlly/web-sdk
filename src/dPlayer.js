import "xgplayer";
import FlvPlayer from 'xgplayer-flv.js';
import HlsJsPlayer from 'xgplayer-hls.js';

class PlayerSDK {
    constructor(options) {
        this.options ={
            //这里设置默认值
            autoplay:true,
            isLive:true,
            isStoped:false,
            controls: true,
            fluid:true,
            closeVideoClick: true,
            closeVideoDblclick: true,
            closeVideoTouch: true,
            closePlayerBlur: true,
            closeControlsBlur: true,
            closeFocusVideoFocus: true,
            closePlayVideoFocus: true,
            channel_id: "",
            device_id: "",
            product_id: "",
            video_id:'',
            play_type: 2,
            socketServer:'' //获取token的 ws服务端地址
        }
        this.mediaRecorder = null
        this.chunks = [];   //存放音频
        this.options = Object.assign(this.options,options)   // 如果options中有默认的字段，则会覆盖this.options中字段的值
        this.obj = {};
        this.$on("playHls",()=>{
            console.log("playHls")
        })
        this.initPlayer()
        this.WS = null
        this.connectServer()
    }
    initPlayer(){
        if (this.options.isLive) {
            this.prototype = new FlvPlayer(this.options)
            this.Events("PLAYER_INIT",()=>{
                this.Events("PLAYER_PLAYING")
                this.Events("PLAYER_PLAY_LOADING")
            })
        } else {
            this.prototype = new HlsJsPlayer(this.options)
        }
    }
    Events(event, fn) {
        switch (event) {
            case "PLAYER_INIT":
                this.prototype.on('complete', () => {
                    //console.log(this.prototype.video)   //对应vidoe标签，不晓得后面有什么用
                    if(document.getElementsByClassName("xgplayer-enter")[0]!= undefined)
                        document.getElementsByClassName("xgplayer-enter")[0].remove()
                    if(document.getElementsByClassName("xgplayer-start")[0]!= undefined)
                        document.getElementsByClassName("xgplayer-start")[0].remove()
                    if(document.getElementsByClassName("xgplayer-loading")[0]!= undefined)
                        document.getElementsByClassName("xgplayer-loading")[0].remove()
                    if(document.getElementsByClassName("xgplayer-replay")[0]!= undefined)
                        document.getElementsByClassName("xgplayer-replay")[0].remove()
                    if(document.getElementsByClassName("xgplayer-error")[0]!= undefined)
                        document.getElementsByClassName("xgplayer-error")[0].remove()
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
                this.prototype.on('playing', () => {
                    if(fn) fn()
                })
                break;
            case "PLAYER_PAUSE":
                this.prototype.on('pause', () => {
                    if(fn) fn()
                })
                break;
            case "PLAYER_PLAY_LOADING":
                this.prototype.on('waiting', () => {
                    if(fn) fn()
                })
                break;
            case "destroy":
                this.prototype.on('destroy', () => {
                    if(fn) fn()
                })
                break;
            case "PLAYER_STOP":
                this.prototype.on('ended', () => {
                    if(fn) fn()
                })
                break;
            case "PLAYER_TIME_CHANGE ":
                this.prototype.on('timeupdate', () => {
                    if(fn) fn()
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
        this.isStoped = true
    }
    resume(){
        if(this.isStoped){
            //如果是停止播放，恢复播放需要重新加载
            this.initPlayer()
        }else{
            //暂停后恢复播放
            this.prototype.switchURL(this.options.url)
            this.prototype.emit('waiting')
        }
        this.isStoped = false
    }
    setVolume(val){
        this.prototype.volume = val
    }
    destroy(boolean){
        if(boolean == false) this.prototype.destroy(false)
        else this.prototype.destroy()
    }
    getCssFullscreen(){
        this.prototype.getCssFullscreen()
    }
    exitCssFullscreen(){
        this.prototype.exitCssFullscreen()
    }
    playAtTime(start_time,end_time,urlData){
        // this.$emit("playHls")
        let currentTime = null   //开始播放的时间点
        let activeIndex = null  //播放视频的指针

        urlData.map((item,index) =>{
            if(this.timeToStamp(start_time)>=this.timeToStamp(item.start_time) && this.timeToStamp(start_time)<this.timeToStamp(item.end_time)){
                activeIndex = index
                currentTime = this.timeToStamp(start_time) - this.timeToStamp(item.start_time)
            }
        })
        //通过URL获取pid did
        let temp = urlData[activeIndex].hls_url.split("vod/")[1]
        this.options.product_id = temp.split("/")[0]
        this.options.device_id = temp.split("/")[1].split("_")[0]
        this.options.channel_id = temp.split("/")[1].split("_")[1]
        this.options.video_id = urlData[activeIndex].videoid
        this.getHlsPlayToken().then(res=>{
            let token = res
            console.log("应播放第"+(activeIndex+1)+"个视频")
            this.prototype.destroy()
            this.prototype.once('destroy',()=>{
                this.options.url = urlData[activeIndex].hls_url+"?token="+token
                this.options.isLive = false   //切换为hls
                this.initPlayer()
                this.prototype.on("complete",()=>{
                    this.prototype.currentTime = currentTime
                })
                this.prototype.on("ended",()=>{
                    if(activeIndex == urlData.length){
                        //最后一个视频段，触发更新列表事件
                    }else{
                        //播放下一个视频 ，todo 获取新的的token组成url
                        let temp2 = urlData[activeIndex+1].hls_url.split("vod/")[1]
                        this.options.product_id = temp2.split("/")[0]
                        this.options.device_id = temp2.split("/")[1].split("_")[0]

                        this.options.channel_id = temp2.split("/")[1].split("_")[1]
                        this.options.video_id = urlData[activeIndex+1].videoid
                        this.getHlsPlayToken().then(res=>{
                            this.prototype.src = urlData[activeIndex+1].hls_url+"?token="+res
                        })
                    }
                })
            })
        })


    }
    isSupportAudioTalk(){
        if(!navigator.mediaDevices.getUserMedia){
            console.log("浏览器不支持对讲功能")
        }
    }
    initTalk(fn){
        const constraints = { audio: true };
        navigator.mediaDevices.getUserMedia(constraints).then(
            stream => {
                this.mediaRecorder =  new MediaRecorder(stream,{mimeType:'audio/webm'});
                this.startTalk()
                if(fn) fn()
            },
            () => {
                this.$emit("AudioTalkFailed")
            }
        );
    }
    startTalk(){
        this.mediaRecorder.start(1000);
        this.mediaRecorder.onstart  = (e)=> {
            //后面就在这里推送
            console.log("开始录音" )
            this.mediaRecorder.requestData()
        };
        this.mediaRecorder.onstop  = (e)=>  {
            //后面就在这里推送
            console.log("录音结束" )
        };
        this.mediaRecorder.ondataavailable  =(e)=>  {
            //后面就在这里推送
            console.log("有数据了" )
            this.chunks.push(ACC.parse(e.data));
        };
    }
    stopTalk(){
        this.mediaRecorder.stop();
        console.log(this.chunks)
        let audio = document.getElementById('audio')
        let blob = new Blob(this.chunks,{'type':'audio / ogg; codecs = opus'});
        let audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
    }
    connectServer(){
        this.WS = new WebSocket("ws://172.19.3.59:18888/ws/devices?token=test");
        let socket = new WebSocket("ws://172.19.3.59:18888/ws/devices?token=test");
        this.WS.onopen =  ()=> {
            console.log("websocket open")
        };
    }

    async getHlsPlayToken(){
        let message = {
            "cmd": "get_token",
            "data": {
                "play_type": 2,
                "device_id": this.options.device_id,
                "product_id": this.options.product_id,
                "channel_id": this.options.channel_id,
                "video_id": this.options.video_id
            }
        }
        let token  = "sa"
        this.WS.send(JSON.stringify(message));
        await new Promise((resolve) =>
        {
            this.WS.onmessage = (event)=> {
                token = JSON.parse(event.data).data.token
                resolve();
            };
        });
        return token
    }

    //工具方法
    //格式化时间转时间戳(s)
    timeToStamp(formatDate){
        return parseInt((new Date(formatDate)).valueOf()/1000)
    }


    $on (name,fn){
        if(!this.obj[name]){
            this.obj[name] = [];
        }
        this.obj[name].push(fn);
    }

    $emit(name,val){
        if(this.obj[name]){
            this.obj[name].map((fn)=>{
                fn(val);
            });
        }
    }

    $off (name,fn){
        if(this.obj[name]){
            if(fn){
                let index = this.obj[name].indexOf(fn);
                if(index > -1){
                    this.obj[name].splice(index,1);
                }
            }else{
                this.obj[name].length = 0;
                //设长度为0比obj[name] = []更优，因为如果是空数组则又开辟了一个新空间，设长度为0则不必开辟新空间
            }
        }
    }

}
export default PlayerSDK
