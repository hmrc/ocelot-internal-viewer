$(function () {
    var param = getParam();
    if (param.p) {
        if (param.p.match(/^[a-z]{3}[789]\d{4}$/)) {
            $.getJSON('/' + param.p.substring(0, 3) + '/ocelot/process/' + param.p + '.js', function (process) {
                GLOBAL_process = process;
                console.log(GLOBAL_process);
                $('.govuk-header__link.govuk-header__link--service-name').text(GLOBAL_process.meta.title);
                document.title = 'GOV.UK - ' + GLOBAL_process.meta.title;
                //$('.summary').text('Last updated: ' + convertEpoch(GLOBAL_process.meta.lastUpdate));
                /*$.getJSON('/oct/ocelot/process/update.js', function (updates) {
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
                });*/
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
var GLOBAL_history = [];

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
    html += '<div class="govuk-form-group">';
    html += '<fieldset class="govuk-fieldset">';
    html += '<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">';
    html += '<h1 class="govuk-fieldset__heading">';

    html += addQuestionMark(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][0]);
    html += '</h1>';
    html += '</legend>';
    html += '<span style="display: none;" class="govuk-error-message">';
    html += 'Please select an option';
    html += '</span>';
    html += '<div class="govuk-radios">';
    /*html += '<span id="changed-name-hint" class="govuk-hint">';
    html += 'This includes changing your last name or spelling your name differently.';
    html += '</span>';*/
    for (var i = 0; i < GLOBAL_process.flow[stanza].answers.length; i++) {
        html += drawMultipleChoice(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].answers[i]], GLOBAL_process.flow[stanza].next[i], i, stanza);
    }
    html += '</div>';
    html += '</fieldset>';
    html += '</div>';
    /*html += '<form>';
    html += '<div class="form-group">';
    html += '<fieldset>';
    html += '<legend>';
    html += '<h1 class="heading-large" id="questionText">' + addQuestionMark(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][0]) + '</h1>';
    html += '<span style="display: none;" class="error-message">Please select an option</span>';
    html += '</legend>';
    for (var i = 0; i < GLOBAL_process.flow[stanza].answers.length; i++) {
        html += drawMultipleChoice(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].answers[i]], GLOBAL_process.flow[stanza].next[i], i, stanza);
    }
    html += '</fieldset>';
    html += '</div>';
    html += '</form>';*/
    html += '<button type="submit" class="govuk-button">';
    html += 'Continue';
    html += '</button>';
    return html;
}

function drawInstructionStanza(stanza) {
    var html = '',
        current;
    if (GLOBAL_process.flow[GLOBAL_process.flow[stanza].next[0]].type === 'InstructionStanza') {
        var stackedStanzas = [];
        while (GLOBAL_process.flow[stanza].type === 'InstructionStanza') {
            stackedStanzas.push(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][0].split(' '));
            current = stanza;
            stanza = GLOBAL_process.flow[stanza].next[0];
        }
        stackedStanzas = createStackedBulletTypes(stackedStanzas);
        stackedStanzas = createStackList(stackedStanzas);

        var occurrences = 0;
        for (var i = 0; i < stackedStanzas.length; i++) {
            occurrences += (stackedStanzas[i].bullet === 'multi-start') ? 1 : 0;
            occurrences += (stackedStanzas[i].bullet === 'single') ? 1 : 0;
        }
        var ulList = (occurrences <= 1) && (stackedStanzas[0].bullet === 'multi-start');

        html += (!ulList) ? '<ol class="govuk-list govuk-list--number">' : '<p class="govuk-body">' + stackedStanzas[0].phrase.charAt(0).toUpperCase() + stackedStanzas[0].phrase.slice(1) + '</p></div><ul class="govuk-list govuk-list--bullet">';
        //html += (!ulList) ? '<ol style="margin-top: 45px;" class="list list-number">' : '<div style="margin-top: 45px;">' + stackedStanzas[0].phrase.charAt(0).toUpperCase() + stackedStanzas[0].phrase.slice(1) + '</div><ul class="list list-bullet">';
        for (var i = 0; i < stackedStanzas.length; i++) {
            if (stackedStanzas[i].bullet === 'single') {
                html += '<li>' + stackedStanzas[i].text + '</li>';
            } else if (stackedStanzas[i].bullet === 'multi-start') {
                html += (!ulList) ? '<li>' + stackedStanzas[i].phrase.charAt(0).toLowerCase() + stackedStanzas[i].phrase.slice(1) + '<ul class="govuk-list govuk-list--bullet">' : '';
                html += '<li>' + stackedStanzas[i].text + '</li>';
            } else if (stackedStanzas[i].bullet === 'multi') {
                html += '<li>' + stackedStanzas[i].text + '</li>';
            } else //multi-end
            {
                html += '<li>' + stackedStanzas[i].text + '</li></ul>';
                html += (!ulList) ? '</li>' : '';
            }
        }
        html += (!ulList) ? '</ol>' : '</ul>';
    } else {
        html += '<p class="govuk-body">' + GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][0] + '</p>';
        current = stanza;
    }
    return {
        html: html,
        stanza: current
    };
}

