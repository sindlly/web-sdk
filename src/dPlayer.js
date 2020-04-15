import "xgplayer";
import FlvPlayer from 'xgplayer-flv.js';
import HlsJsPlayer from 'xgplayer-hls.js';
import lodash from 'lodash'

class PlayerSDK {
    constructor(options) {
        this.options = {
            //这里设置默认值
            autoplay: true,
            isLive: true,
            isStoped: false,
            controls: false,
            fluid: true,
            url: '',
            closeVideoClick: true,
            closeVideoDblclick: true,
            closeVideoTouch: true,
            closePlayerBlur: true,
            closeControlsBlur: true,
            closeFocusVideoFocus: true,
            closePlayVideoFocus: true,
            socketServer: '' //获取token的 ws服务端地址
        }
        this.flvUrl = JSON.parse(JSON.stringify(options.url))
        this.mediaRecorder = []
        this.chunks = [];   //存放音频
        this.options = Object.assign(this.options, options)   // 如果options中有默认的字段，则会覆盖this.options中字段的值
        this.obj = {};
        this.initPlayer()
        this.WS = null
        this.audioWs = null
        this.aIndex = 0
        this.aListIndex = 0
        this.audioWsUrl = 'ws://172.19.3.106:8080/ws/media/audio/live_33995609_1.flv?token=eyJrZXkiOjIzLCJzaWduIjoiRFg5enVmbHZ0N29rS2QzS1lFb2xpV1B6SWhvNEtCMnR4RVg3eDNPaFpmdlBpU2RQbDgyRUZxdkdXenJvZW1LTVpUc1I2NnBOeVZ4WVdJMGtpVmxPajNDTTdxR1dPbzgyVlJkYUJpTWQwbHpFaEIyVU04LUg1QkZVVVRJekl0MWxvcXRXRFQ2STZQVVpuMWp5UGVPd2VqQzJodkdvR3M0YUk4bXpDRE5FQVo0bHo4U1ZXeXVqcXNtaldxZ1lGdEFuIn0'
        this.connectServer()
    }

    initPlayer() {
        if (this.options.isLive) {
            this.options.url = JSON.parse(JSON.stringify(this.flvUrl))
            this.prototype = new FlvPlayer(this.options)
            this.Events("PLAYER_INIT", () => {
                this.Events("PLAYER_PLAYING")
                this.Events("PLAYER_PLAY_LOADING")
            })
            this.options.isLive = true
        } else {
            this.prototype = new HlsJsPlayer(this.options)
            this.options.isLive = false
            this.Events("PLAYER_INIT", () => {
                this.Events("PLAYER_PLAYING")
                this.Events("PLAYER_PLAY_LOADING")
            })
        }
    }

    Events(event, fn) {
        switch (event) {
            case "PLAYER_INIT":
                this.prototype.on('complete', () => {
                    //console.log(this.prototype.video)   //对应vidoe标签，不晓得后面有什么用
                    if (document.getElementsByClassName("xgplayer-enter")[0] != undefined)
                        document.getElementsByClassName("xgplayer-enter")[0].remove()
                    if (document.getElementsByClassName("xgplayer-start")[0] != undefined)
                        document.getElementsByClassName("xgplayer-start")[0].remove()
                    if (document.getElementsByClassName("xgplayer-loading")[0] != undefined)
                        document.getElementsByClassName("xgplayer-loading")[0].remove()
                    if (document.getElementsByClassName("xgplayer-replay")[0] != undefined)
                        document.getElementsByClassName("xgplayer-replay")[0].remove()
                    if (document.getElementsByClassName("xgplayer-error")[0] != undefined)
                        document.getElementsByClassName("xgplayer-error")[0].remove()
                    if (fn) fn()
                });
                break;
            case "PLAYER_INIT_ERROR":
                this.prototype.on('error', (err) => {
                    if (fn) fn(err)
                });
                break;
            case "PLAYER_CAN_PLAY":
                this.prototype.on('canplay', () => {
                    if (fn) fn()
                });
                break;
            case "PLAYER_PLAY":
                this.prototype.on('playing', () => {
                    if (fn) fn()
                })
                break;
            case "PLAYER_PAUSE":
                this.prototype.on('pause', () => {
                    if (fn) fn()
                })
                break;
            case "PLAYER_PLAY_LOADING":
                this.prototype.on('waiting', () => {
                    if (fn) fn()
                })
                break;
            case "destroy":
                this.prototype.on('destroy', () => {
                    if (fn) fn()
                })
                break;
            case "PLAYER_STOP":
                this.prototype.on('ended', () => {
                    if (fn) fn()
                })
                break;
            case "PLAYER_TIME_CHANGE ":
                this.prototype.on('timeupdate', () => {
                    if (fn) fn()
                })
                break;
            case "REVIEW_END":
                this.$on("REVIEW_END", () => {
                    if (fn) fn()
                })
        }
    }

