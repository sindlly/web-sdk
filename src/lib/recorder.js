import InlineWorker from './inline-worker';

const defaultOptions = {
    inputSampleRate: 48000,
    outSampleRate: 8000,
    bufferLen: 4096,
    type: 'G711A',
}

class Recorder {
    constructor(stream, ws, options) {
        if (!stream) {
            throw new Error('音频流不能为空');
        }
        if (!ws) {
            throw new Error('WS不能为空');
        }
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.options = Object.assign({}, defaultOptions, options);
        this.ac = new AudioContext({
            sampleRate: this.options.inputSampleRate,
        });
        this.source = this.ac.createMediaStreamSource(stream);
        this.scriptNode = this.ac.createScriptProcessor(this.options.bufferLen, 1, 1);
        this.dest = this.ac.createMediaStreamDestination();

        this.worker = new InlineWorker(function () {
            let inputSampleRate = 48000;
            let outSampleRate = 8000;
            let sim = '';
            let rtpNum = 0;

            const LOG_TABLE = [
                1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
            ];

            const encodeTable = [
                0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
                4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
                5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
                5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
            ];

            self.onmessage = function (e) {
                switch (e.data.command) {
                    case 'init':
                        init(e.data.config);
                        break;
                    case 'encodeG711ALaw':
                        encodeG711ALaw(e.data.data);
                        break;
                    case 'encodeG711MULaw':
                        encodeG711MULaw(e.data.data);
                        break;
                    case 'close':
                        self.close();
                        break;
                }
            }

            function init (config) {
                inputSampleRate = config.inputSampleRate;
                outSampleRate = config.outSampleRate;
                sim = config.sim;
            }

            function compress(data) {
                if (inputSampleRate < outSampleRate) return data;
                const compressRatio = inputSampleRate / outSampleRate;
                const compressLen = data.length / compressRatio;
                const result = new Float32Array(compressLen);
                let index = 0, k = 0;
                while (index < compressLen) {
                    result[index] = data[k];
                    k += compressRatio;
                    index++;
                }
                return result;
            }

            function getRTPHeader(dataView, dataLen) {
                const time = +Date.now();
                const timeStr = (Array(64).join(0) + time.toString(2)).slice(-64);
                // 见部标协议表19 音视频流及透传数据传输协议负载包格式定义表
                dataView.setUint8(0, parseInt('30', 16));
                dataView.setUint8(1, parseInt('31', 16));
                dataView.setUint8(2, parseInt('63', 16));
                dataView.setUint8(3, parseInt('64', 16));
                dataView.setUint8(4, parseInt('10000001', 2));
                dataView.setUint8(5, parseInt('00010110', 2));
                dataView.setUint16(6, rtpNum++);
                dataView.setUint8(8, parseInt('01', 16));
                dataView.setUint8(9, parseInt('18', 16));
                dataView.setUint8(10, parseInt('00', 16));
                dataView.setUint8(11, parseInt('00', 16));
                dataView.setUint8(12, parseInt('24', 16));
                dataView.setUint8(13, parseInt('14', 16));
                dataView.setUint8(14, 1);
                dataView.setUint8(15, parseInt('00110000', 2));
                dataView.setUint32(16, parseInt(timeStr.slice(0, 32), 2));
                dataView.setUint32(20, parseInt(timeStr.slice(32, 64), 2));
                dataView.setUint16(24, dataLen);
                if (rtpNum > 65535) {
                    rtpNum = 0;
                }
            }

            function encodeALawSample(sample) {
                let compandedValue;
                sample = (sample === -32768) ? -32767 : sample;
                let sign = ((~sample) >> 8) & 0x80;
                if (!sign) {
                    sample = sample * -1;
                }
                if (sample > 32635) {
                    sample = 32635;
                }
                if (sample >= 256) {
                    let exponent = LOG_TABLE[(sample >> 8) & 0x7F];
                    let mantissa = (sample >> (exponent + 3)) & 0x0F;
                    compandedValue = ((exponent << 4) | mantissa);
                } else {
                    compandedValue = sample >> 4;
                }
                return compandedValue ^ (sign ^ 0x55);
            }

            function encodeMULawSample(sample) {
                let sign;
                let exponent;
                let mantissa;
                let muLawSample;
                sign = (sample >> 8) & 0x80;
                if (sign !== 0) sample = -sample;
                sample = sample + BIAS;
                if (sample > CLIP) sample = CLIP;
                exponent = encodeTable[(sample>>7) & 0xFF];
                mantissa = (sample >> (exponent+3)) & 0x0F;
                muLawSample = ~(sign | (exponent << 4) | mantissa);
                return muLawSample;
              }

            function encodeG711ALaw(inputData) {
                const data = compress(new Float32Array(inputData));
                const bufferLen = data.length * 1;
                const buffer = new ArrayBuffer(26 + bufferLen);
                const output = new DataView(buffer);
                getRTPHeader(output, bufferLen);
                let offset = 26;
                for (let i = 0; i < data.length; i++, offset += 1) {
                    const s = Math.max(-1, Math.min(1, data[i]));
                    const s_16int = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    const s_alaw = encodeALawSample(s_16int);
                    output.setUint8(offset, s_alaw);
                }
                self.postMessage({
                    command: 'send',
                    data: new Blob([output]),
                });
            }

            function encodeG711MULaw(inputData) {
                const data = this.compress(new Float32Array(inputData));
                const bufferLen = data.length * 1;
                const buffer = new ArrayBuffer(26 + bufferLen);
                const output = new DataView(buffer);
                getRTPHeader(output, bufferLen);
                let offset = 26;
                for (let i = 0; i < data.length; i++, offset += 1) {
                    let s = Math.max(-1, Math.min(1, data[i]));
                    const s_16int = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    const s_mulaw = encodeMULawSample(s_16int);
                    dataView.setUint8(offset, s_mulaw);
                }
                self.postMessage({
                    command: 'send',
                    data: new Blob([output]),
                });
            }
        });

        this.scriptNode.onaudioprocess = (audioProcessingEvent) => {
            const { inputBuffer } = audioProcessingEvent;
            const inputData = inputBuffer.getChannelData(0);
            this.worker.postMessage({
                command: 'encodeG711ALaw',
                data: inputData
            })
        }

        this.worker.postMessage({
            command: 'init',
            config: {
                inputSampleRate: this.options.inputSampleRate,
                outSampleRate: this.options.outSampleRate,
                sim: this.options.sim,
            }
        });

        this.worker.onmessage = (e) => {
            if (e.data.command === 'send') {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(e.data.data);
                }
            }
        }
    }

    start() {
        this.source.connect(this.scriptNode);
        this.scriptNode.connect(this.dest);
    }

    stop() {
        this.source.disconnect();
        this.scriptNode.disconnect();
    }

    destroy() {
        this.worker.postMessage({
            command: 'close',
        });
        this.worker.terminate();
        this.worker = null;
        this.source.disconnect();
        this.scriptNode.disconnect();
        this.ac && this.ac.close();
        this.source = null;
        this.scriptNode.onaudioprocess = null;
        this.scriptNode = null;
        this.ac = null;
    }
}

export default Recorder;