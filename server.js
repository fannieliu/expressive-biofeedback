var express = require("express")
var nodeMuse = require("node-muse");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var csv = require('fast-csv');
var SerialPort = require("serialport").SerialPort;
var portName = 'COM8';

app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.use('/lib', express.static(__dirname + '/lib/'));

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var deltaarr = [];
var deltaarr_sec = [];
var thetaarr = [];
var thetaarr_sec = [];
var alphaarr = [];
var alphaarr_sec = [];
var betaarr = [];
var betaarr_sec = [];
var gammaarr = [];
var gammaarr_sec = [];

var raweegarr = [];
var accarr = [];

var rawfft0 = [];
var rawfft1 = [];
var rawfft2 = [];
var rawfft3 = [];

var lowfreqabs = [];
var deltaabs = [];
var thetaabs = [];
var alphaabs = [];
var betaabs = [];
var gammaabs = [];

var concentration = [];
var mellow = [];

io.on('connection', function(socket) {
    console.log('connected');

    // serial listener stuff for lights
    socket.on('openport', function() {
        serialListener();
    });
    socket.on('closeport', function() {
        serialPort.close();
    });

    socket.on('writeserial', function(data) {
        serialPort.write(data + 'E');
    });

    socket.on('connectmuse', function() {
        // send fake data
        /*socket.emit('muse_connected');
        setInterval(function(){
            var fakedelta = getRandom(0, 1);
            var faketheta = getRandom(0, 1);
            var fakealpha = getRandom(0, 1);
            var fakebeta = getRandom(0, 1);
            var fakegamma = getRandom(0, 1);
            socket.emit('delta_relative', fakedelta);
            socket.emit('theta_relative', faketheta);
            socket.emit('alpha_relative', fakealpha);
            socket.emit('beta_relative', fakebeta);
            socket.emit('gamma_relative', fakegamma);
            deltaarr.push([fakedelta]);
            thetaarr.push([faketheta]);
            alphaarr.push([fakealpha]);
            betaarr.push([fakebeta]);
            gammaarr.push([fakegamma]);

        }, 1000);*/

        // send muse data
        // TODO: note any channels that aren't sending data...

        var muse = nodeMuse.connect().Muse;

        muse.on('connected', function() {
            socket.emit('muse_connected');
        });

        muse.on('uncertain', function(){
            // for some reason muse can't be detected
            // waiting for new signals to arrive
            socket.emit('muse_uncertain');
        });

        muse.on('disconnected', function() {
            socket.emit('muse_unintended_disconnect');
        });

        // only send once every second
        var deltanow = Date.now();
        var deltalast = Date.now();
        var thetanow = Date.now();
        var thetalast = Date.now();
        var alphanow = Date.now();
        var alphalast = Date.now();
        var betanow = Date.now();
        var betalast = Date.now();
        var gammanow = Date.now();
        var gammalast = Date.now();

        // get relative data from muse, these values will be between 0 and 1
        // see: http://developer.choosemuse.com/research-tools/available-data#Relative_Band_Powers
        muse.on('/muse/elements/delta_relative', function(data){
            deltanow = Date.now();
            var deltadata = averageChannelData(data);
            // save raw data from all 4 channels for later analysis
            deltaarr.push(data.values);
            if (checkTime(deltanow, deltalast)) {
                deltalast = deltanow;
                // save data that's visualized
                deltaarr_sec.push([deltadata])
                socket.emit('delta_relative', deltadata);
            }
        });

        muse.on('/muse/elements/theta_relative', function(data){
            thetanow = Date.now();
            var thetadata = averageChannelData(data);
            thetaarr.push(data.values);
            if (checkTime(thetanow, thetalast)) {
                thetalast = thetanow;
                thetaarr_sec.push([thetadata]);
                socket.emit('theta_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/alpha_relative', function(data){
            alphanow = Date.now();
            var alphadata = averageChannelData(data);
            alphaarr.push(data.values);
            if (checkTime(alphanow, alphalast)) {
                alphalast = alphanow;
                alphaarr_sec.push([alphadata]);
                socket.emit('alpha_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/beta_relative', function(data){
            betanow = Date.now();
            var betadata = averageChannelData(data);
            betaarr.push(data.values);
            if (checkTime(betanow, betalast)) {
                betalast = betanow;
                betaarr_sec.push([betadata]);
                socket.emit('beta_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/gamma_relative', function(data){
            gammanow = Date.now();
            var gammadata = averageChannelData(data);
            gammaarr.push(data.values);
            if (checkTime(gammanow, gammalast)) {
                gammalast = gammanow;
                gammaarr_sec.push([gammadata]);
                socket.emit('gamma_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/horseshoe', function(data){
            socket.emit('headband_status', data.values);
        });

        // save additional information that might be useful
        muse.on('/muse/eeg', function(data) {
            raweegarr.push(data.values);
        });

        muse.on('/muse/acc', function(data) {
            accarr.push(data.values);
        });

        muse.on('/muse/elements/rawfft0', function(data) {
            rawfft0.push(data.values);
        });

        muse.on('/muse/elements/rawfft1', function(data) {
            rawfft1.push(data.values);
        });

        muse.on('/muse/elements/rawfft2', function(data) {
            rawfft2.push(data.values);
        });

        muse.on('/muse/elements/rawfft3', function(data) {
            rawfft3.push(data.values);
        });

        muse.on('/muse/elements/low_freqs_absolute', function(data) {
            lowfreqabs.push(data.values);
        });

        muse.on('/muse/elements/delta_absolute', function(data) {
            deltaabs.push(data.values);
        });

        muse.on('/muse/elements/theta_absolute', function(data) {
            thetaabs.push(data.values);
        });

        muse.on('/muse/elements/alpha_absolute', function(data) {
            alphaabs.push(data.values);
        });

        muse.on('/muse/elements/beta_absolute', function(data) {
            betaabs.push(data.values);
        });

        muse.on('/muse/elements/gamma_absolute', function(data) {
            gammaabs.push(data.values);
        });

        muse.on('/muse/elements/experimental/concentration', function(data) {
            concentration.push(data.values);
        });

        muse.on('/muse/elements/experimental/mellow', function(data) {
            mellow.push(data.values);
        });
    });

    socket.on('recordtime', function() {
        var delimiter = ['start', 'start', 'start', 'start']
        addDelimiterToAllArrays(delimiter);
    });

    socket.on('recordended', function() {
        var delimiter = ['end', 'end', 'end', 'end']
        addDelimiterToAllArrays(delimiter);
    });

    socket.on('disconnectmuse', function() {
        nodeMuse.disconnect();
        socket.emit('muse_disconnect');

        // save all data to csv file
        downloadData(deltaarr, 'delta');
        downloadData(thetaarr, 'theta');
        downloadData(alphaarr, 'alpha');
        downloadData(betaarr, 'beta');
        downloadData(gammaarr, 'gamma');
        downloadData(deltaarr_sec, 'delta_sec');
        downloadData(thetaarr_sec, 'theta_sec');
        downloadData(alphaarr_sec, 'alpha_sec');
        downloadData(betaarr_sec, 'beta_sec');
        downloadData(gammaarr_sec, 'gamma_sec');

        // save additional information
        downloadData(raweegarr, 'raweeg');
        downloadData(accarr, 'acc');
        downloadData(rawfft0, 'rawfft0');
        downloadData(rawfft1, 'rawfft1');
        downloadData(rawfft2, 'rawfft2');
        downloadData(rawfft3, 'rawfft3');
        downloadData(lowfreqabs, 'low_freqs_absolute');
        downloadData(deltaabs, 'delta_absolute');
        downloadData(thetaabs, 'theta_absolute');
        downloadData(alphaabs, 'alpha_absolute');
        downloadData(betaabs, 'beta_absolute');
        downloadData(gammaabs, 'gamma_absolute');
        downloadData(concentration, 'concentration');
        downloadData(mellow, 'mellow');
    });
});

// This function averages the EEG values we get across the four channels that Muse has
// Note that this can be noisy as a result, as it does not consider the spatial information
// see: http://forum.choosemuse.com/forum/developer-forum/6219-filtering-fft-alpha-beta-theta-values-using-muse-player
function averageChannelData(data) {
    var sum = 0;
    var numValidChannels = 0;
    var leftback = -1;
    var leftfront = -1;
    var rightfront = -1;
    var rightback = -1;
    var changed = false;
    if (!isNaN(data.values[0])) {
        sum += data.values[0];
        numValidChannels++;
        leftback = 1;
    }
    if (!isNaN(data.values[1])) {
        sum += data.values[1];
        numValidChannels++;
        leftfront = 1;
    }
    if (!isNaN(data.values[2])) {
        sum += data.values[2];
        numValidChannels++;
        rightfront = 1;
    }
    if (!isNaN(data.values[3])) {
        sum += data.values[3];
        numValidChannels++;
        rightback = 1;
    }
    var average = sum / numValidChannels;
    return average;
}

function addDelimiterToAllArrays(delimiter) {
    deltaarr.push(delimiter);
    deltaarr_sec.push(delimiter);
    alphaarr.push(delimiter);
    alphaarr_sec.push(delimiter);
    thetaarr.push(delimiter);
    thetaarr_sec.push(delimiter);
    betaarr.push(delimiter);
    betaarr_sec.push(delimiter);
    gammaarr.push(delimiter);
    gammaarr_sec.push(delimiter);

    raweegarr.push(delimiter)
    accarr.push(delimiter);
    rawfft0.push(delimiter);
    rawfft1.push(delimiter);
    rawfft2.push(delimiter);
    rawfft3.push(delimiter);
    lowfreqabs.push(delimiter);
    deltaabs.push(delimiter);
    thetaabs.push(delimiter);
    alphaabs.push(delimiter);
    betaabs.push(delimiter);
    gammaabs.push(delimiter);
    concentration.push(delimiter);
    mellow.push(delimiter);
}

function checkTime(currentTime, lastTime) {
    if ((currentTime - lastTime >= 1000) || (lastTime - currentTime >= 1000)) {
        return true;
    }
    return false;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function downloadData(data, filename) {
    csv
       .writeToPath(filename + ".csv", data, {headers: true})
       .on("finish", function(){
           console.log("done!");
       });
}

function serialListener() {
    serialPort = new SerialPort('/dev/cu.usbmodem1421', {
        baudrate: 9600,
        // defaults for Arduino serial communication
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });

    serialPort.on('open', function () {
      console.log('open serial communication');
    });
}

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port %d in %s mode', this.address().port, app.settings.env);
});