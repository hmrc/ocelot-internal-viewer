$(function(){
    var param = getParam();
    if (param.p){
        if (param.p.match(RE.ocelot)) {
            $.getJSON('/oct/ocelot/process/' + param.p + '.js', function(process){
                console.log(process);
                $('#proposition-name').text(process.meta.title);
                $('.modified-date').text('Last updated: ' + process.meta.lastUpdate);
            }).fail(function(){
                console.warn('unable to get json');
            });            
        } else {
            console.warn('invalid process id');
        }
    } else {
        console.warn('no process id specified');
    }
});