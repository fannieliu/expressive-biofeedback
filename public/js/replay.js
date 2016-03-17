var deltaarr_replay, thetaarr_replay, alphaarr_replay, betaarr_replay, gammaarr_replay;

$('#deltafile').change(function(e) {
    var ext = $('input#deltafile').val().split('.').pop().toLowerCase();

    if($.inArray(ext, ['csv']) == -1) {
        alert('Please upload a CSV file.');
        return false;
    }

    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var csvarr = e.target.result.split('\n');
            // update to only include up to start
            for (var i = 0; i < csvarr.length; i++) {
                if (csvarr[i] == 'start,start,start,start') {
                    break;
                }
            }
            deltaarr_replay = csvarr.slice(i+1, csvarr.length);
            return false;
        };
        reader.readAsText(e.target.files[0]);
    }

});

$('#thetafile').change(function(e) {
    var ext = $('input#thetafile').val().split('.').pop().toLowerCase();

    if($.inArray(ext, ['csv']) == -1) {
        alert('Please upload a CSV file.');
        return false;
    }

    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var csvarr = e.target.result.split('\n');
            // update to only include up to start
            for (var i = 0; i < csvarr.length; i++) {
                if (csvarr[i] == 'start,start,start,start') {
                    break;
                }
            }
            thetaarr_replay = csvarr.slice(i+1, csvarr.length);
        };
        reader.readAsText(e.target.files[0]);
    }
    return false;
});

$('#alphafile').change(function(e) {
    var ext = $('input#alphafile').val().split('.').pop().toLowerCase();

    if($.inArray(ext, ['csv']) == -1) {
        alert('Please upload a CSV file.');
        return false;
    }

    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var csvarr = e.target.result.split('\n');
            // update to only include up to start
            for (var i = 0; i < csvarr.length; i++) {
                if (csvarr[i] == 'start,start,start,start') {
                    break;
                }
            }
            alphaarr_replay = csvarr.slice(i+1, csvarr.length);
        };
        reader.readAsText(e.target.files[0]);
    }
    return false;
});

$('#betafile').change(function(e) {
    var ext = $('input#betafile').val().split('.').pop().toLowerCase();

    if($.inArray(ext, ['csv']) == -1) {
        alert('Please upload a CSV file.');
        return false;
    }

    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var csvarr = e.target.result.split('\n');
            // update to only include up to start
            for (var i = 0; i < csvarr.length; i++) {
                if (csvarr[i] == 'start,start,start,start') {
                    break;
                }
            }
            betaarr_replay = csvarr.slice(i+1, csvarr.length);
        };
        reader.readAsText(e.target.files[0]);
    }
    return false;
});

$('#gammafile').change(function(e) {
    var ext = $('input#gammafile').val().split('.').pop().toLowerCase();

    if($.inArray(ext, ['csv']) == -1) {
        alert('Please upload a CSV file.');
        return false;
    }

    if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var csvarr = e.target.result.split('\n');
            // update to only include up to start
            for (var i = 0; i < csvarr.length; i++) {
                if (csvarr[i] == 'start,start,start,start') {
                    break;
                }
            }
            gammaarr_replay = csvarr.slice(i+1, csvarr.length);
        };
        reader.readAsText(e.target.files[0]);
    }
    return false;
});

var audreplaying = false;
function replayDataWithAudio() {
    if (!audreplaying) {
        var replayaud = document.getElementById('replay-audio-player');
        startReplayGraphing();
        setTimeout(replayaud.play(), 1000);
        playing = true;
    }
    replayaud.onended = function() {
        audreplaying = false;
    }
}

function startReplayGraphing() {
    linegraph = createGraph();
    var index = 0;
    setInterval(function(){
        addData([deltaarr_replay[index]], deltaline, deltaarr);
        addData([thetaarr_replay[index]], thetaline, thetaarr);
        addData([alphaarr_replay[index]], alphaline, alphaarr);
        addData([betaarr_replay[index]], betaline, betaarr);
        addData([gammaarr_replay[index]], gammaline, gammaarr);
        index++;
    }, 1000);
}