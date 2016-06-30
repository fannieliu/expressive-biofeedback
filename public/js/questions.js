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
    // start recording
    startQuestionRecording();
    study_started = true;
})

var current = 0;
$('#next').click(function() {
    if (study_started) {
        console.log('started');
        // TODO: don't let them move forward if they did not answer the question
        // TODO: add 2 min timer before showing next button
        // save the answer to the question
        saveCurrentAnswer();
        var answer_brain_activity = createAnswerBrainActivity();
        question_list[current]['brainactivity'] = answer_brain_activity;
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

var question_delta = [];
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

/********* EDIT MODE **********/
function displayEditMode() {
    $('#question-container').css('display', 'none');

    // instructions and answers
    // TODO add instructions for experimenter to remove muse
    $('#edit-container').css('display', 'block');
    $('#answer-container').css('display', 'inline-block');
    $('#edit-question').text(question_list[0]['question']);
    $('#edit-answer').text(question_list[0]['answer']);

    $('#visualization-container').css('display', 'inline-block');
    displayBrainActivity(0);
}

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
    eeg_line.clear();
    displayBrainActivity(current_edit);
    // update graph to show the current question's activity

    // TODO add E4
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
    eeg_line.clear();
    displayBrainActivity(current_edit);
    // update graph to show the current question's activity
});

/********* VISUALIZATIONS **********/
var eeg_line;
function displayBrainActivity(question_index) {
    var deltaactivity = question_list[question_index]['brainactivity']['delta'];
    // console.log(deltaactivity)
    var eeg_labels = [];
    for (var i = 0; i < deltaactivity.length; i++) {
        eeg_labels.push(i.toString());
    }
    var eeg_data = {
        labels: eeg_labels,
        datasets: [
            {
                label: 'Delta',
                fill: false,
                pointBackgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
                data: question_list[question_index]['brainactivity']['delta']
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
                }]
            }
        }
    });
}

function startQuestionRecording() {
    socket.on('delta_relative', function(data) {
        if (study_started) {
            question_delta.push(data);
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