    playLive() {
        if (this.options.autoplay) {
            this.prototype.switchURL(this.options.url)
        } else {
            this.prototype.start(this.options.url)
        }
    }

    play() {
        this.prototype.play()
    }

    pause() {
        this.prototype.pause()
    }

    stop() {
        this.prototype.destroy()
        this.isStoped = true
    }

    resume() {
        this.prototype.emit('waiting')
        if (this.options.isLive == true) {
            if (this.isStoped) {
                //如果是停止播放，恢复播放需要重新加载
                this.initPlayer()
            } else {
                //暂停后恢复播放
                this.prototype.switchURL(this.options.url)
                this.prototype.emit('waiting')
            }
            this.isStoped = false
        } else {
            //由回播恢复到直播
            this.prototype.destroy()
            this.prototype.once("destroy", () => {
                this.prototype = null
                this.options.isLive = true
                this.initPlayer()
            })
        }

    }

    setVolume(val) {
        this.prototype.volume = val
    }

    destroy(boolean) {
        if (boolean == false) this.prototype.destroy(false)
        else this.prototype.destroy()
    }

    getCssFullscreen() {
        this.prototype.getCssFullscreen()
    }

    exitCssFullscreen() {
        this.prototype.exitCssFullscreen()
    }

    playAtTime(start_time, end_time, urlData) {
        this.prototype.emit('waiting')
        let currentTime = null   //开始播放的时间点
        let endTime = null  //播放结束时间
        let activeIndex = null  //播放视频的指针
        let endTimeIndex = null //结束视频的指针

        urlData.map((item, index) => {
            if (this.timeToStamp(start_time) >= this.timeToStamp(item.start_time) && this.timeToStamp(start_time) < this.timeToStamp(item.end_time)) {
                activeIndex = index
                currentTime = this.timeToStamp(start_time) - this.timeToStamp(item.start_time)
            }
            if (end_time && this.timeToStamp(end_time) > this.timeToStamp(item.start_time) && this.timeToStamp(end_time) <= this.timeToStamp(item.end_time)) {
                endTime = this.timeToStamp(end_time) - this.timeToStamp(item.start_time)
                endTimeIndex = index
            }
        })
        //通过URL获取pid did
        let info = urlData[activeIndex].hls_url.split("vod/")[1]
        this.getHlsPlayToken(info).then(res => {
            let token = res
            // console.log("应播放第"+(activeIndex+1)+"个视频")
            if (this.options.isLive == true) {
                this.prototype.destroy()
                this.prototype.on('destroy', () => {
                    this.options.url = urlData[activeIndex].hls_url + "?token=" + token
                    this.options.isLive = false   //切换为hls
                    this.initPlayer()
                    this.prototype.on("complete", () => {
                        this.prototype.currentTime = currentTime
                        if (end_time) {
                            //如果有传入结束时间，则到时间后暂停播放
                            this.prototype.on("timeupdate", () => {
                                if (activeIndex == endTimeIndex && this.prototype.currentTime >= endTime) {
                                    this.prototype.pause()
                                    this.$emit("REVIEW_END")
                                }
                            })
                        }
                        this.prototype.on("ended", () => {
                            if (activeIndex == urlData.length - 1) {
                                //最后一个视频段，触发更新列表事件
                                this.$emit("REVIEW_END")
                            } else {
                                //播放下一个视频 ，获取新的的token组成url
                                activeIndex++
                                let next_info = urlData[activeIndex].hls_url.split("vod/")[1]
                                this.getHlsPlayToken(next_info).then(res => {
                                    this.prototype.src = urlData[activeIndex].hls_url + "?token=" + res
                                })
                            }
                        })
                    })
                })
            } else {
                this.options.url = urlData[activeIndex].hls_url + "?token=" + token
                this.prototype.src = this.options.url
                this.prototype.play()
                this.prototype.currentTime = currentTime
                if (end_time) {
                    //如果有传入结束时间，则到时间后暂停播放
                    this.prototype.on("timeupdate", () => {
                        if (activeIndex == endTimeIndex && this.prototype.currentTime >= endTime) {
                            this.prototype.pause()
                            this.$emit("REVIEW_END")
                        }
                    })
                }
                this.prototype.on("ended", () => {
                    if (activeIndex == urlData.length - 1) {
                        //最后一个视频段，触发更新列表事件
                        this.$emit("REVIEW_END")
                    } else {
                        //播放下一个视频 ，获取新的的token组成url
                        activeIndex++
                        let next_info = urlData[activeIndex].hls_url.split("vod/")[1]
                        this.getHlsPlayToken(next_info).then(res => {
                            this.prototype.src = urlData[activeIndex].hls_url + "?token=" + res
                        })
                    }
                })
            }


        })


    }

