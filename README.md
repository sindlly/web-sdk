# web-sdk 功能描述
## 引用 
>```
* import  PlayerSDK from "PlayerSDK.min";
>```
## 初始化
>```
>let player = new PlayerSDK({options})  
>```
其中options设置： 
* id : 播放器实例化的时候需要明确DOM的占位，video将要输出到该DOM下，播放器的尺寸与占位DOM一致， 必填项； 
* url : 视频源地址 ， 必填项；
* isLive: 是否是直播，用于切换播放器，true 时为flv, false 时为hls, 选填，默认为true
* auto : 是否自动播放，选填，默认为true
* width: 播放器宽度 数字；
* height: 播放器高度 数字；
* volume:预设音量大小。默认值：0.6,参考值：0 ~ 1;选填
* socketServer: 用于建立socket连接更新token和获取设备状态，必填项（例：ws://172.19.3.59:18888/ws/devices?token=test）

 ## 方法
 * 播放直播  player.playLive()
 * 播放暂停  player.pause()
 * 恢复播放  player.resume()
 * 停止播放  player.stop()
 * 进入全屏  player.getCssFullscreen()
 * 退出全屏  player.exitCssFullscreen()
 * 切换直播源 player.switchLive(newUrl) 
 * 销毁播发器 player.destroy(boolean) // true 删除内部DOM元素 | false 保留内部DOM元素，默认为true
 * 回播 player.playAtTime(start_time,end_time,urlData)  其中start_time 和 urlData为必填项，urlData为一个数组，
 包含了多个回放视频信息
````
     [{
         "end_time": "2020-03-23 09:57:45",
         "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849267512601584926813805.m3u8",
         "start_time": "2020-03-23 09:25:51",
         "videoid": "33875316115849267512601584926813805"
     }, {
         "end_time": "2020-03-23 10:29:48",
         "hls_url": "https://v-test.cmcconenet.com:8443/vod/33713/33875316_1/33875316115849286657901584928727800.m3u8",
         "start_time": "2020-03-23 09:57:45",
     }
        ...
     ]
````
## 事件
* 初始化成功 PLAYER_INIT
* 播放器缓存了资源可播放时触发 PLAYER_CAN_PLAY 
* 视频加载过程触发 PLAYER_PLAY_LOADING
* 开始播放 PLAYER_PLAY 
* 持续播放 PLAYER_PLAYING
* 播放暂停 PLAYER_PAUSE
* 当前播放时间变化时触发 PLAYER_TIME_CHANGE 
* 回播视频结束时触发 REVIEW_END
* 实例：
>```
>    player.Events("PLAYER_INIT",()=>{
>       console.log("可以播放了")
>    })
>```
