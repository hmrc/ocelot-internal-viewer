$(function () {
    var param = getParam();
    if (param.p) {
        if (param.p.match(/^[a-z]{3}[789]\d{4}$/)) {
            $.getJSON('/oct/ocelot/process/' + param.p + '.js', function (process) {
                GLOBAL_process = process;
                console.log(GLOBAL_process);
                $('#proposition-name').text(GLOBAL_process.meta.title);
                document.title = GLOBAL_process.meta.title + ' - GOV.UK';
                $('.summary').text('Last updated: ' + convertEpoch(GLOBAL_process.meta.lastUpdate));
                $.getJSON('/oct/ocelot/process/update.js', function (updates) {
                    if (updates[param.p] !== undefined) {
                        var html = $('<ul class="list list-bullet">');
                        $(updates[param.p]).each(function () {
                            if (!this.minor) {
                                $(html).append('<li>' + convertEpoch(this.date) + ' - ' + this.message + '</li>');
                            }
                        });
                        if ($(html).children().length) {
                            $('#updatesList').html(html);
                        }
                    }
                }).fail(function () {
                    console.warn('unable to get updates json')
                });
                $('#stanzas').html(drawStanza('start'));
            }).fail(function () {
                console.warn('unable to get process json');
            });
        } else {
            console.warn('invalid GLOBAL_process id');
        }
    } else {
        console.warn('no GLOBAL_process id specified');
    }
});

var GLOBAL_process, GLOBAL_errorShown = false;
var GLOBAL_history = {};
var GLOBAL_currentStanza;

function convertEpoch(date) {
    var d = new Date(date);
    return d.getDate() + ' ' + getWordedMonth(d.getMonth()) + ' ' + d.getFullYear();
}

function getWordedMonth(m) {
    var arrMonths = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    return arrMonths[m];
}

function titleError(bln) {
    if (bln) {
        document.title = 'Error: ' + document.title;
        GLOBAL_errorShown = true;
    } else {
        document.title.replace('Error: ', '');
        GLOBAL_errorShown = false;
    }
}

function drawQuestionStanza(stanza) {
    var html = '';
    html += '<form>';
    html += '<div class="form-group">';
    html += '<fieldset>';
    html += '<legend>';
    html += '<h1 class="heading-large" id="questionText">' + addQuestionMark(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][0]) + '</h1>';
    html += '<span style="display: none;" class="error-message">Please select an option</span>';
    html += '</legend>';
    for (var i = 0; i < GLOBAL_process.flow[stanza].answers.length; i++) {
        html += drawMultipleChoice(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].answers[i]], GLOBAL_process.flow[stanza].next[i], i);
    }
    html += '</fieldset>';
    html += '</div>';
    html += '</form>';
    html += '<input class="button" type="submit" value="Continue">';
    return html;
}

function drawInstructionStanza(stanza) {
    var html = '',
        current;
    if (GLOBAL_process.flow[stanza].stack) {
        var stackedStanzas = [];
        while (GLOBAL_process.flow[stanza].type === 'InstructionStanza' && GLOBAL_process.flow[stanza].stack) {
            stackedStanzas.push(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][0].split(' '));
            current = stanza;
            stanza = GLOBAL_process.flow[stanza].next;
        }

        var multi = false,
            i = 0,
            j = i + 1;
        while (i < stackedStanzas.length) {
            var match = true;
            while (match) {
                if (j < stackedStanzas.length && stackedStanzas[i][0] === stackedStanzas[j][0]) {
                    stackedStanzas[j] = {
                        bullet: 'multi',
                        text: stackedStanzas[j]
                    };
                    j++;
                    multi = true;
                } else {
                    if (multi) {
                        stackedStanzas[i] = {
                            bullet: 'multi',
                            text: stackedStanzas[i]
                        };
                        multi = false;
                        i = j;
                    } else {
                        stackedStanzas[i] = {
                            bullet: 'single',
                            text: stackedStanzas[i]
                        };
                        i++;
                    }
                    j = i + 1;
                    match = false;
                }
            }
        }

        multi = false;
        for (var k = 0; k < stackedStanzas.length; k++) {
            if (!multi && stackedStanzas[k].bullet === 'multi') {
                stackedStanzas[k].bullet = 'multi-start';
                var phrase = '',
                    index = 0,
                    match = true;
                while (match && index < stackedStanzas[k].text.length && index < stackedStanzas[k + 1].text.length) {
                    if (stackedStanzas[k].text[index] === stackedStanzas[k + 1].text[index]) {
                        phrase += stackedStanzas[k].text[index] + ' ';
                        index++;
                    } else {
                        match = false;
                    }
                }

                stackedStanzas[k].phrase = phrase;
                stackedStanzas[k].text = stackedStanzas[k].text.join(' ');
                stackedStanzas[k].text = stackedStanzas[k].text.replace(stackedStanzas[k].phrase, '').trim();
                multi = true;
            } else if (multi) {
                stackedStanzas[k].phrase = stackedStanzas[k - 1].phrase;
                if (k !== stackedStanzas.length - 1 && stackedStanzas[k + 1].bullet === 'multi') {
                    var compare = stackedStanzas[k + 1].text.join(' ');
                    if (~compare.indexOf(stackedStanzas[k].phrase)) {
                        stackedStanzas[k].text = stackedStanzas[k].text.join(' ');
                        stackedStanzas[k].text = stackedStanzas[k].text.replace(stackedStanzas[k].phrase, '').trim();
                    } else {
                        stackedStanzas[k].bullet = 'multi-end';
                        stackedStanzas[k].text = stackedStanzas[k].text.join(' ');
                        stackedStanzas[k].text = stackedStanzas[k].text.replace(stackedStanzas[k].phrase, '').trim();
                        multi = false;
                    }
                } else {
                    stackedStanzas[k].bullet = 'multi-end';
                    stackedStanzas[k].text = stackedStanzas[k].text.join(' ');
                    stackedStanzas[k].text = stackedStanzas[k].text.replace(stackedStanzas[k].phrase, '').trim();
                    multi = false;
                }
            } else {
                stackedStanzas[k].text = stackedStanzas[k].text.join(' ');
            }
        }


        html += '<ol style="margin-top: 45px;" class="list list-number">';
        for (var k = 0; k < stackedStanzas.length; k++) {
            if (stackedStanzas[k].bullet === 'single') {
                html += '<li>' + stackedStanzas[k].text + '</li>';
            } else if (stackedStanzas[k].bullet === 'multi-start') {
                html += '<li>' + stackedStanzas[k].phrase + '<ul class="list list-bullet"><li>' + stackedStanzas[k].text + '</li>';
            } else if (stackedStanzas[k].bullet === 'multi') {
                html += '<li>' + stackedStanzas[k].text + '</li>';
            } else //multi-end
            {
                html += '<li>' + stackedStanzas[k].text + '</li></ul></li>';
            }
        }
        html += '</ol>';
    } else {
        html += '<p style="margin-top: 45px;">' + GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][0] + '</p>';
        current = stanza;
    }
    return {
        html: html,
        stanza: current
    };
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

