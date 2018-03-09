$(function () {    
    var param = getParam();
    if (param.p) {
        if (param.p.match(/^[a-z]{3}[789]\d{4}$/)) {
            $.getJSON('/oct/ocelot/process/' + param.p + '.js', function (process) {
                GLOBAL_process = process;
                $('#proposition-name').text(GLOBAL_process.meta.title);
                $('.modified-date').text('Last updated: ' + GLOBAL_process.meta.lastUpdate);
                $('#content').html(drawStanza('start'));
            }).fail(function () {
                console.warn('unable to get json');
            });
        } else {
            console.warn('invalid GLOBAL_process id');
        }
    } else {
        console.warn('no GLOBAL_process id specified');
    }
});

var GLOBAL_process;

function drawQuestionStanza(stanza) {
    var html = '';
    html += '<form>';
    html += '<div class="form-group">';
    html += '<fieldset>';
    html += '<legend>';
    html += '<h1 class="heading-medium">' + addQuestionMark(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][1]) + '</h1>';
    html += '</legend>';
    for (var i = 0; i < GLOBAL_process.flow[stanza].answers.length; i++) {
        html += drawMultipleChoice(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].answers[i]], GLOBAL_process.flow[stanza].next[i]);
    }
    html += '</fieldset>';
    html += '</div>';
    html += '</form>';
    html += '<input class="button" type="submit" value="Continue">';
    return html;
}

function drawInstructionStanza(stanza) {
    var html = '';
    if(GLOBAL_process.flow[stanza].stack)
    {
        html += '<p>' + GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][1] + '</p>';
    }
    else
    {
        html += '<p>' + GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][1] + '</p>';
    }
    return html;
}

function drawNoteStanza(stanza) {
    var html = '';
    html += '<div class="panel panel-border-wide">';
    html += '<p>' + GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text] + '</p>';
    html += '</div>';
    return html;
}

function drawImportantStanza(stanza) {
    var html = '';
    html += '<div class="notice">';
    html += '<i class="icon icon-important">';
    html += '<span class="visually-hidden">Warning</span>';
    html += '</i>';
    html += '<strong class="bold-small">';
    html += GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text];
    html += '</strong>';
    html += '</div>';
    return html;
}

function drawMultipleChoice(text, value) {
    var html = '';
    html += '<div class="multiple-choice">';
    html += '<input type="radio" id="radio_' + value + '" name="radio-group" value="' + value + '">';
    html += '<label for="radio_' + value + '">' + lowerCaseStart(text) + '</label>';
    html += '</div>';
    return html;
}

function drawEndStanza(){
    return '<p>End of this process</p>';
}

function drawStanza(stanza) {
    var html = '';    
    switch (GLOBAL_process.flow[stanza].type) {
        case 'InstructionStanza':
            html += drawInstructionStanza(stanza);
            break;
        case 'QuestionStanza':
            html += drawQuestionStanza(stanza);
            break;
        case 'NoteStanza':
            html += drawNoteStanza(stanza);
            break;
        case 'ImportantStanza':
            html += drawImportantStanza(stanza);
            break;
        case 'EndStanza':
            html += drawEndStanza();
            break;
        default:
            console.warn('unknown stanza type: ' + GLOBAL_process.flow[stanza].type);
            break;
    }
    if (GLOBAL_process.flow[stanza].type !== 'QuestionStanza' && GLOBAL_process.flow[stanza].type !== 'EndStanza')
        html += drawStanza(GLOBAL_process.flow[stanza].next[0]);
    
    return html;
}

function lowerCaseStart(text){
    if (text.substring(0, 2).toLowerCase() === 'ye' || text.substring(0, 2).toLowerCase() === 'no'){
        return text.substring(0, 2).toLowerCase() + text.substring(2);
    }
}

function addQuestionMark(text) {
    return (text[text.length - 1] !== '?') ? text + '?' : text;
}
$('#content').on('click', '.button', function () {
    var nextStanza = $('[name="radio-group"]:checked').val();
    if (nextStanza === undefined) {
        alert('Please select an option');
    } else {
        $('.rightbar, .reset').show();
        $('#content').html(drawStanza(nextStanza));
    }
});

function getParam(raw) {
    raw = raw || window.location.search;
    var parts, tmp, key, value, i, param = {};

    if (raw === undefined || raw === "")
        return param;

    raw = raw.substring(1); // remove leading '?';

    parts = raw.split("&");

    for (i = 0; i < parts.length; i += 1) {
        tmp = parts[i].split("=");
        key = decodeURIComponent(tmp[0]);
        value = decodeURIComponent(tmp[1]);

        if (key in param) {
            if (typeof param[key] === "string") {
                param[key] = [param[key], value];
            } else {
                param[key].push(value);
            }
        } else {
            param[key] = value;
        }
    }

    return param;
}
