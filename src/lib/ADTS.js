import GLOBAL from "./WebModule"
(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ADTS", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
/*

- TechnicalTerms
    - https://github.com/uupaa/AAC.js/wiki/TechnicalTerms

- Encoder Delay
    - https://developer.apple.com/library/mac/technotes/tn2258/_index.html
    - Number of seconds for one sample: (1 / samplingRate) = (1 / 44100) = 0.00002267573696
    - Priming samples + samples of actual audio + Remainder samples
        - Priming     = 2112 Samples
        - ActualAudio = variable
        - Remainder   = Math.max(1024, 1024 - ((2112 + actual) % 1024))

    - Example: 2112(priming) + 5389(actual) + 691(remainder) = 8192 = 1024 Samples x 8
        - frame duration:   (1 / 44100) * 1024 = 0.02321995464704 sec
        - priming duration: 2112 / 1024        = 2.0625 * 0.02321995464704 = 0.04789115645952 sec

        ```
        +---+
        |   | = AAC Frame = AccssUnit = ADTSHeader + RawDataBlocks(1024 Samples)
        +---+

        ======== AAC Encoded Bit Stream ========
        +---++---++---++---++---++---++---++---+
        |   ||   ||   ||   ||   ||   ||   ||   | -> Access Unit (1024 Samples) x 8
        +---++---++---++---++---++---++---++---+

        |----------|------------------------|--|
          Priming    Source Audio(PCM Data)   Remainder
        ```


- AAC BitStream format:
    +------------++----------------+
    | ADTS Frame || ADTS Frame ... |
    +------------++----------------+

- ADTS Frame:
    +-----------------------+--------------------+--------------------------+
    | ADTS Header (56 bits) | CRC (0 or 16 bits) | Raw Data Blocks (n bits) |
    +-----------------------+--------------------+--------------------------+

    <-----------------------> adtsHeaderLength
    <-----------------------------------------------------------------------> adtsFrameLength
    ^                                                                       ^
    adtsFrameBegin                                                          adtsFrameEnd
                                                 <--------------------------> rawDataBlockLength
                                                 ^                          ^
                                                 rawDataBlockStart          rawDataBlockEnd

- Audio Data Transport Stream (ADTS)
    - https://github.com/uupaa/AAC.js/wiki/ADTSObject

- https://github.com/uupaa/AAC.js/wiki/ADTSFrameObject
- ADTSFrameObject - { mpegVersion, crcProtection, audioObjectType, samplingRate, channels, adtsFrameBegin, adtsFrameEnd, adtsHeaderLength, rawDataBlockStart, rawDataBlockEnd, bufferFullness, rdbsInFrame, crcLength, error }
    - mpegVersion:          UINT8,                  // MPEG Version. 2 (MPEG-2) or 4 (MPEG-4)
    - crcProtection:        Boolean,                // has CRC value
    - audioObjectType:      UINT8,                  // 2 = AAC-LC, 5 = HE-AAC, 29 = HE-AAC v2
    - samplingRate:         UINT32,                 // sampling rate (Sampling frequency)
    - channels:             Number,                 // 1(Monaural), 2(Stereo), etc...
    - frameStart:           UINT32                  // ADTS Frame start position in AAC byte stream
    - frameEnd:             UINT32,                 // ADTS Frame end position in AAC byte stream
    - adtsHeaderLength:     UINT16,                 // ADTS Header length. every 7
    - rawDataBlockStart:    UINT32,                 // Raw Data Block start position
    - rawDataBlockEnd:      UINT32,                 // Raw Data Block end position
    - bufferFullness:       UINT16,                 // adts_buffer_fullness
    - rdbsInFrame:          UINT8,                  // number_of_raw_data_blocks_in_frame (should always be to zero in order to enhance the compatibility)
    - crcLength:            UINT8,                  // CRC length (0 or 2)
    - error:                Boolean,                // error flag.

- ADTSObject: { samplingRate, duration, channels, frames, rawDataBlocks, headerBytes, rawDataBytes, errorBytes, contamination }
    - samplingRate:         UINT32,                 // sampling rate (Sampling frequency)
    - durations:            ADTSDurationsObject,    //
    - duration:             Number,                 // duration.
    - channels:             Number,                 // 1(Monaural), 2(Stereo), etc...
    - frames:               ADTSFrameObjectArray,   // [ADTSFrameObject, ...]
    - rawDataBlocks:        UINT32Array,            // Raw Data Block position pairs. [<ADTSFrame[0].rawDataBlockStart, ADTSFrame[0].rawDataBlockEnd>, ...]
    - headerBytes:          UINT32,                 // Total ADTS Header bytes
    - rawDataBytes:         UINT32,                 // Total ADTS RawDataBlock bytes
    - errorBytes:           UINT32,                 //
    - contamination:        Boolean,                // difference between the latest properties.

- ADTSDurationsObject: { frameLength, samplingRate, primingSamples, primingDuration, remainderSamples, remainderDuration, estimatedDuration }
    - frameLength           UINT32,
    - samplingRate:         UINT32,                 // 44100, 48000
    - primingSamples:       UINT32,                 // typical 2112, maybe 1024
    - primingDuration:      Number,
    - remainderSamples:     UINT32,
    - remainderDuration:    Number,                 // mayby 0
    - estimatedDuration:    Number,                 // (priming sample + audio source actual samples + remainder samples) * (1 / samplingRate) * 1024

 */
// --- dependency modules ----------------------------------
var AAC  = WebModule["AAC"];
var Hash = WebModule["Hash"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var SAMPLING_RATES = {
     0: 96000,  // `0000` - 96000 Hz
     1: 88200,  // `0001` - 88200 Hz
     2: 64000,  // `0010` - 64000 Hz
     3: 48000,  // `0011` - 48000 Hz
     4: 44100,  // `0100` - 44100 Hz
     5: 32000,  // `0101` - 32000 Hz
     6: 24000,  // `0110` - 24000 Hz
     7: 22050,  // `0111` - 22050 Hz
     8: 16000,  // `1000` - 16000 Hz
     9: 12000,  // `1001` - 12000 Hz
    10: 11025,  // `1010` - 11025 Hz
    11:  8000,  // `1011` - 8000 Hz
    12:  7350,  // `1100` - 7350 Hz
    13:     0,  // `1101` - Reserved
    14:     0,  // `1110` - Reserved
    15:     0,  // `1111` - other
};

var CHANNELS = {
     0: 0.0,
     1: 1.0,    //   1 ch - (Front:       center)
     2: 2.0,    //   2 ch - (Front: left,         right)
     3: 3.0,    //   3 ch - (Front: left, center, right)
     4: 4.0,    //   4 ch - (Front: left, center, right)                   (Rear:       center)
     5: 5.0,    //   5 ch - (Front: left, center, right)                   (Rear: left,        right)
     6: 5.1,    // 5.1 ch - (Front: left, center, right)                   (Rear: left,        right, subwoofer)
     7: 7.1,    // 7.1 ch - (Front: left, center, right)(Side: left, right)(Rear: left,        right, subwoofer)
};

// --- class / interfaces ----------------------------------
var ADTS = {
    "VERBOSE":          VERBOSE,
    "parse":            ADTS_parse,             // ADTS.parse(source:Uint8Array, cursor:UINT32 = 0):ADTSObject
    "parseFirstFrame":  ADTS_parseFirstFrame,   // ADTS.parseFirstFrame(source:Uint8Array, cursor:UINT32 = 0):ADTSObject
    "parseHeader":      ADTS_parseHeader,       // ADTS.parseHeader(source:Uint8Array, cursor:UINT32 = 0):ADTSFrameObject
    "caclDurations":    ADTS_caclDurations,     // ADTS.caclDurations(frameLength:UINT32, samplingRate:UINT32, encoder:AACEncoderNameString = ""):ADTSDurationsObject
    "toUint8Array":     ADTS_toUint8Array,      // ADTS.toUint8Array(source:Uint8Array, adts:ADTSObject = null, options:Object = null):Uint8Array
    "toBlob":           ADTS_toBlob,            // ADTS.toBlob(source:Uint8Array, adts:ADTSObject = null, options:Object = null):Blob
};

// --- implements ------------------------------------------
function ADTS_parse(source,   // @arg Uint8Array - ADTS+RawDataBlocks (raw level byte stream).
                    cursor) { // @arg UINT32 = 0 - source offset.
                              // @ret ADTSObject
//{@dev
    if (VERIFY) {
        $valid($type(source, "Uint8Array"),  ADTS_parse, "source");
        $valid($type(cursor, "UINT32|omit"), ADTS_parse, "cursor");
    }
//}@dev

    return _parseFrames(source, cursor || 0, 0);
}

function ADTS_parseFirstFrame(source,   // @arg Uint8Array - ADTS+RawDataBlocks (raw level byte stream).
                              cursor) { // @arg UINT32 = 0 - source offset.
                                        // @ret ADTSObject
//{@dev
    if (VERIFY) {
        $valid($type(source, "Uint8Array"),  ADTS_parseFirstFrame, "source");
        $valid($type(cursor, "UINT32|omit"), ADTS_parseFirstFrame, "cursor");
    }
//}@dev

    return _parseFrames(source, cursor || 0, 1);
}

function _parseFrames(source, cursor, maxFrames) {
    var view            = { source: source, cursor: cursor };
    var sourceLimit     = view.source.length;
    var frames          = []; // ADTSFrameObjectArray - [ADTSFrame, ...]
    var rawDataBlocks   = [];
    var headerBytes     = 0;
    var rawDataBytes    = 0;
    var errorBytes      = 0;
    var contamination   = false;
    var mpegVersion     = 0;
    var audioObjectType = 0;
    var samplingRate    = 0;
    var channels        = 0;

    // --- contamination check ---
    var latest_mpegVersion     = 0;
    var latest_audioObjectType = "";
    var latest_channels        = 0.0;
    var latest_samplingRate    = 0;

    while (view.cursor < sourceLimit) {
        var header = ADTS_parseHeader(view.source, view.cursor);

        if (header["error"]) {
            view.cursor++; // skip unknown byte
            errorBytes++;
        } else {
            // --- examine the difference between the latest properties ---
            mpegVersion     = header["mpegVersion"];
            audioObjectType = header["audioObjectType"];
            channels        = header["channels"];
            samplingRate    = header["samplingRate"];

            if (latest_mpegVersion && latest_mpegVersion !== mpegVersion) {
                console.error("MPEG Version unmatched", mpegVersion, latest_mpegVersion);
                contamination = true;
            }
            if (latest_audioObjectType && latest_audioObjectType !== audioObjectType) {
                console.error("Audio Object Type unmatched", audioObjectType, latest_audioObjectType);
                contamination = true;
            }
            if (latest_channels && latest_channels !== channels) {
                console.error("Channels unmatched", channels, latest_channels);
                contamination = true;
            }
            if (latest_samplingRate && latest_samplingRate !== samplingRate) {
                console.error("Sampling Rate unmatched", samplingRate, latest_samplingRate);
                contamination = true;
            }

            latest_mpegVersion     = mpegVersion;
            latest_audioObjectType = audioObjectType;
            latest_channels        = channels;
            latest_samplingRate    = samplingRate;

            // store begin/end position pair.
            rawDataBlocks.push( header["rawDataBlockStart"], header["rawDataBlockEnd"] );

            headerBytes  += header["adtsHeaderLength"] + header["crcLength"];
            rawDataBytes += header["rawDataBlockEnd"]  + header["rawDataBlockStart"];
            view.cursor  += header["adtsFrameLength"];
            frames.push(header);
        }
        if (maxFrames && frames.length >= maxFrames) {
            break;
        }
    }

    var durations = ADTS_caclDurations(frames.length, frames[0]["samplingRate"], "");

    var adtsObject = {
        "samplingRate":     frames[0]["samplingRate"],
        "durations":        durations,
        "duration":         durations["estimatedDuration"],
        "channels":         frames[0]["channels"],
        "frames":           frames,         // ADTS Frames [{...}, ... ]
        "rawDataBlocks":    rawDataBlocks,  // Raw Data Block position pairs. [<ADTSFrame[0].rawDataBlockStart, ADTSFrame[0].rawDataBlockEnd>, ... ]
        "headerBytes":      headerBytes,    // total ADTS Header bytes
        "rawDataBytes":     rawDataBytes,   // total ADTS Raw Data Block bytes
        "errorBytes":       errorBytes,
        "contamination":    contamination,
    };
    return adtsObject;
}

function ADTS_caclDurations(frameLength,  // @arg UINT32
                            samplingRate, // @arg UINT32 - 48000, 44100
                            encoder) {    // @arg AACEncoderNameString = ""
                                          // @ret ADTSDurationsObject
                                          // @desc https://github.com/uupaa/AAC.js/wiki/EncoderDelay
    encoder = encoder || "";

    // 1サンプルあたりの秒数
    var seconds_per_sample = (1 / samplingRate); // (1 / 44100) = 0.00002267573696

    // Durationの概算式。EncoderDelay を加味していないため実際とは異なる
    var estimatedDuration = seconds_per_sample * 1024 * frameLength;

    // https://github.com/uupaa/AAC.js/wiki/EncoderDelay#magic-number
    // primingSamples のデフォルト値
    var primingSamples = 2112;

    // 正確な remainderSamples は、正確な ActualAudioSamples (本来のaudio sourceの長さ)が判らないと求められないため0と仮定する
    var remainderSamples = 0; // = Math.max(1024, 1024 - ((primingSamples + actualSamples) % 1024))

    if (/^Lavc/.test(encoder)) {
        primingSamples = 1024;
    }

    return {
        "samplingRate":      samplingRate,
        "frameLength":       frameLength,
        "primingSamples":    primingSamples,
        "primingDuration":   primingSamples * seconds_per_sample,
        "remainderSamples":  remainderSamples,
        "remainderDuration": remainderSamples * seconds_per_sample,
        "estimatedDuration": estimatedDuration,
    };
}

function ADTS_parseHeader(source,   // @arg Uint8Array - ADTS+RawDataBlocks (raw level byte stream).
                          cursor) { // @arg UINT32 = 0 - source offset.
                                    // @ret ADTSFrameObject - { mpegVersion, ... error }
//{@dev
    if (VERIFY) {
        $valid($type(source, "Uint8Array"),  ADTS_parseHeader, "source");
        $valid($type(cursor, "UINT32|omit"), ADTS_parseHeader, "cursor");
    }
//}@dev

    cursor = cursor || 0;

    var frameStart = cursor;
    var byte0 = source[cursor];
    var byte1 = source[cursor + 1];
    var byte2 = source[cursor + 2];
    var byte3 = source[cursor + 3];
    var byte4 = source[cursor + 4];
    var byte5 = source[cursor + 5];
    var byte6 = source[cursor + 6];
    var byte7 = source[cursor + 7];
    var byte8 = source[cursor + 8];

    // | byte 0 | byte 1 | byte 2 | byte 3 | byte 4 | byte 5 | byte 6 | bits | field name                         | note                           |
    // |--------|--------|--------|--------|--------|--------|--------|------|------------------------------------|--------------------------------|
    // |11111111|1111    |        |        |        |        |        |  12  | syncword                           | Every 0xFFF                    |
    // |        |    A   |        |        |        |        |        |   1  | ID                                 | 0 = MPEG-4, 1 = MPEG-2         |
    // |        |     00 |        |        |        |        |        |   2  | layer                              | Every Zero                     |
    // |        |       B|        |        |        |        |        |   1  | protection_absent                  | 0 = YES, 1 = NO                |
    // |        |        |CC      |        |        |        |        |   2  | profile_ObjectType                 | 1 = AAC-LC                     |
    // |        |        |  DDDD  |        |        |        |        |   4  | sampling_frequency_index           | `0100` = 44100, `0111` = 22050 |
    // |        |        |      ~ |        |        |        |        |   1  | private_bit                        |                                |
    // |        |        |       F|FF      |        |        |        |   3  | channel_configuration              | 1 = CENTER, 2 = LEFT/RIGHT     |
    // |        |        |        |  ~     |        |        |        |   1  | original_copy                      |                                |
    // |        |        |        |   ~    |        |        |        |   1  | home                               |                                |
    // |        |        |        |    ~   |        |        |        |   1  | copyright_identification_bit       |                                |
    // |        |        |        |     ~  |        |        |        |   1  | copyright_identification_start     |                                |
    // |        |        |        |      HH|HHHHHHHH|HHH     |        |  13  | aac_frame_length                   | ADTS Header + CRC + RDBs       |
    // |        |        |        |        |        |   IIIII|IIIIII  |  11  | adts_buffer_fullness               | VBR                            |
    // |        |        |        |        |        |        |      JJ|   2  | number_of_raw_data_blocks_in_frame | RDBs in Frame. Should be Zero  |

    // adts_fixed_header()
    var syncword            = (byte0 === 0xFF) && ((byte1 & 0xF0) === 0xF0);        // find sync word.
    var mpegVersion         = (byte1 & 0x08) === 1 ? 2 : 4;                         // A: `0` = MPEG4, `1` = MPEG2
    var layer               = (byte1 & 0x06) === 0 ? true : false;                  // every `00`
    var crcProtection       = (byte1 & 0x01) === 0 ? true : false;                  // B: `0` = HAS CRC, `1` = NO CRC
    var audioObjectType     = ((byte2 & 0xC0) >> 6) + 1;                            // C: 2 = AAC-LC, 5 = HE-AAC, 29 = HE-AAC v2
    var samplingRate        = SAMPLING_RATES[(byte2 & 0x3C) >> 2];                  // D: `0100` = 44100
    var channels            = CHANNELS[((byte2 & 0x1) << 2 | byte3 & 0xC0) >> 6];   // F:  2 = LEFT+RIGHT
    // adts_variable_header()
    var adtsFrameLength     = (byte3 & 0x03) << 11 | byte4 << 3 | (byte5 & 0xe0) >> 5; // = adtsHeaderLength + crcLength + (rawDataBlockEnd - rawDataBlockStart)
    var bufferFullness      = (byte5 & 0x1f) << 6  | byte6 >> 2;
    var rdbsInFrame         = (byte6 & 0x03);
    var adtsHeaderLength    = 7;
    var crcLength           = crcProtection ? 2 : 0;
    var rawDataBlockStart   = cursor + adtsHeaderLength;
    var rawDataBlockEnd     = cursor + adtsFrameLength;
    var crc1                = crcProtection ? (((byte7 << 8) | byte8) >>> 0) : 0;
    var crc2                = crc1;
    var error               = false;

    if (VERIFY && crcProtection) {
        crc2 = Hash["CRC"]( source.subarray( rawDataBlockStart, rawDataBlockEnd ), Hash["CRC16_IBM"] );
    }
    if (!syncword || !layer || audioObjectType !== 2) { // 2 = AAC-LC
        error = true;
    }
    if (crc1 !== crc2) {
        console.error("CRC unmatched", crc1, crc2);
        error = true;
    }

    // ADTSFrameObject
    return {
        "frameStart":           frameStart,
        "frameEnd":             rawDataBlockEnd,
        "mpegVersion":          mpegVersion,
        "crcProtection":        crcProtection,
        "audioObjectType":      audioObjectType,
        "samplingRate":         samplingRate,
        "channels":             channels,
        "adtsFrameLength":      adtsFrameLength,
        "adtsHeaderLength":     adtsHeaderLength,
        "crcLength":            crcLength,
        "rawDataBlockStart":    rawDataBlockStart,
        "rawDataBlockEnd":      rawDataBlockEnd,
        "bufferFullness":       bufferFullness,
        "rdbsInFrame":          rdbsInFrame,
        "error":                error,
    };
}

function ADTS_toUint8Array(source,    // @arg Uint8Array - ADTS+RawDataBlocks Stream
                           adts,      // @arg ADTSObject = null
                           options) { // @arg Object - { ESTIMATED_DURATION: false }
                                      // @ret Uint8Array
//{@dev
    if (VERIFY) {
        $valid($type(source,  "Uint8Array"),      ADTS_toUint8Array, "source");
        $valid($type(adts,    "ADTSObject|omit"), ADTS_toUint8Array, "adts");
        $valid($type(options, "Object|omit"),     ADTS_toUint8Array, "options");
        if (options) {
            $valid($keys(options, "ESTIMATED_DURATION"), ADTS_toUint8Array, "options");
        }
    }
//}@dev

    options = options || {};
    var ESTIMATED_DURATION = options["ESTIMATED_DURATION"] || false;

    if (!ESTIMATED_DURATION) {
        return source;
    }

    adts = adts || _parseFrames(source, 0, 0);

    var packing = _getPacking(adts);
    var length  = ((adts["frames"].length / 2) + 1) | 0;
    var result  = new Uint8Array(source.length + packing.length * length);

    result.set(source, 0);
    for (var i = 0, cursor = source.length; i < length; ++i) {
        result.set(packing, cursor);
        cursor += packing.length;
    }
    return result;
}

function ADTS_toBlob(source,    // @arg Uint8Array - ADTS+RawDataBlocks Stream
                     adts,      // @arg ADTSObject = null
                     options) { // @arg Object - { ESTIMATED_DURATION: false }
                                // @ret Blob
//{@dev
    if (VERIFY) {
        $valid($type(source, "Uint8Array"),      ADTS_toBlob, "source");
        $valid($type(adts,   "ADTSObject|omit"), ADTS_toBlob, "adts");
        $valid($type(options, "Object|omit"),    ADTS_toBlob, "options");
        if (options) {
            $valid($keys(options, "ESTIMATED_DURATION"), ADTS_toBlob, "options");
        }
    }
//}@dev

    options = options || {};
    var ESTIMATED_DURATION = options["ESTIMATED_DURATION"] || false;

    if (!ESTIMATED_DURATION) {
        return new Blob([source], { "type": "audio/aac" });
    }

    adts = adts || _parseFrames(source, 0, 0);

    var buffer  = [source];
    var packing = _getPacking(adts);
    var length  = ((adts["frames"].length / 2) + 1) | 0;

    for (var i = 0; i < length; ++i) {
        buffer.push(packing);
    }
    return new Blob(buffer, { "type": "audio/aac" });
}

function _getPacking(adts) {
    switch (adts["audioObjectType"]) {
    case  2: return AAC["AAC_44100_LR_2"];
    case  5: return AAC["AAC_44100_LR_5"];
    case 29: return AAC["AAC_44100_LR_29"];
    }
    return AAC["AAC_44100_LR_2"];
}

return ADTS; // return entity

});

