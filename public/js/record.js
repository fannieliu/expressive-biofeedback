var socket;
var audplaying = false;

function connectToMuse() {
    socket = io.connect();
    socket.emit('connectmuse');

    socket.on('muse_connected', function() {
        // TODO: update record for all viz
        startGraphing();
        // startSwirl();
        $('#muse-status').css('display', 'inline-block');
        $('#connect-message').text('Connected! Now recording.');
    });

    socket.on('muse_uncertain', function() {
        $('#connect-message').text('Waiting for new signals...');
    });

    socket.on('muse_unintended_disconnect', function() {
        $('#connect-message').text('You were disconnected!');
    })

    socket.on('headband_status', function(data) {
        switchHeadbandStatus('#leftback', data[0]);
        switchHeadbandStatus('#leftfront', data[1]);
        switchHeadbandStatus('#rightfront', data[2]);
        switchHeadbandStatus('#rightback', data[3]);
    });
}

function disconnectFromMuse() {
    socket.emit('disconnectmuse');

    socket.on('muse_disconnect', function() {
        console.log('disconnected');
        $('#connect-message').text('Muse has been disconnected.');
        $('#muse-status').css('display', 'none');
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

function switchHeadbandStatus(statusid, value) {
    // good: 1, ok: 2, bad: >= 3
    var green_good = 'rgba(15,198,0,1)';
    var yellow_ok = 'rgba(218,198,0,1)';
    var red_bad = 'red';
    if (value == 1) {
        $(statusid).css('background-color', green_good);
    } else if (rightback == 2) {
        $(statusid).css('background-color', yellow_ok);
    } else {
        $(statusid).css('background-color', red_bad);
    }
}

// TODO: clearer variables for each viz
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

function startSwirl() {
    doSwirling();
    socket.on('delta_relative', function(data) {
        delta = data;
    });
    socket.on('theta_relative', function(data) {
        theta = data;
    });
    socket.on('alpha_relative', function(data) {
        alpha = data;
    });
    socket.on('beta_relative', function(data) {
        beta = data;
    });
    socket.on('gamma_relative', function(data) {
        gamma = data;
    });
};

