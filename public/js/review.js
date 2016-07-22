var question_list = [];
var baselineq = 'This is a baseline test. Please clear your mind and do not make any sudden movements so that we can record your baseline physiological activity.';
var audioq = 'Please close your eyes and listen to this audio clip. You may open your eyes when the audio stops playing. You will automatically be moved to the next question afterwards.';
var memoryq = 'Please share a vivid emotional memory and write out your answer in the word document provided.';
var paperclipq = 'Please write out all the uses of a paper clip in the word document provided.';

$('#csvreview').change(function(e) {
    question_list = [];
    var file = e.target.files[0];
    var name = file.name;
    var reader = new FileReader();
    console.log('test');
    reader.onload = function(e) {
        var csvarr = e.target.result.split('\n');
        for (var i = 2; i < csvarr.length; i++) {
            var data = csvarr[i].split('|');
            var question_info = {};
            question_info['question'] = data[0];
            switch (data[0]) {
                case baselineq:
                    question_info['color'] = 'rgb(255, 204, 0)';
                    question_info['label'] = 'baseline';
                    break;
                case audioq:
                    question_info['color'] = 'rgb(204, 51, 255)';
                    question_info['label'] = 'audio';
                    break;
                case memoryq:
                    question_info['color'] = 'rgb(255, 128, 255)';
                    question_info['label'] = 'emotion';
                    break;
                case paperclipq:
                    question_info['color'] = 'rgb(51, 204, 51)';
                    question_info['label'] = 'cognitive';
                    break;
                default:
                    console.log('default');
                    question_info['color'] = getRandomColor();
                    question_info['label'] = data[0].split(':')[1];
                    break;
            }
            var eeg = data[3].split(',');
            var new_eeg = [];
            for(var j = 0; j < eeg.length; j++) {
                new_eeg.push(parseFloat(eeg[j]));
            }
            question_info['eeg'] = new_eeg;

            var hrv = data[4].split(',');
            var new_hrv = [];
            for(var j = 0; j < hrv.length; j++) {
                new_hrv.push(parseFloat(hrv[j]));
            }
            question_info['hrv'] = new_hrv;
            var eda = data[5].split(',');
            var new_eda = [];
            for(var j = 0; j < eda.length; j++) {
                new_eda.push(parseFloat(eda[j]));
            }
            question_info['eda'] = new_eda;
            question_list.push(question_info);
        }

    }
    reader.readAsText(file);
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var current_index = 3;
function readcsv() {
    if (eeg_line != null) {
        eeg_line.destroy();
        hrv_line.destroy();
        eda_line.destroy();
    }

    console.log(question_list);
    displayEEGReview(3);
    displayHRVReview(3);
    displayEDAReview(3);

    $('#viz-buttons').css('display', 'block')
}

/*function prevGraph() {
    if (current_index == 4) {
        $('#prevGraphReview').css('display', 'none');
    } else if (current_index == 5) {
        // $('#prevGraphReview').css('display', 'inline-block');
        $('#nextGraphReview').css('display', 'inline-block');
    }
    current_index--;

    eeg_line.destroy();
    hrv_line.destroy();
    eda_line.destroy();
    eda_line.destroy();
    displayEEGReview(current_index);
    displayHRVReview(current_index);
    displayEDAReview(current_index);
}

function nextGraph() {
    if (current_index == 4) {
        $('#nextGraphReview').css('display', 'none');
    } else if (current_index == 3) {
        // $('#nextGraphReview').css('display', 'inline-block');
        $('#prevGraphReview').css('display', 'inline-block');
    }
    current_index++;

    eeg_line.destroy();
    hrv_line.destroy();
    eda_line.destroy();
    displayEEGReview(current_index);
    displayHRVReview(current_index);
    displayEDAReview(current_index);
}*/

var eeg_line;
function displayEEGReview(current_index) {
    var eeg_labels = [];
    for (var i = 0; i < 121; i++) {
        eeg_labels.push(i.toString());
    }
    var question_data = [];
    for (var i = 0; i < question_list.length; i++) {
        var dataset = {};
        dataset['label'] = question_list[i]['label'];
        dataset['fill'] = false;
        dataset['pointBackgroundColor'] = question_list[i]['color'];
        dataset['pointRadius'] = 0;
        dataset['borderColor'] = question_list[i]['color'];
        dataset['data'] = question_list[i]['eeg'];
        question_data.push(dataset);
    }
    var eeg_data = {
        labels: eeg_labels,
        datasets: question_data
    }
    var ctx = $('#eeg-graph');
    eeg_line = new Chart(ctx, {
        type: 'line',
        data: eeg_data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        steps: 5,
                        stepValue: 0.2,
                        max: 1
                    }
                }],
                xAxes: [{
                    display: false
                }]
            }
        }
    });
}

var hrv_line;
function displayHRVReview(current_index) {
    var hrv_labels = [];
    for (var i = 0; i < 121; i++) {
        hrv_labels.push(i.toString());
    }
    var question_data = [];
    for (var i = 0; i < question_list.length; i++) {
        var dataset = {};
        dataset['label'] = question_list[i]['label'];
        dataset['fill'] = false;
        dataset['pointBackgroundColor'] = question_list[i]['color'];
        dataset['pointRadius'] = 0;
        dataset['borderColor'] = question_list[i]['color'];
        dataset['data'] = question_list[i]['hrv'];
        question_data.push(dataset);
    }
    var hrv_data = {
        labels: hrv_labels,
        datasets: question_data
    }
    var ctx = $('#hrv-graph');
    hrv_line = new Chart(ctx, {
        type: 'line',
        data: hrv_data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 20,
                        steps: 5,
                        stepValue: 0.2,
                        max: 120
                    }
                }],
                xAxes: [{
                    display: false
                }]
            }
        }
    });
}

var eda_line;
function displayEDAReview(current_index) {
    var eda_labels = [];
    for (var i = 0; i < 121; i++) {
        eda_labels.push(i.toString());
    }
    var question_data = [];
    for (var i = 0; i < question_list.length; i++) {
        var dataset = {};
        dataset['label'] = question_list[i]['label'];
        dataset['fill'] = false;
        dataset['pointBackgroundColor'] = question_list[i]['color'];
        dataset['pointRadius'] = 0;
        dataset['borderColor'] = question_list[i]['color'];
        dataset['data'] = question_list[i]['eda'];
        question_data.push(dataset);
    }
    var eda_data = {
        labels: eda_labels,
        datasets: question_data
    }
    var ctx = $('#eda-graph');
    eda_line = new Chart(ctx, {
        type: 'line',
        data: eda_data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        steps: 5,
                        stepValue: 0.2,
                        max: 2
                    }
                }],
                xAxes: [{
                    display: false
                }]
            }
        }
    });
}