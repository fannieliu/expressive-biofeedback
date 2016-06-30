var question_list = [
    {'question': 'When was the last time you felt deeply moved? What moved you?'},
    {'question': 'What are you most looking forward to right now?'},
    {'question': 'If you had to pick something, what would you consider yourself a genius at?'},
    /*{'question': 'What’s your earliest memory?'},
    {'question': 'Tell me about a time when you’ve hurt someone else\'s feelings.'},
    {'question': 'When did you last cry in front of another person? By yourself?'},
    {'question': 'Share a time when you experienced failure.'},
    {'question': 'If you were given a day off on short notice, what would you do?'},
    {'question': 'Tell me about a time that made you question your beliefs or who you are as a person.'},
    {'question': 'What would you do in the event of a zombie apocalypse?'},
    {'question': 'If you had a million dollars to launch an idea that would change the world, what would it be?'},
    /*{'question': 'Share a vivid negative emotional memory that you have.'},
    {'question': 'What would you do in the event of a zombie apocolypse?'},
    {'question': 'List all the uses of a ____.'},
    {'question': 'What would you do if it was your last day on Earth?'},
    {'question': 'If you had a million dollars, how would you change the world?'},
    {'question': 'If you had a million dollars to launch your best entrepreneurial idea, what would it be?'},
    {'question': 'What do you think you were in a past life and why?'},
    {'question': 'If I was talking to your best friend, what would they say you need to work on?'},
    {'question': 'What\'s been going on lately?'},
    {'question': 'randommm'}*/
];

/********* INSTRUCTIONS **********/
$('#next-training').click(function() {
    $('#start-container').css('display', 'none');
    $('#training-container').css('display', 'block');
    // $('#visualization-container').css('display', 'inline-block');
    // $('#question-container').css('display', 'inline-block');
});

/********* START STUDY QUESTIONS **********/
var study_started = false;

$('#next-start').click(function() {
    $('#training-container').css('display', 'none');
    //$('#visualization-container').css('display', 'inline-block');
    $('#question-container').css('display', 'inline-block');
    // update the question text to the first one
    $('.question').text(question_list[0]['question']);
    // start recording for this question
    // stopSnapshotRecording(); // in case clicked start during training
    startQuestionRecording();
    study_started = true;
})

var graph_snapshot = [];
var new_snapshot_delta = [];
var new_snapshot_theta = [];
var new_snapshot_alpha = [];
var new_snapshot_beta = [];
var new_snapshot_gamma = [];

var question_delta = [];

var snapshot_recording = false;
var first = true;

// QUESTION
var current = 0;
$('#next').click(function() {
    if (study_started) {
        console.log('started');
        // TODO: don't let them move forward if they did not answer the question
        // TODO: add 2 min timer before showing next button
        // save the answer to the question
        saveCurrentAnswer();
        // stop the current snapshot recording if there is one
        /*if (snapshot_recording) {
            stopSnapshotRecording();
        }*/
        var answer_brain_activity = createAnswerBrainActivity();
        question_list[current]['brainactivity'] = answer_brain_activity;
        // question_list[current]['snapshots'] = graph_snapshot;
        // graph_snapshot = [];
        current += 1;
        // ALL QUESTIONS ANSWERED move on
        if (current >= question_list.length) {
            // stop the recording
            study_started = false;
            // TODO: SAVE CSV FILE WITH ALL THE STUFF SO YOU DON'T LOSE IT
            // GO TO EDIT MODE
            displayEditMode();
        } else { // go onto next question
            $('#answer-question').text(question_list[current]['question']);
        }
        console.log(question_list);
    } else { // this is the training case
        $('#answer-question').text('Question 2: Invisibility or flying? Why?');
    }
});

function createAnswerBrainActivity() {
    var activity = {};
    activity['delta'] = question_delta;
    // clear the other arrays
    question_delta = [];
    return activity;
}

function saveCurrentAnswer() {
    var answer = $('textarea#question-response').val();
    question_list[current]['answer'] = answer;
    $('textarea#question-response').val('');
}

function displayEditMode() {
    $('#question-container').css('display', 'none');

    // instructions and answers
    // TODO add instructions for experimenter to remove muse
    $('#edit-container').css('display', 'block');
    $('#answer-container').css('display', 'inline-block');
    $('#edit-question').text(question_list[0]['question']);
    $('#edit-answer').text(question_list[0]['answer']);

    // graph
    var linegraph = createGraph();
    $('#visualization-container').css('display', 'inline-block');
    // disconnectFromMuse();
    // clearGraphData();
    // linegraph.stop();
    //$('#visualization-record').css('display', 'none');
}

