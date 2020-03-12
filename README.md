# web-sdk 功能描述
## 直播功能
new PlayerSDK({options})  
其中options设置： 
* id : 播放器实例化的时候需要明确DOM的占位，video将要输出到该DOM下，播放器的尺寸与占位DOM一致， 必填项； 
* url : 视频源地址 ， 必填项；
* deviceID: 设备ID,用于监听设备状态、语音通话等，选填；
* deviceServerUrl: 设备服务URL,用于建立webSocket连接，选填；  
* width: 播放器宽度 数字；
* height: 播放器高度 数字；
* islive: 是否是直播，用于切换播放器，true 时为flv, false 时为hls, 选填，默认为true
* volume:预设音量大小。默认值：0.6,参考值：0 ~ 1;选填
 
