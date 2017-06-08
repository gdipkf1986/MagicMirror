/* global Log, Module, moment */

/* Magic Mirror
 * Module: Voice
 *
 * By Jovi http://jovilabs.sinaapp.com
 * MIT Licensed.
 */
Module.register("voice", {

    // Module config defaults.
    defaults: {},

    // Define required scripts.
    getScripts: function () {
        return [this.file("vendor/fingerprint2.min.js"), this.file("vendor/iat.all.js"), "jquery"];
    },

    // Define start sequence.
    start: function () {
        Log.info("Starting module: " + this.name);
        const module = this;
        const session = new IFlyIatSession({
            "callback": {
                "onResult": function (err, result) {
                    // const command = {
                    //     targetModule: '', // switch_module,
                    //     nextState:''
                    // };

                    const command = voiceCommandAnalysis(result);
                    module.sendNotification("VOICE_COMMAND", command);

                    return;
                    /* 若回调的err为空或错误码为0，则会话成功，可提取识别结果进行显示*/
                    if (err == null || err == undefined || err == 0) {
                        if (result == '' || result == null)
                            iat_result.innerHTML = "没有获取到识别结果";
                        else
                            iat_result.i = nnerHTML = result;
                        /* 若回调的err不为空且错误码不为0，则会话失败，可提取错误码 */
                    } else {
                        iat_result.innerHTML = 'error code : ' + err + ", error description : " + result;
                    }
                    // mic_pressed = false;
                    // volumeEvent.stop();
                },
                "onVolume": function (volume) {
                    // volumeEvent.listen(volume);
                },
                "onError": function () {
                    // mic_pressed = false;
                    // volumeEvent.stop();
                },
                "onProcess": function (status) {
                    const tip = $("#a")[0];
                    switch (status) {
                        case 'onStart':
                            tip.innerHTML = "服务初始化...";
                            break;
                        case 'normalVolume':
                        case 'started':
                            tip.innerHTML = "倾听中...";
                            break;
                        case 'onStop':
                            tip.innerHTML = "等待结果...";
                            break;
                        case 'onEnd':
                            tip.innerHTML = '己完成';
                            break;
                        case 'lowVolume':
                            tip.innerHTML = "倾听中...(声音过小)";
                            break;
                        default:
                            tip.innerHTML = status;
                    }
                }
            }
        });
        this.session = session;
        Log.error(this.session);
    },

    init: function () {
    },

    play: function () {
        const session = this.session;
        if (!mic_pressed) {
            const ssb_param = {
                "grammar_list": null,
                "params": "appid=59284d9b,appidkey=d4eba926926b5d99, lang = sms, acous = anhui, aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, rse = utf8, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, compress = igzip"
            };
            iat_result.innerHTML = '   ';
            /* 调用开始录音接口，通过function(volume)和function(err, obj)回调音量和识别结果 */
            session.start(ssb_param);
            this.mic_pressed = true;
            volumeEvent.start();
        }
        else {
            //停止麦克风录音，仍会返回已传录音的识别结果.
            session.stop();
        }
    },

    // Override dom generator.
    getDom: function () {
        if (!$("#canvas_wrapper").length) {

            const html = `<div id="canvas_wrapper" style="display:none">
            <div style="display: inline">&spades;</div>
            <canvas id="volume" height="4"></canvas>
        </div>`;
            const wrapper = document.createElement("div");
            wrapper.id = 'voice_wrapper';
            const button = document.createElement("div");
            button.append(document.createTextNode("点击开始录音"));
            button.id = "a";
            const me = this;
            $(button).on("click", () => {

                if (this.started) {
                    const ssb_param = {
                        "grammar_list": null,
                        "params": "appid=59284d9b,appidkey=d4eba926926b5d99, lang = sms, acous = anhui, aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, rse = utf8, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, compress = igzip"
                    };
                    this.session.start(ssb_param);
                    button.innerText = "listener";
                } else {
                    button.innerText = "click to start";
                    this.session.stop();
                }
                this.started = !this.started;
            });
            $(wrapper).append(button, html);
            return wrapper;
        } else {
            return document.getElementById("voice_wrapper");
        }

    },


    // Override notification handler.
    notificationReceived: function (notification, payload, sender) {
        if (notification == "CURRENTWEATHER_DATA") {
        }
    },

});