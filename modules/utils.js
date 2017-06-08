/**
 * Created by Jovi on 6/6/2017.
 */

String.prototype.contains = function (word) {
    return this.indexOf(word) > -1;
}
function voiceCommandAnalysis(textResult) {
    const command = {
        module: '',
        action: ''
    };
    Log.info(textResult);
    if (textResult.contains("天气")) {
        if (textResult.contains("今天")) {
            command.module = "currentweather";
        } else {
            command.module = "weatherforecast";
        }
    } else if (textResult.contains("新闻")) {
        command.module = 'newsfeed';
    } else if (textResult.contains("假期")) {
        command.module = 'calendar';
    }

    return command;

}

function moduleEventHandler(event, payload, sender) {
    if (event != 'VOICE_COMMAND') {
        return;
    }
    if (payload.type == '') {

    }
}