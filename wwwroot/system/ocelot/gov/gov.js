$(function(){
    var GLOBAL_process;
    var param = getParam();
    if (param.p){
        if (param.p.match(RE.ocelot)) {
            $.getJSON('/oct/ocelot/process/' + param.p + '.js', function(process){
                console.log(process);
                GLOBAL_process = process;
                $('#proposition-name').text(GLOBAL_process.meta.title);
                $('.modified-date').text('Last updated: ' + GLOBAL_process.meta.lastUpdate);
                $('#content').html(drawStanza('start'));
            }).fail(function(){
                console.warn('unable to get json');
            });            
        } else {
            console.warn('invalid GLOBAL_process id');
        }
    } else {
        console.warn('no GLOBAL_process id specified');
    }
    function drawQuestionStanza(stanza){
        var html = '';
        html += '<form>';
            html += '<div class="form-group">';
                html += '<fieldset>';
                    html += '<legend>';
                        html += '<h1 class="heading-xlarge">' + addQuestionMark(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][1]) + '</h1>';
                    html += '</legend>';
                    for (var i = 0; i < GLOBAL_process.flow[stanza].answers.length; i++){
                        html += drawMultipleChoice(GLOBAL_process.phrases[GLOBAL_process.flow[stanza].answers[i]], GLOBAL_process.flow[stanza].next[i]);
                    }
                html += '</fieldset>';
            html += '</div>';            
        html += '</form>';  
        html += '<input class="button" type="submit" value="Continue">';
        return html;   
    }
    function drawInstructionStanza(stanza){
        var html = '';
        html += '<p>' + GLOBAL_process.phrases[GLOBAL_process.flow[stanza].text][1] + '</p>';
        return html;
    }
    function drawImportantStanza(stanza){
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
    function drawMultipleChoice(text, value){
        var html = '';
        html += '<div class="multiple-choice">';
            html += '<input type="radio" id="radio_' + value + '" name="radio-group" value="' + value + '">';
            html += '<label for="radio_' + value + '">' + text + '</label>';
        html += '</div>';
        return html;
    }
    function drawEndStanza(){
        var html = '';
        html += '<p>End of this process</p>';
        return html;        
    }
    function drawStanza(stanza){
        var html = '';
        switch (GLOBAL_process.flow[stanza].type) {
            case 'InstructionStanza':
                html += drawInstructionStanza(stanza);
                break;
            case 'QuestionStanza':
                html += drawQuestionStanza(stanza);
                break;     
            case 'ImportantStanza':
                html += drawImportantStanza(stanza);
                break;                     
            default:
                console.warn('unknown stanza type: ' + GLOBAL_process.flow[stanza].type);
                break;
        }
        if (GLOBAL_process.flow[stanza].type !== 'QuestionStanza') {
            html += checkNext(stanza);
        }        
        return html;
    }
    function checkNext(stanza){
        var html = '';
        if (GLOBAL_process.flow[stanza].next[0] !== 'end'){
            html += drawStanza(GLOBAL_process.flow[stanza].next);
        } else {
            html += drawEndStanza();
        }
        return html;
    }
    function addQuestionMark(text){
        if (text.substring(text.length - 1) !== '?'){
            text = text + '?';
        }
        return text;
    }
    $('#content').on('click', '.button', function(){
        var nextStanza = $('[name="radio-group"]:checked').val();
        if (nextStanza === undefined){
            alert('Please select an option');
        } else {
            $('#content').html(drawStanza(nextStanza));
        }
    });    
});

function myConflict()
{
    
}