function createStackedBulletTypes(stack) {
    var multi = false,
        i = 0,
        j = i + 1;
    while (i < stack.length) {
        var match = true;
        while (match) {
            if (j < stack.length && stack[i][0].toLowerCase() === stack[j][0].toLowerCase()) {
                stack[j] = {
                    bullet: 'multi',
                    text: stack[j]
                };
                j++;
                multi = true;
            } else {
                if (multi) {
                    stack[i] = {
                        bullet: 'multi',
                        text: stack[i]
                    };
                    multi = false;
                    i = j;
                } else {
                    stack[i] = {
                        bullet: 'single',
                        text: stack[i]
                    };
                    i++;
                }
                j = i + 1;
                match = false;
            }
        }
    }
    return stack;
}

function createStackList(stack) {
    var multi = false;
    for (var i = 0; i < stack.length; i++) {
        if (!multi && stack[i].bullet === 'multi') {
            stack[i].bullet = 'multi-start';
            var phrase = '',
                index = 0,
                match = true;
            while (match && index < stack[i].text.length && index < stack[i + 1].text.length) {
                if (stack[i].text[index].toLowerCase() === stack[i + 1].text[index].toLowerCase()) {
                    phrase += stack[i].text[index] + ' ';
                    index++;
                } else {
                    match = false;
                }
            }
            stack[i].phrase = phrase;
            multi = true;
        } else if (multi) {
            var multiEnd = true;
            stack[i].phrase = stack[i - 1].phrase;
            if (i !== stack.length - 1 && stack[i + 1].bullet === 'multi') {
                var compare = stack[i + 1].text.join(' ');
                if (~compare.indexOf(stack[i].phrase)) {
                    multiEnd = false;
                }
            }

            if (multiEnd) {
                stack[i].bullet = 'multi-end';
            }
        }
        stack[i].text = stack[i].text.join(' ');
        if (stack[i].phrase !== undefined) {
            stack[i].text = stack[i].text.replace(stack[i].phrase, '').trim();
        }
    }
    return stack;
}

function drawNoteStanza(stanza) {
    var html = '';
    html += '<div class="govuk-inset-text">';
    html += GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text];
    html += '</div>';
    /*html += '<div class="panel panel-border-wide">';
    html += '<p>' + GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text] + '</p>';
    html += '</div>';*/
    return html;
}

function drawImportantStanza(stanza) {
    var html = '';
    html += '<div class="govuk-warning-text">';
    html += '<span class="govuk-warning-text__icon" aria-hidden="true">!</span>';
    html += '<strong class="govuk-warning-text__text">';
    html += '<span class="govuk-warning-text__assistive">Warning</span>';
    html += GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text];
    html += '</strong>';
    html += '</div>';
    /*html += '<div class="notice">';
    html += '<i class="icon icon-important">';
    html += '<span class="visually-hidden">Warning</span>';
    html += '</i>';
    html += '<strong class="bold-small">';
    html += GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text];
    html += '</strong>';
    html += '</div>';*/
    return html;
}

function drawMultipleChoice(text, value, index, stanza) {
    var html = '';
    html += '<div class="govuk-radios">';
    html += '<div class="govuk-radios__item">';
    html += '<input class="govuk-radios__input" id="radio_' + index + '" name="radio-group" type="radio" data-stanza="' + stanza + '" value="' + value + '">';
    html += '<label class="govuk-label govuk-radios__label" for="radio_' + index + '">';
    html += lowerCaseStart(text);
    html += '</label>';
    html += '</div>';
    return html;
}

