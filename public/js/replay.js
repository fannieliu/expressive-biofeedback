var deltaarr_replay, thetaarr_replay, alphaarr_replay, betaarr_replay, gammaarr_replay;

// brain wave csv file uploads

$('#csvfiles').change(function(e) {
    var files = e.target.files;
    if (files.length != 5) {
        alert('Please upload the 5 brain wave files (delta.csv, theta.csv, etc.)');
    }

    for (var i= 0; i < files.length; i++) {
        if (files[i].type != 'text/csv') {
            alert(files[i].name + ' is not a csv file!');
        }
        (function(file) {
            var name = file.name;
            var reader = new FileReader();
            reader.onload = function(e) {
                var csvarr = e.target.result.split('\n');
                switch (name) {
                    case 'delta.csv':
                        deltaarr_replay = csvarr;
                        break;
                    case 'theta.csv':
                        thetaarr_replay = csvarr;
                        break;
                    case 'alpha.csv':
                        alphaarr_replay = csvarr;
                        break;
                    case 'beta.csv':
                        betaarr_replay = csvarr;
                        break;
                    case 'gamma.csv':
                        gammaarr_replay = csvarr;
                        break;
                    default:
                        alert('Please upload files only named delta.csv, theta.csv, etc.');
                }
                return false;
            }
            reader.readAsText(file);
        })(files[i]);
    }
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
    // emoji and colors config
    var max = getMaxAllArr();
    var shift = 1 - max;

    // swirl config
    var config = getSwirlConfig();
    var swirl = new CanvasSwirl(
        document.getElementById('swirl_surface'), config);

    // line config
    linegraph = createGraph();

    // light config
    socket = io.connect();
    socket.emit('openport');
    var replayaud = document.getElementById('replay-audio-player');
    replayaud.onended = function() {
        socket.emit('closeport');
    }

    //sliders config
    var delta_slide = 
      d3.select("#delta-slide").select("svg").append("svg")
        .attr("x", deltaarr_replay[0])
        .attr("width", 195)
        .attr("height",195);
    delta_slide.append("circle")
      .attr("cx", 96)
      .attr("cy", 96)
      .attr("r", 90)
      .style("fill", "rgb(141,186,106)");
    delta_slide.append("text")
      .attr("x", 79.5)
      .attr("y", 115.5)
      .style("fill", "white")
      .style("font-size", "68")
      .text("\u03b4");

    var alpha_slide = 
      d3.select("#alpha-slide").select("svg").append("svg")
        .attr("x",alphaarr_replay[0])
        .attr("width", 195)
        .attr("height", 195);
    alpha_slide.append("circle")
      .attr("cx", 96)
      .attr("cy", 96)
      .attr("r", 90)
      .style("fill", "rgb(128,201,232)");
    alpha_slide.append("text")
      .attr("x", 79.5)
      .attr("y", 115.5)
      .style("fill", "white")
      .style("font-size", "68")
      .text("\u03b1");
                    
    var beta_slide = 
      d3.select("#beta-slide").select("svg").append("svg")
        .attr("x",betaarr_replay[0])
        .attr("width", 195)
        .attr("height", 195);
    beta_slide.append("circle")
      .attr("cx", 96)
      .attr("cy", 96)
      .attr("r", 90)
      .style("fill", "rgb(218,198,0)");
    beta_slide.append("text")
      .attr("x", 79.5)
      .attr("y", 115.5)
      .style("fill", "white")
      .style("font-size", "68")
      .text("\u03b2");

    var index = 0;


    setInterval(function() {
        if (deltaarr_replay[index] == 'start,start,start,start') {
            startAudio();
        } else if (deltaarr_replay[index] == 'end,end,end,end') {
            // do nothing
        } else {
            var delta_float = parseFloat(deltaarr_replay[index]);
            var theta_float = parseFloat(thetaarr_replay[index]);
            var alpha_float = parseFloat(alphaarr_replay[index]);
            var beta_float = parseFloat(betaarr_replay[index]);
            var gamma_float = parseFloat(gammaarr_replay[index]);

            replayGraph(delta_float, theta_float, alpha_float, beta_float, gamma_float);
            replayEmoji(delta_float+shift, theta_float+shift, alpha_float+shift, beta_float+shift, gamma_float+shift);
            replaySwirl(swirl, delta_float, theta_float, alpha_float, beta_float, gamma_float);
            replayColors(delta_float+shift, theta_float+shift, alpha_float+shift, beta_float+shift, gamma_float+shift);
            replaySliders(delta_slide, alpha_slide, beta_slide, delta_float, theta_float, alpha_float, beta_float, gamma_float);
            // replayLight(index);
        }
        index++;
    }, 1000);
}

function replayGraph(delta_float, theta_float, alpha_float, beta_float, gamma_float) {
    addData([delta_float], deltaline, deltaarr);
    addData([theta_float], thetaline, thetaarr);
    addData([alpha_float], alphaline, alphaarr);
    addData([beta_float], betaline, betaarr);
    addData([gamma_float], gammaline, gammaarr);
    max = delta_float;
    max_line = 'delta';
    if (alpha_float > max) {
        max = alpha_float;
        max_line = 'alpha';
    }
    if (beta_float > max) {
        max_line = 'beta';
    }
    removeAllButOneLine(max_line);
}

function replayEmoji(delta_float, theta_float, alpha_float, beta_float, gamma_float) {
    $('#delta-emoji').animate({opacity: delta_float});
    $('#theta-emoji').animate({opacity: theta_float});
    $('#alpha-emoji').animate({opacity: alpha_float});
    $('#beta-emoji').animate({opacity: beta_float});
    $('#gamma-emoji').animate({opacity: gamma_float});
}

function replaySwirl(my_swirl, delta_float, theta_float, alpha_float, beta_float, gamma_float){
    var new_config = getSwirlConfig();
    updateSwirl(new_config, delta_float, theta_float, alpha_float, beta_float, gamma_float);
    my_swirl.applyConfig(new_config);
}

function replaySliders(delta_slide, alpha_slide, beta_slide, delta_float, theta_float, alpha_float, beta_float, gamma_float){
    delta_slide.transition()
      .duration(750)
      .attr("x", delta_float*1500);
    alpha_slide.transition()
      .duration(750)
      .attr("x", alpha_float*1500);
    beta_slide.transition()
      .duration(750)
      .attr("x", beta_float*1500);
}

function replayColors(delta_float, theta_float, alpha_float, beta_float, gamma_float) {
    $('#delta-color').animate({opacity: delta_float});
    $('#theta-color').animate({opacity: theta_float});
    $('#alpha-color').animate({opacity: alpha_float});
    $('#beta-color').animate({opacity: beta_float});
    $('#gamma-color').animate({opacity: gamma_float});
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
    /*if (theta_float > max) {
        max = theta_float;
        sendData = 't';
    }*/
    if (alpha_float > max) {
        max = alpha_float;
        sendData = 'a';
    }
    if (beta_float > max) {
        max = beta_float;
        sendData = 'b';
    }
    /*if (gamma_float > max) {
        max = gamma_float;
        sendData = 'g'
    }*/
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
