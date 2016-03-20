var socket;
var audplaying = false;

function connectToMuse() {
    socket = io.connect();
    socket.emit('connectmuse');

    socket.on('muse_connected', function() {
        // TODO: update record for all viz
        startGraphing('graph');
        $('#muse-status').css("display", "inline-block");
        $('#connect-message').text('Connected! Now recording.');
    });

    socket.on('muse_uncertain', function() {
        $('#connect-message').text('Waiting for new signals...');
    });

    socket.on('muse_unintended_disconnect', function() {
        $('#connect-message').text('You were disconnected!');
    })

    var leftback = -1;
    var leftfront = -1;
    var rightfront = -1
    var rightback = -1;
    socket.on('headband_status', function(data) {
        // good: 1, ok: 2, bad: >= 3
        leftback = data[0];
        if (leftback == 1) {
            $('#leftback').css("background-color", "rgba(15,198,0,1)");
        } else if (leftback == 2) {
            $('#leftback').css("background-color", "rgba(218,198,0,1)");
        } else {
            $('#leftback').css("background-color", "red");
        }
        leftfront = data[1];
        if (leftfront == 1) {
            $('#leftfront').css("background-color", "rgba(15,198,0,1)");
        } else if (leftfront == 2) {
            $('#leftfront').css("background-color", "rgba(218,198,0,1)");
        } else {
            $('#leftfront').css("background-color", "red");
        }
        rightfront = data[2];
        if (rightfront == 1) {
            $('#rightfront').css("background-color", "rgba(15,198,0,1)");
        } else if (rightfront == 2) {
            $('#rightfront').css("background-color", "rgba(218,198,0,1)");
        } else {
            $('#rightfront').css("background-color", "red");
        }
        rightback = data[3];
        if (rightback == 1) {
            $('#rightback').css("background-color", "rgba(15,198,0,1)");
        } else if (rightback == 2) {
            $('#rightback').css("background-color", "rgba(218,198,0,1)");
        } else {
            $('#rightback').css("background-color", "red");
        }
    });
}

function disconnectFromMuse() {
    socket.emit('disconnectmuse');

    socket.on('muse_disconnect', function() {
        $('#musestatus').text('Muse has been disconnected. Outputting csv files.');
        $('#headbandstatus').css("display", "none");
    });
}

function recordDataWithAudio() {
    // this just saves the time the audio started
    if (!audplaying) {
        socket.emit('recordtime');
        audplaying = true;
        var aud = document.getElementById('record-audio-player');
        aud.onended = function() {
            socket.emit('recordended');;
            audplaying = false;
        }
    }
}

function startGraphing() {
    linegraph = createGraph();

    socket.on('delta_relative', function(data) {
        addData(data, deltaline, deltaarr);
    });
    socket.on('theta_relative', function(data) {
        addData(data, thetaline, thetaarr);
    });
    socket.on('alpha_relative', function(data) {
        addData(data, alphaline, alphaarr);
    });
    socket.on('beta_relative', function(data) {
        addData(data, betaline, betaarr);
    });
    socket.on('gamma_relative', function(data) {
        addData(data, gammaline, gammaarr);
    });
}
