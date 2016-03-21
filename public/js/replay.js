var deltaarr_replay, thetaarr_replay, alphaarr_replay, betaarr_replay, gammaarr_replay;

// brain wave csv file uploads

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
            deltaarr_replay = csvarr;
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
            thetaarr_replay = csvarr;
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
            alphaarr_replay = csvarr;
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
            betaarr_replay = csvarr;
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
            gammaarr_replay = csvarr;
        };
        reader.readAsText(e.target.files[0]);
    }
    return false;
});

// replay functions

function replayDataWithAudio() {
    startReplayViz();
}

function startAudio() {
    var replayaud = document.getElementById('replay-audio-player');
    // timeout of one second, because the graph plots a second later
    setTimeout(replayaud.play(), 1000);
    playing = true;
}

function startReplayViz() {
    linegraph = createGraph();
    var index = 0;
    var max = getMaxAllArr();
    var shift = 1 - max;
    var config = getConfig();
    var swirl = new CanvasSwirl(
        document.getElementById('swirl_surface'), config);

    // stuff for light
    socket = io.connect();
    socket.emit('openport');
    var replayaud = document.getElementById('replay-audio-player');
    replayaud.onended = function() {
        socket.emit('closeport');
    }

    setInterval(function() {
        if (deltaarr_replay[index] == 'start,start,start,start') {
            startAudio();
        } else if (deltaarr_replay[index] == 'end,end,end,end') {
            // do nothing
        } else {
            // graph
            replayGraph(index);
            replayEmoji(index, shift);
            replaySwirl(swirl, index);
            replayColors(index, shift);
            replayLight(index);
        }
        index++;
    }, 1000);
}

function replayGraph(index) {
    addData([deltaarr_replay[index]], deltaline, deltaarr);
    addData([thetaarr_replay[index]], thetaline, thetaarr);
    addData([alphaarr_replay[index]], alphaline, alphaarr);
    addData([betaarr_replay[index]], betaline, betaarr);
    addData([gammaarr_replay[index]], gammaline, gammaarr);
}

function replayEmoji(index, shift) {
    var delta_shift = parseFloat(deltaarr_replay[index]) + shift;
    var theta_shift = parseFloat(thetaarr_replay[index]) + shift;
    var alpha_shift = parseFloat(alphaarr_replay[index]) + shift;
    var beta_shift = parseFloat(betaarr_replay[index]) + shift;
    var gamma_shift = parseFloat(gammaarr_replay[index]) + shift;

    $('#delta-emoji').animate({opacity: delta_shift});
    $('#theta-emoji').animate({opacity: theta_shift});
    $('#alpha-emoji').animate({opacity: alpha_shift});
    $('#beta-emoji').animate({opacity: beta_shift});
    $('#gamma-emoji').animate({opacity: gamma_shift});
}

function replaySwirl(my_swirl, index){
  var new_config = getConfig();
  updateSwirl(new_config, deltaarr_replay[index], thetaarr_replay[index], alphaarr_replay[index], betaarr_replay[index], gammaarr_replay[index]);
  my_swirl.applyConfig(new_config);
}

function replayColors(index, shift) {
    var delta_shift = parseFloat(deltaarr_replay[index]) + shift;
    var theta_shift = parseFloat(thetaarr_replay[index]) + shift;
    var alpha_shift = parseFloat(alphaarr_replay[index]) + shift;
    var beta_shift = parseFloat(betaarr_replay[index]) + shift;
    var gamma_shift = parseFloat(gammaarr_replay[index]) + shift;

    $('#delta-color').animate({opacity: delta_shift});
    $('#theta-color').animate({opacity: theta_shift});
    $('#alpha-color').animate({opacity: alpha_shift});
    $('#beta-color').animate({opacity: beta_shift});
    $('#gamma-color').animate({opacity: gamma_shift});
}


function replayLight(index) {
    // write 'd, t, a, b, g' for which light to display
    var delta_float = parseFloat(deltaarr_replay[index]);
    var theta_float = parseFloat(thetaarr_replay[index]);
    var alpha_float = parseFloat(alphaarr_replay[index]);
    var beta_float = parseFloat(betaarr_replay[index]);
    var gamma_float = parseFloat(gammaarr_replay[index]);

    var sendData = 'd';
    var max = delta_float;
    if (theta_float > max) {
        max = theta_float;
        sendData = 't';
    }
    if (alpha_float > max) {
        max = alpha_float;
        sendData = 'a';
    }
    if (beta_float > max) {
        max = beta_float;
        sendData = 'b';
    }
    if (gamma_float > max) {
        max = gamma_float;
        sendData = 'g'
    }
    socket.emit('writeserial', sendData);
}

function getMaxArr(arr) {
    var max = -1;
    for (var i = 0; i < arr.length; i++) {
        var num = parseFloat(arr[i]);
        if (num > max) {
            max = num;
        }
    }
    console.log(max);
    return max;
}

function getMaxAllArr() {
    var delta_max = getMaxArr(deltaarr_replay);
    var theta_max = getMaxArr(thetaarr_replay);
    var alpha_max = getMaxArr(alphaarr_replay);
    var beta_max = getMaxArr(betaarr_replay);
    var gamma_max = getMaxArr(gammaarr_replay);
    var max = Math.max(delta_max, theta_max, alpha_max, beta_max, gamma_max);
    return max;
}