function drawMultipleChoice(text, value, index) {
    var html = '';
    html += '<div class="multiple-choice">';
    html += '<input type="radio" id="radio_' + index + '" name="radio-group" value="' + value + '">';
    html += '<label for="radio_' + index + '">' + lowerCaseStart(text) + '</label>';
    html += '</div>';
    return html;
}

function drawEndStanza() {
    //return '<p>End of this process</p>';
    return '<h4 class="heading-small">End of this process</h4>';
}

function drawStanza(stanza) {
    var html = '';
    switch (GLOBAL_process.flow[stanza].type) {
        case 'InstructionStanza':
            var instructions = drawInstructionStanza(stanza);
            html += instructions.html;
            stanza = instructions.stanza;
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
    GLOBAL_currentStanza = stanza;
    drawHistoryTable();
    return html;
}

function lowerCaseStart(text) {
    if (text.substring(0, 2).toLowerCase() === 'ye' || text.substring(0, 2).toLowerCase() === 'no') {
        return text.substring(0, 2).toLowerCase() + text.substring(2);
    }
}

function addQuestionMark(text) {
    return (text[text.length - 1] !== '?') ? text + '?' : text;
}

function drawHistoryTable() {
    var html = '';
    html += '<dl class="govuk-check-your-answers cya-questions-short">';
    for (stanza in GLOBAL_history) {
        html += '<div>';
        html += '<dt class="cya-question">' + addQuestionMark(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][0]) + '</dt>';
        html += '<dd class="cya-answer">' + lowerCaseStart(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].answers[GLOBAL_history[stanza].choice]]) + '</dd>';
        html += '<dd class="cya-change"><a href="#">Change</a></dd>';
        html += '</div>';
    }
    html += '</dl>';
    $('#history').html(html);
}

$('#stanzas').on('click', '.button', function () {
    var nextStanza = $('[name="radio-group"]:checked').val();
    if (nextStanza === undefined) {
        questionStanzaError();
    } else {
        var objHistory = {
            'choice': $('[name="radio-group"]:checked').attr('id').replace('radio_', '')
        };
        GLOBAL_history[GLOBAL_currentStanza] = objHistory;
        $('#stanzas').html(drawStanza(nextStanza));
        $('.reset').show();
        titleError(false);
        console.log(GLOBAL_history);
    }
});

function questionStanzaError() {
    if (!GLOBAL_errorShown) {
        var html = '';
        html += '<div class="error-summary" role="alert" aria-labelledby="error-summary-heading" tabindex="-1">';
        html += '<h2 class="heading-medium error-summary-heading" id="error-summary-heading">';
        html += 'There\'s a problem';
        html += '</h2>';
        html += '<p>Please answer the question:</p>';
        html += '<ul class="error-summary-list">';
        html += '<li><a href="#radio_0">' + $('#questionText').text() + '</a></li>';
        html += '</ul>';
        html += '</div>';
        $('#stanzas').prepend(html);
        $('.error-summary').focus();
        titleError(true);
        var objCSS = {
            'margin-top': '0',
            'margin-bottom': '0'
        };
        $('.heading-large').css(objCSS);
        $('.form-group').addClass('form-group-error');
        $('.error-message').show();
    }
}

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