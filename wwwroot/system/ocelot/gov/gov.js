$(function () {
    var param = getParam();
    console.log(param.p);
    if (!param.p) {
        console.log('no process found');
        $('div.column-two-thirds').html(buildWarningText('Process not found'));
    } else {
        if (param.p.match(RE.ocelot)) {
            console.log('process found');
            $.getJSON('/oct/ocelot/process/oct90001.js', function (process) {
                console.log(process);
                $('#proposition-name').text(process.meta.title);
                $('.modified-date').text('Last updated: ' + process.meta.lastUpdate);
            });
        } else {
            console.log('invalid process id');
            $('div.column-two-thirds').html(buildWarningText('Invalid process ID'));
        }
    }
});

function buildWarningText(text) {
    var html = '';
    html += '<div class="notice">';
    html += '<i class="icon icon-important">';
    html += '<span class="visually-hidden">Warning</span>';
    html += '</i>';
    html += '<strong class="bold-small">';
    html += text;
    html += '</strong>';
    html += '</div>';
    return html;
}