    isSupportAudioTalk() {
        if (!navigator.mediaDevices.getUserMedia) {
            console.log("浏览器不支持对讲功能")
        }
    }

    initTalk(fn) {
        this.isSupportAudioTalk()
        const constraints = {audio: true};
        navigator.mediaDevices.getUserMedia(constraints).then(
            stream => {
                console.log(MediaRecorder)
                let options = {
                    mimeType: 'audio/webm;codecs="Opus"',
                    audioBitsPerSecond: 48000,
                }
                this.mediaRecorder = new MediaRecorder(stream,options);
                this.audioWs = new WebSocket(this.audioWsUrl);
                this.audioWs.onmessage  = () => {
                    console.log("语音通道开启")
                    this.startTalk(stream,options)
                };
                this.audioWs.onerror= (e)=>{
                    debugger
                }
                this.audioWs.onclose= (e)=>{
                    debugger
                }
                if (fn) fn()
            },
            () => {
                this.$emit("AudioTalkFailed")
            }
        ).catch((err)=>{
          debugger
          console.log(err)
        });

    }

    startTalk(stream,options) {
        this.aListIndex = this.aListIndex>=8?0:this.aListIndex
        // let mIndex = this.aListIndex  // 用于循环存储语音
        let mIndex = 0  // 用于循环存储语音
        this.mediaRecorder.start(200);  //1000 表示1s一个数据
        this.mediaRecorder.onstart = (e) => {
            //后面就在这里推送
            console.log(`开始录音${mIndex}`)
            this.mediaRecorder.requestData()
        };
        this.mediaRecorder.onstop = (e) => {

            //后面就在这里推送
            console.log("录音结束")
            // this.audioWs.send("end")
        };
        let reader = new FileReader();
        this.mediaRecorder.ondataavailable = (e) => {
            //后面就在这里推送
            if(e.data.size > 0){
                let blob = new Blob([e.data], {'type': 'audio/webm'});
                reader.readAsArrayBuffer(blob);
                reader.onload = ()=>{
                    this.audioWs.send(reader.result)
                }
            }
            this.chunks.push(e.data);
        };
    }

    stopTalk() {
        this.mediaRecorder.stop();
        this.mediaRecorder.onstop = (res => {
            let audio = document.getElementById('audio')
            let download = document.getElementById('download')
            let blob = new Blob(this.chunks, {'type': 'audio/webm'});
            let audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            download.href = audioURL
            this.audioWs.close()
        })

    }

    connectServer() {
        this.WS = new WebSocket(this.options.socketServer || "ws://172.19.3.59:18888/ws/devices?token=test");
        this.WS.onopen = () => {
            // console.log("websocket open")
        };
    }

    async getHlsPlayToken(baseInfo) {
        let message = {
            "cmd": "get_token",
            "data": {
                "play_type": 2,
                "product_id": baseInfo.split("/")[0],
                "device_id": baseInfo.split("/")[1].split("_")[0],
                "channel_id": baseInfo.split("/")[1].split("_")[1],
                "video_id": baseInfo.split("/")[2].split(".")[0]
            }
        }
        let token
        this.WS.send(JSON.stringify(message));
        await new Promise((resolve) => {
            this.WS.onmessage = (event) => {
                token = JSON.parse(event.data).data.token
                resolve();
            };
        });
        return token
    }

    //工具方法
    //格式化时间转时间戳(s)
    timeToStamp(formatDate) {
        return parseInt((new Date(formatDate)).valueOf() / 1000)
    }

    //事件注册
    $on(name, fn) {
        if (!this.obj[name]) {
            this.obj[name] = [];
        }
        this.obj[name].push(fn);
    }

    $emit(name, val) {
        if (this.obj[name]) {
            this.obj[name].map((fn) => {
                fn(val);
            });
        }
    }

    $off(name, fn) {
        if (this.obj[name]) {
            if (fn) {
                let index = this.obj[name].indexOf(fn);
                if (index > -1) {
                    this.obj[name].splice(index, 1);
                }
            } else {
                this.obj[name].length = 0;
                //设长度为0比obj[name] = []更优，因为如果是空数组则又开辟了一个新空间，设长度为0则不必开辟新空间
            }
        }
    }

}

export default PlayerSDK
