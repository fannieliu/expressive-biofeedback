var question_list = {};
$('#csvreview').change(function(e) {
    var file = e.target.files[0];
    var name = file.name;
    var reader = new FileReader();
    console.log('test');
    reader.onload = function(e) {
        var csvarr = e.target.result.split('\n');
        for (var i = 2; i < csvarr.length; i++) {
            var data = csvarr[i].split('|');
            question_list[i-2] = {};
            question_list[i-2]['question'] = data[0];
            console.log(data[3]);
            var eeg = data[3].split(',');
            var new_eeg = [];
            for(var j = 0; j < eeg.length; j++) {
                new_eeg.push(parseFloat(eeg[j]));
            }
            question_list[i-2]['eeg'] = new_eeg;

            var hrv = data[4].split(',');
            var new_hrv = [];
            for(var j = 0; j < hrv.length; j++) {
                new_hrv.push(parseFloat(hrv[j]));
            }
            question_list[i-2]['hrv'] = new_hrv;
            /*var eda = data[5].split(',');
            var new_eda = [];
            for(var j = 0; j < eda.length; j++) {
                new_eda.push(parseFloat(eda[j]));
            }
            question_list[i-2]['eda'] = new_eda;*/
        }
        //console.log(csvarr[1]);
        //console.log('test');
    }
    reader.readAsText(file);
});

var current_index = 3;
function readcsv() {
    console.log(question_list);
    displayEEGReview(3);
    displayHRVReview(3);
    $('#viz-buttons').css('display', 'block')
}


// 3 (next) 4 (prev, next) 5 (prev)
function prevGraph() {
    if (current_index == 4) {
        $('#prevGraphReview').css('display', 'none');
    } else if (current_index == 5) {
        // $('#prevGraphReview').css('display', 'inline-block');
        $('#nextGraphReview').css('display', 'inline-block');
    }
    current_index--;

    eeg_line.destroy();
    hrv_line.destroy();
    //eda_line.destroy();
    displayEEGReview(current_index);
    displayHRVReview(current_index);
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
    // eda_line.destroy();
    displayEEGReview(current_index);
    displayHRVReview(current_index);
}

var eeg_line;
function displayEEGReview(current_index) {
    var beta = question_list[current_index]['eeg'];
    var baseline = question_list[0]['eeg'];
    var cognitive = question_list[1]['eeg'];
    var emotional = question_list[2]['eeg'];
    // console.log(deltaactivity)
    var eeg_labels = [];
    for (var i = 0; i < beta.length; i++) {
        eeg_labels.push(i.toString());
    }
    var eeg_data = {
        labels: eeg_labels,
        datasets: [
            {
                label: 'EEG',
                fill: false,
                pointBackgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
                data: beta
            },
            {
                label: 'Baseline EEG',
                fill: false,
                pointBackgroundColor: 'rgb(255, 204, 0)',
                borderColor: 'rgb(255, 204, 0)',
                data: baseline
            },
            {
                label: 'Cognitive EEG',
                fill: false,
                pointBackgroundColor: 'rgb(51, 204, 51)',
                borderColor: 'rgb(51, 204, 51)',
                data: cognitive
            },
            {
                label: 'Emotional EEG',
                fill: false,
                pointBackgroundColor: 'rgb(204, 51, 255)',
                borderColor: 'rgb(204, 51, 255)',
                data: emotional
            }
        ]
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
    var hrv = question_list[current_index]['hrv'];
    var baseline = question_list[0]['hrv'];
    var cognitive = question_list[1]['hrv'];
    var emotional = question_list[2]['hrv'];
    var hrv_labels = [];
    for (var i = 0; i < hrv.length; i++) {
        hrv_labels.push(i.toString());
    }
    var hrv_data = {
        labels: hrv_labels,
        datasets: [
            {
                label: 'HRV',
                fill: false,
                pointBackgroundColor: 'rgba(222, 74, 74, 1)',
                borderColor: 'rgba(222, 74, 74, 1)',
                data: hrv
            },
            {
                label: 'Baseline HRV',
                fill: false,
                pointBackgroundColor: 'rgb(255, 204, 0)',
                borderColor: 'rgb(255, 204, 0)',
                data: baseline
            },
            {
                label: 'Cognitive HRV',
                fill: false,
                pointBackgroundColor: 'rgb(51, 204, 51)',
                borderColor: 'rgb(51, 204, 51)',
                data: cognitive
            },
            {
                label: 'Emotional HRV',
                fill: false,
                pointBackgroundColor: 'rgb(204, 51, 255)',
                borderColor: 'rgb(204, 51, 255)',
                data: emotional
            }
        ]
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
    var eda = question_list[current_index]['eda'];
    var baseline = question_list[0]['eda'];
    var cognitive = question_list[1]['eda'];
    var emotional = question_list[2]['eda'];
    var eda_labels = [];
    for (var i = 0; i < eda.length; i++) {
        eda_labels.push(i.toString());
    }
    var eda_data = {
        labels: eda_labels,
        datasets: [
            {
                label: 'EDA',
                fill: false,
                pointBackgroundColor: 'rgb(255, 102, 0)',
                borderColor: 'rgb(255, 102, 0)',
                data: eda
            },
            {
                label: 'Baseline EDA',
                fill: false,
                pointBackgroundColor: 'rgb(255, 204, 0)',
                borderColor: 'rgb(255, 204, 0)',
                data: baseline
            },
            {
                label: 'Cognitive EDA',
                fill: false,
                pointBackgroundColor: 'rgb(51, 204, 51)',
                borderColor: 'rgb(51, 204, 51)',
                data: cognitive
            },
            {
                label: 'Emotional EDA',
                fill: false,
                pointBackgroundColor: 'rgb(204, 51, 255)',
                borderColor: 'rgb(204, 51, 255)',
                data: emotional
            }
        ]
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