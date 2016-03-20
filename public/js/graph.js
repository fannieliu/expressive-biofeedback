var deltaline, thetaline, alphaline, betaline, gammaline;
var deltaarr, thetaarr, alphaarr, betaarr, gammaarr;
var linegraph;

var linemap = {
    'delta': {
        'normal': 'rgba(15,198,0,1)',
        'fade': 'rgba(15,198,0,0.20)',
        'description': 'Delta waves are associated with deep sleep.'
    },
    'theta': {
        'normal': 'rgba(218,198,0,1)',
        'fade': 'rgba(218,198,0,0.20)',
        'description': 'Theta waves are associated with daydreaming and meditation.'
    },
    'alpha': {
        'normal': 'rgba(246,130,0,1)',
        'fade': 'rgba(246,130,0,0.20)',
        'description': 'Alpha waves are associated with relaxation and disengagement.'
    },
    'beta': {
        'normal': 'rgba(247,43,0,1)',
        'fade': 'rgba(247,43,0,0.20)',
        'description': 'Beta waves are associated with focused concentration and active thinking.'
    },
    'gamma': {
        'normal': 'rgba(3,55,244,1)',
        'fade': 'rgba(3,55,244,0.20)',
        'description': 'Gamma waves are associated with high mental activity, alertness, and learning.'
    }
}

function addLine(graph, line, linetype) {
    graph.addTimeSeries(line, {
        lineWidth: 3,
        strokeStyle: linemap[linetype]['normal']
    });
    return line;
}

function removeLine(graph, line) {
    graph.removeTimeSeries(line);
}

function toggleFade(line, linetype, fade) {
    var smoothie = linegraph;
    var seriesOptions;
    for (var i = 0; i < smoothie.seriesSet.length; i++) {
        if (smoothie.seriesSet[i].timeSeries === line) {
            seriesOptions = smoothie.seriesSet[i].options;
            break;
        }
    }
    seriesOptions.strokeStyle = linemap[linetype][fade];
}

function removeAllButOneLine(lineToStay) {
    if (lineToStay != 'delta') {
        toggleFade(deltaline, 'delta', 'fade')
    }
    if (lineToStay != 'theta') {
        toggleFade(thetaline, 'theta', 'fade')
    }
    if (lineToStay != 'alpha') {
        toggleFade(alphaline, 'alpha', 'fade')
    }
    if (lineToStay != 'beta') {
        toggleFade(betaline, 'beta', 'fade')
    }
    if (lineToStay != 'gamma') {
        toggleFade(gammaline, 'gamma', 'fade')
    }
}

function addAllLines() {
    toggleFade(deltaline, 'delta', 'normal');
    toggleFade(thetaline, 'theta', 'normal');
    toggleFade(alphaline, 'alpha', 'normal');
    toggleFade(betaline, 'beta', 'normal');
    toggleFade(gammaline, 'gamma', 'normal');
}

function createGraph() {
    var smoothie = new SmoothieChart({
        maxValue: 1,
        minValue: 0,
        grid: {
            fillStyle:'rgba(0,0,0,0)',
            strokeStyle:'#79b133',
            verticalSections: 10
        }
    });
    smoothie.streamTo(document.getElementById('graph'), 1000);

    $('.graph-labels').css('display', 'inline-block');

    // data
    deltaline = new TimeSeries();
    addLine(smoothie, deltaline, 'delta');

    thetaline = new TimeSeries();
    addLine(smoothie, thetaline, 'theta');

    alphaline = new TimeSeries();
    addLine(smoothie, alphaline, 'alpha');

    betaline = new TimeSeries();
    addLine(smoothie, betaline, 'beta');

    gammaline = new TimeSeries();
    addLine(smoothie, gammaline, 'gamma');

    deltaarr = [];
    thetaarr = [];
    alphaarr = [];
    betaarr = [];
    gammaarr = [];

    return smoothie;
}

function addData(data, line, dataarr) {
    line.append(new Date().getTime(), data);
    dataarr.push(data);
}

$('#graph-container ul li:not(.active)')
  .css({ opacity: 0.4 })
  // now bind to anon non-active items
  .hover(function() {
      $(this).animate({ opacity: 1 });
      var graphid = $(this).attr('id');
      $('#graph-description').text(linemap[graphid]['description']).css('color', linemap[graphid]['normal']);
    }, function() {
      $(this).animate({ opacity: 0.4 });
     $('#graph-description').text('');
  });

$('li').hover(function() {
    $(this).toggleClass('active');
    // remove the lines for everything that is not active
    var i = $(this).attr('id');
    removeAllButOneLine(i);
  }, function() {
    // add back all the lines!
    addAllLines();
  });