function drawEndStanza() {
    return '<p class="govuk-body govuk-!-font-weight-bold">End of this process</p>';
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
        
        //drawHistoryTable();
    if (stanza !== 'start'){
        console.log(GLOBAL_history);
        var stanzaToDraw = GLOBAL_history[GLOBAL_history.length - 1].stanza
        $('#back').attr('data-draw', stanzaToDraw);
        $('#back').attr('data-history-id', GLOBAL_history.length);
        $('#back').show();
    } else {
        $('#back').hide();
    }
    return html;
}

$('#back').click(function(){
    $('#stanzas').html(drawStanza($(this).attr('data-draw')));
    removeFromHistory($(this).attr('data-history-id'));
});

function lowerCaseStart(text) {
    if (text.substring(0, 2).toLowerCase() === 'ye' || text.substring(0, 2).toLowerCase() === 'no') {
        return text.substring(0, 2).toLowerCase() + text.substring(2);
    } else {
        return text;
    }
}

function addQuestionMark(text) {
    return (text[text.length - 1] !== '?') ? text + '?' : text;
}

function drawHistoryTable() {
    var html = '';
    html += '<dl class="govuk-check-your-answers cya-questions-short">';
    $(GLOBAL_history).each(function (index, item) {
        html += '<div>';
        html += '<dt class="cya-question">' + addQuestionMark(GLOBAL_process.phrases[GLOBAL_process.flow[item.stanza].text][0]) + '</dt>';
        html += '<dd class="cya-answer">' + lowerCaseStart(GLOBAL_process.phrases[GLOBAL_process.flow[item.stanza].answers[item.choice]]) + '</dd>';
        html += '<dd class="cya-change"><a class="changeStanza" href="#" data-history-id="' + index + '" data-draw="' + item.stanza + '">Change</a></dd>';
        html += '</div>';
    });
    html += '</dl>';
    $('#history').html(html);
    $('dl').each(function (elem, index) {
        var arr = $.makeArray($('div', this).detach());
        arr.reverse();
        $(this).append(arr);
    });
}

$('#history').on('click', '.changeStanza', function () {
    $('#stanzas').html(drawStanza($(this).attr('data-draw')));
    removeFromHistory($(this).attr('data-history-id'));
});

$('#stanzas').on('click', '.govuk-button', function () {
    var nextStanza = $('[name="radio-group"]:checked').val();
    if (nextStanza === undefined) {
        questionStanzaError();
    } else {
        addToHistory();
        $('#stanzas').html(drawStanza(nextStanza));
        titleError(false);
    }
});

$('#reset').click(function(){
    location.reload();
});

function addToHistory() {
    var objHistory = {
        'stanza': $('[name="radio-group"]:checked').attr('data-stanza'),
        'choice': $('[name="radio-group"]:checked').attr('id').replace('radio_', '')
    };
    GLOBAL_history.push(objHistory);
}

function removeFromHistory(sliceUpTo) {
    console.log(GLOBAL_history);
    console.log(sliceUpTo);
    GLOBAL_history = GLOBAL_history.slice(0, sliceUpTo);
    console.log(GLOBAL_history);
    //drawHistoryTable();
}

function questionStanzaError() {
    if (!GLOBAL_errorShown) {
        var html = '';
        html += '<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="error-summary">';
        html += '<h2 class="govuk-error-summary__title" id="error-summary-title">';
        html += 'There is a problem';
        html += '</h2>';
        html += '<div class="govuk-error-summary__body">';
        html += '<ul class="govuk-list govuk-error-summary__list">';
        html += '<li><a href="#radio_0">' + $('.govuk-fieldset__heading').text() + '</a></li>';
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        $('#stanzas').prepend(html);
        $('.error-summary').focus();
        titleError(true);
        /*var objCSS = {
            'margin-top': '0',
            'margin-bottom': '0'
        };
        $('.heading-large').css(objCSS);*/
        $('.govuk-form-group').addClass('govuk-form-group--error');
        $('.govuk-error-message').show();
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