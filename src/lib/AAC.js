// http://git.io/WebModule

// --- global variables ------------------------------------
// https://github.com/uupaa/WebModule/wiki/WebModuleIdiom
var GLOBAL = (this || 0).self || global;

// --- environment detection -------------------------------
// https://github.com/uupaa/WebModule/wiki/EnvironmentDetection
(function() {

    var hasGlobal     = !!GLOBAL.global;              // Node.js, NW.js, Electron
    var processType   = !!(GLOBAL.process || 0).type; // Electron(render and main)
    var nativeTimer   = !!/native/.test(setTimeout);  // Node.js, Electron(main)

    GLOBAL.IN_BROWSER = !hasGlobal && "document"       in GLOBAL;   // Browser and Worker
    GLOBAL.IN_WORKER  = !hasGlobal && "WorkerLocation" in GLOBAL;   // Worker
    GLOBAL.IN_NODE    =  hasGlobal && !processType && !nativeTimer; // Node.js
    GLOBAL.IN_NW      =  hasGlobal && !processType &&  nativeTimer; // NW.js
    GLOBAL.IN_EL      =  hasGlobal &&  processType;                 // Electron(render and main)

})();

// --- validation and assertion functions ------------------
//{@dev https://github.com/uupaa/WebModule/wiki/Validate
GLOBAL.$type   = function(v, types)   { return GLOBAL.Valid ? GLOBAL.Valid.type(v, types)  : true; };
GLOBAL.$keys   = function(o, keys)    { return GLOBAL.Valid ? GLOBAL.Valid.keys(o, keys)   : true; };
GLOBAL.$some   = function(v, cd, ig)  { return GLOBAL.Valid ? GLOBAL.Valid.some(v, cd, ig) : true; };
GLOBAL.$args   = function(api, args)  { return GLOBAL.Valid ? GLOBAL.Valid.args(api, args) : true; };
GLOBAL.$valid  = function(v, api, hl) { return GLOBAL.Valid ? GLOBAL.Valid(v, api, hl)     : true; };
GLOBAL.$values = function(o, vals)    { return GLOBAL.Valid ? GLOBAL.Valid.values(o, vals) : true; };
//}@dev

// --- WebModule -------------------------------------------
GLOBAL.WebModule = {
    CODE:    {},    // source code container.
    VERIFY:  false, // verify mode flag.
    VERBOSE: false, // verbose mode flag.
    PUBLISH: false, // publish flag, module publish to global namespace.
    exports: function(moduleName,      // @arg ModuleNameString
                      moduleClosure) { // @arg JavaScriptCodeString
        // @ret ModuleObject
        var wm = this; // GLOBAL.WebModule

        // https://github.com/uupaa/WebModule/wiki/SwitchModulePattern
        var alias = wm[moduleName] ? (moduleName + "_") : moduleName;

        if (!wm[alias]) { // secondary module already exported -> skip
            wm[alias] = moduleClosure(GLOBAL, wm, wm.VERIFY, wm.VERBOSE); // evaluate the module entity.
            wm.CODE[alias] = moduleClosure + ""; // store to the container.

            if (wm.PUBLISH && !GLOBAL[alias]) {
                GLOBAL[alias] = wm[alias]; // module publish to global namespace.
            }
        }
        return wm[alias];
    }
};


(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("AAC", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
/*
- TechnicalTerms
    - https://github.com/uupaa/AAC.js/wiki/TechnicalTerms
- ADTSHeaderObject
    - https://github.com/uupaa/AAC.js/wiki/ADTSHeaderObject
*/

// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var AAC_44100_LR_2 = _toUint8Array(
        "FFF150801162B8" + // ADTS Header (MPEG-4, AAC-LC, 44100Hz, L/R, FrameLength = 139 byte, NO-CRC, duration = 0.046439909297052155)
        "2111450014500146F6C10A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5E" +
        "FFF150801162B8" +
        "2111450014500146F6C10A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5E");

var AAC_44100_LR_5 = _toUint8Array(
        "FFF15C8022C274" + // ADTS Header (MPEG-4, HE-AACv1, 44100Hz, L/R, FrameLength = 278 byte, NO-CRC, duration = 0.046439909297052155)
        "2111450014500146DDF2415D0800000000706000C00DFD2214B4B4B4B4B4B4B4B4" +
        "B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4" +
        "B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4" +
        "B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4" +
        "B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4" +
        "B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4" +
        "B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4" +
        "B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4B4" +
        "B4B4B4B4B4B4BC");

var AAC_44100_LR_29 = _toUint8Array(
        "FFF15C4022C1E8" + // ADTS Header (MPEG-4, HE-AACv2, 22050Hz, Center (parametric), FrameLength = 278 byte, NO-CRC, duration = 0.046439909297052155)
        "01402280A36EFB809C08000000000012A00006FEC10A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A" +
        "5A5A5A5A5A5A5E");

// --- class / interfaces ----------------------------------
var AAC = {
    "VERBOSE":              VERBOSE,
    "repository":           "https://github.com/uupaa/AAC.js",
    "ESTIMATED_DURATION":   false,
    "AAC_44100_LR_2":       AAC_44100_LR_2,
    "AAC_44100_LR_5":       AAC_44100_LR_5,
    "AAC_44100_LR_29":      AAC_44100_LR_29,
};

// --- implements ------------------------------------------
function _init() {
    if (IN_NODE) { return; }
    // --- detect ESTIMATED_DURATION ---
    if (/Chrome/.test(navigator.userAgent)) { // Chrome use ffmpeg
        AAC["ESTIMATED_DURATION"] = true;
    }
        /*
        var audioContext = new AudioContext();
        var AAC_DURATION = 0.046439909297052155;

        audioContext["decodeAudioData"](AAC_44100_LR_2.buffer, function(audioBuffer) {
            if (audioBuffer["duration"] < AAC_DURATION) {
                // Mac Chrome 51: -> 3.204126984126984 ->  7.201950113378685
                // Mac Safari 9:  -> 5.061950206756592 -> 10.123900413513184
                AAC["ESTIMATED_DURATION"] = true;
                if (audioContext["close"]) {
                    audioContext["close"]();
                }
            }
        });
         */
}

function _toUint8Array(hexString) { // @arg HexString - "FFF1F0"
                                    // @ret Uint8Array - new Uint8Array([0xff, 0xf1, 0xf0])
    var result = new Uint8Array(hexString.length / 2);
    var bytes = hexString.split("");

    for (var i = 0, j = 0, iz = bytes.length; i < iz; i += 2, ++j) {
        result[j] = parseInt(bytes[i] + bytes[i + 1], 16);
    }
    return result;
}

_init();

return AAC; // return entity

});