/********* EDIT MODE **********/
var current_edit = 0;
$('#edit-next').click(function() {
    if (current_edit == 0) {
        $('#edit-back').css('display', 'inline-block');
    }
    if (current_edit >= question_list.length-2) {
        $('#edit-next').css('display', 'none');
    }
    current_edit += 1;
    $('#edit-question').text(question_list[current_edit]['question']);
    $('#edit-answer').text(question_list[current_edit]['answer']);
    clearGraphData();
    // update graph to show the current question's activity
    // brain activity - question_list[current_edit]['brainactivity']
    // question_list[current_edit]['snapshots']
});

$('#edit-back').click(function() {
    current_edit -= 1;
    $('#edit-question').text(question_list[current_edit]['question']);
    $('#edit-answer').text(question_list[current_edit]['answer']);
    if (current_edit == 0) {
        $('#edit-back').css('display', 'none');
    }
    if (current_edit >= question_list.length-2) {
        $('#edit-next').css('display', 'inline-block');
    }
    // update graph to show the current question's activity
});

/********* GRAPH **********/
function startQuestionRecording() {
    socket.on('delta_relative', function(data) {
        if (study_started) {
            question_delta.push(data);
        }
        if (snapshot_recording && study_started) {
            console.log('delta snapshot recording');
            new_snapshot_delta.push(data);
        }
    });
    socket.on('theta_relative', function(data) {
    });
    socket.on('alpha_relative', function(data) {
    });
    socket.on('beta_relative', function(data) {
    });
    socket.on('gamma_relative', function(data) {
    });
}

var replayinterval;
function editModeStartReplayViz(brainactivity) {
    var deltaarr_replay = brainactivity['delta'];
    var index = 0;
    replayinterval = setInterval(function() {
        var delta_float = parseFloat(brainactivity['delta'][index]);
        /*var theta_float = parseFloat(brainactivity['theta'][index]);
        var alpha_float = parseFloat(brainactivity['alpha'][index]);
        var beta_float = parseFloat(brainactivity['beta'][index]);
        var gamma_float = parseFloat(brainactivity['gamma'][index]);
        */
        replayGraph(delta_float);//, theta_float, alpha_float, beta_float, gamma_float);
        index++;
    }, 1000);
    if (index > brainactivity['delta'].length) {
        clearInterval(replayinterval);
        started_replay = false;
    }
}

function replayGraph(delta_float) {//, theta_float, alpha_float, beta_float, gamma_float) {
    addData([delta_float], deltaline, deltaarr);
}

var paused_replay = false;
var started_replay = false;
$('#visualization-replay-button').click(function() {
    if (paused_replay && started_replay) {
        console.log('restart');
        linegraph.start();
    } else {
        started_replay = true;
        console.log('replay');
        editModeStartReplayViz(question_list[current_edit]['brainactivity']);
    }
    paused_replay = false;
});

$('#visualization-pause-button').click(function() {
    paused_replay = true;
    linegraph.stop();
});

/* snapshot recording
$('#visualization-toggle-rewind-button').click(function() {
    linegraph.options.scrollBackwards = true;
});

$('#visualization-restart-button').click(function() {
    clearGraphData();
    if (paused_replay) {
        linegraph.start();
    }
});


$('#visualization-record-button').click(function() {
    if (snapshot_recording) {
        stopSnapshotRecording();
    } else {
        startSnapshotRecording();
    }
});

function startSnapshotRecording() {
    snapshot_recording = true;
    $('#visualization-record-status').text('Brain activity snapshot being recorded');
    $('#visualization-record-button').text('Stop recording');
    $('#visualization-caption').css('display', 'block');
    if (study_started) {
        new_snapshot_delta = [];
    }
}

function stopSnapshotRecording() {
    snapshot_recording = false;
    $('#visualization-record-status').text('');
    $('#visualization-record-button').text('Start recording');
    $('#visualization-caption').css('display', 'none');
    if (study_started) {
        var new_snapshot = {}
        new_snapshot['delta'] = new_snapshot_delta;
        graph_snapshot.push(new_snapshot);
    }
} */