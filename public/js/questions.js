var question_list = [
    {'question': 'When was the last time you felt deeply moved? What moved you?'},
    {'question': 'What are you most looking forward to right now?'},
    {'question': 'If you had to pick something\, what would you consider yourself a genius at?'},
    {'question': 'What is the greatest accomplishment of your life?'},
    {'question': 'Tell me about a time when you’ve hurt someone else\'s feelings.'},
    {'question': 'When did you last cry in front of another person? By yourself?'},
    {'question': 'Share a time when you experienced failure.'},
    {'question': 'Tell me about a time that made you question your beliefs or who you are as a person.'},
    {'question': 'What would you do in the event of a zombie apocalypse?'},
    {'question': 'If you had a million dollars to launch an idea that would change the world, what would it be?'},
];

var mental_cleansing_questions = [
    {'question': 'If you were given a day off on short notice, what would you do?'},
    {'question': 'What’s your earliest memory?'}
]

/********* RANDOMLY GENERATE QUESTIONS *********/
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleQuestions(){
    var question_list_shuffled = shuffle(question_list);
    // add mental cleansing question 1
    question_list_shuffled.splice(3, 0, mental_cleansing_questions[0]);
    question_list_shuffled.join();
    // add mental cleansing question 2
    question_list_shuffled.splice(7, 0, mental_cleansing_questions[1]);
    question_list_shuffled.join();
    return question_list_shuffled;
}

/********* START STUDY QUESTIONS **********/
var study_started = false;

$('#next-start').click(function() {
    $('#start-container').css('display', 'none');
    $('#question-container').css('display', 'inline-block');
    question_list = shuffleQuestions();
    // update the question text to the first one
    $('.question').text(question_list[0]['question']);
    // start recording
    study_started = true;
    startQuestionRecordingHRV();
    startQuestionRecordingEEG();
    var minutes = 60 * 2, display = $('#time');
    startTimer(minutes, display);
})

var current = 0;
function nextQuestion() {
    if (study_started) {
        console.log('started');
        // TODO: don't let them move forward if they did not answer the question
        // TODO: add 2 min timer before showing next button
        // save the answer to the question
        saveCurrentAnswer();
        var answer_eeg = createAnswerEEG();
        var answer_hrv = createAnswerHRV();
        question_list[current]['brainactivity'] = answer_eeg;
        question_list[current]['hrv'] = answer_hrv['hrv'];
        current += 1;
        // ALL QUESTIONS ANSWERED move on
        if (current >= question_list.length) {
            // stop the recording
            study_started = false;
            // TODO: SAVE CSV FILE WITH ALL THE STUFF SO YOU DON'T LOSE IT
            // GO TO EDIT MODE
            displayEditMode();
            clearInterval(question_timer);
        } else { // go onto next question
            $('#answer-question').text(question_list[current]['question']);
        }
        console.log(question_list);
    } else { // this is the training case
        $('#answer-question').text('Question 2: Invisibility or flying? Why?');
    }
};

var question_beta = [];
function createAnswerEEG() {
    var activity = {};
    activity['beta'] = question_beta;
    // clear the other arrays
    question_beta = [];
    return activity;
}

var question_hrv = [];
function createAnswerHRV() {
    var activity = {};
    activity['hrv'] = question_hrv;
    // clear the other arrays
    question_hrv = [];
    return activity;
}

function saveCurrentAnswer() {
    var answer = $('textarea#question-response').val();
    question_list[current]['answer'] = answer.replace(/\n\r?/g, '<br/>');;
    console.log(question_list[current]['answer']);
    $('textarea#question-response').val('');
}

var question_timer;
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    question_timer = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            // skip to next question
            nextQuestion();
            timer = duration;
        }
    }, 1000);
}

/********* EDIT MODE **********/
function displayEditMode() {
    $('#question-container').css('display', 'none');
    // instructions and answers
    // TODO add instructions for experimenter to remove muse
    $('#edit-container').css('display', 'block');
}

$('#next-survey').click(function() {
    $('#edit-container').css('display', 'none');
    $('#edit-mode-container').css('display', 'inline-block');
    $('#edit-question').text(question_list[0]['question']);
    $('#edit-answer').html(question_list[0]['answer']);
    displayGraphs(0);
    // $('#share-eeg').prop('checked', question_list[0]['includeEEG']);
    // $('#share-hrv').prop('checked', question_list[0]['includeHRV'])
});

var current_edit = 0;
$('#edit-next').click(function() {
    // should go to questionnaire page
    displaySurvey();
});

$('#edit-next-survey').click(function() {
    // should go to the next question
    // save all the survey answers and clear
    var is_all_filled = saveAndClearSurveyResponses(current_edit);
    // display edit questions
    if (is_all_filled) {
        displayEditModeFromSurvey();
        nextEditQuestion();
    }
})

/* $('#edit-back').click(function() {
    // save the checkbox values before moving backward
    saveCurrentCheckbox(current_edit);
    current_edit -= 1;
    $('#edit-question').text(question_list[current_edit]['question']);
    $('#edit-answer').text(question_list[current_edit]['answer']);
    // set the checkbox value to the right one
    setCurrentCheckbox(current_edit);
    if (current_edit == 0) {
        $('#edit-back').css('display', 'none');
    }
    if (current_edit >= question_list.length-2) {
        $('#edit-next').css('display', 'inline-block');
    }
    eeg_line.clear();
    displayEEG(current_edit);
    // update graph to show the current question's activity
}); */

function nextEditQuestion() {
    if (current_edit == 0) {
        $('#edit-back').css('display', 'inline-block');
    }
    // save the checkbox values before moving forward
    saveCurrentCheckbox(current_edit);

    if (current_edit >= question_list.length-1) {
        displaySubmissionPage();
        return;
        // $('#edit-next').css('display', 'none');
    }

    current_edit += 1;

    // set the next checkbox values
    setCurrentCheckbox(current_edit);

    $('#edit-question').text(question_list[current_edit]['question']);
    $('#edit-answer').html(question_list[current_edit]['answer']);
    //eeg_line.clear();
    eeg_line.destroy();
    //hrv_line.clear();
    hrv_line.destroy();
    displayGraphs(current_edit);
}

function saveCurrentCheckbox(question_index) {
    question_list[question_index]['includeEEG'] = $('#share-eeg').is(":checked");
    question_list[question_index]['includeHRV'] = $('#share-hrv').is(":checked");
}

function setCurrentCheckbox(question_index) {
    $('#share-eeg').prop('checked', false);
    $('#share-hrv').prop('checked', false);
}

/********* QUESTIONNAIRE **********/
function displaySurvey() {
    $('#edit-mode-container').css('display', 'none');
    $('#edit-mode-survey-container').css('display', 'block');
}

function displayEditModeFromSurvey() {
    $('#edit-mode-survey-container').css('display', 'none');
    $('#edit-mode-container').css('display', 'block');
}

function saveAndClearSurveyResponses(question_index) {
    // check text area input
    var has_empty = false;
    $('textarea.inside').each(function(){
        if (has_empty) {
            return;
        }
        if (this.value == '') {
            alert("Please answer all of the questions.")
            has_empty = true;
        }
    });
    if (has_empty) {
        return;
    }

    // eeg meaning
    question_list[question_index]['eegmeaning'] = $('textarea#eegmeaning').val().replace(/\n\r?/g, '<br/>');
    // hrv meaning
    question_list[question_index]['hrvmeaning'] = $('textarea#hrvmeaning').val().replace(/\n\r?/g, '<br/>');
    // why eeg show/hide
    question_list[question_index]['whyeeg'] = $('textarea#whyeeg').val().replace(/\n\r?/g, '<br/>');
    // why hrv show/hide
    question_list[question_index]['whyhrv'] = $('textarea#whyhrv').val().replace(/\n\r?/g, '<br/>');

    // traits
    $('input.radio-survey').each(function(){
        if (has_empty) {
            return;
        }
        var name = $(this).attr('name');
        if (!$('input[name=' + name + ']:checked').length) {
            alert("Please answer all of the questions.");
            has_empty = true;
        }
    });
    if (has_empty) {
        return;
    }
    question_list[question_index]['trait1'] = $('input[name=trait1]:checked').val();
    question_list[question_index]['trait2'] = $('input[name=trait2]:checked').val();;
    question_list[question_index]['trait3'] = $('input[name=trait3]:checked').val();;
    question_list[question_index]['trait4'] = $('input[name=trait4]:checked').val();;
    question_list[question_index]['trait5'] = $('input[name=trait5]:checked').val();;
    question_list[question_index]['trait6'] = $('input[name=trait6]:checked').val();;
    question_list[question_index]['trait7'] = $('input[name=trait7]:checked').val();;
    question_list[question_index]['trait8'] = $('input[name=trait8]:checked').val();;
    question_list[question_index]['trait9'] = $('input[name=trait9]:checked').val();;
    question_list[question_index]['trait10'] = $('input[name=trait10]:checked').val();;

    // mind attr
    question_list[question_index]['mindattr1'] = $('input[name=mindattr1]:checked').val();
    question_list[question_index]['mindattr2'] = $('input[name=mindattr2]:checked').val();;
    question_list[question_index]['mindattr3'] = $('input[name=mindattr3]:checked').val();;
    question_list[question_index]['mindattr4'] = $('input[name=mindattr4]:checked').val();;
    question_list[question_index]['mindattr5'] = $('input[name=mindattr5]:checked').val();;
    question_list[question_index]['mindattr6'] = $('input[name=mindattr6]:checked').val();;
    question_list[question_index]['mindattr7'] = $('input[name=mindattr7]:checked').val();;
    question_list[question_index]['mindattr8'] = $('input[name=mindattr8]:checked').val();;
    question_list[question_index]['mindattr9'] = $('input[name=mindattr9]:checked').val();;
    question_list[question_index]['mindattr10'] = $('input[name=mindattr10]:checked').val();;

    // CLEAR EVERYTHING
    $('textarea#eegmeaning').val('');
    $('textarea#hrvmeaning').val('');
    $('textarea#whyeeg').val('');
    $('textarea#whyhrv').val('');

    $('input[name=trait1]').attr('checked', false);
    $('input[name=trait2]').attr('checked', false);
    $('input[name=trait3]').attr('checked', false);
    $('input[name=trait4]').attr('checked', false);
    $('input[name=trait5]').attr('checked', false);
    $('input[name=trait6]').attr('checked', false);
    $('input[name=trait7]').attr('checked', false);
    $('input[name=trait8]').attr('checked', false);
    $('input[name=trait9]').attr('checked', false);
    $('input[name=trait10]').attr('checked', false);

    $('input[name=mindattr1]').attr('checked', false);
    $('input[name=mindattr2]').attr('checked', false);
    $('input[name=mindattr3]').attr('checked', false);
    $('input[name=mindattr4]').attr('checked', false);
    $('input[name=mindattr5]').attr('checked', false);
    $('input[name=mindattr6]').attr('checked', false);
    $('input[name=mindattr7]').attr('checked', false);
    $('input[name=mindattr8]').attr('checked', false);
    $('input[name=mindattr9]').attr('checked', false);
    $('input[name=mindattr10]').attr('checked', false);

    return true;
}


/********* VISUALIZATIONS **********/
function displayGraphs(question_index) {
    displayEEG(question_index);
    displayHRV(question_index);
}

var eeg_line;
function displayEEG(question_index) {
    var beta = question_list[question_index]['brainactivity']['beta'];
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
function displayHRV(question_index) {
    var hrv = question_list[question_index]['hrv'];
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
                data: question_list[question_index]['hrv']
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

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function startQuestionRecordingHRV() {
   	var index = 0;
   	var ibiarr = [];
    setInterval(function(){
        if (study_started) {
            // get current data in text file and update array every second
            $.get("text/ibiData.txt", function(data) {
                ibiarr = data.split(",");
            }).done(function() {
                question_hrv.push(60 / ibiarr[index]);
                index++;
            });
        }
    }, 1000);
}

function startQuestionRecordingEEG() {
    socket.on('delta_relative', function(data) {
    });
    socket.on('theta_relative', function(data) {
    });
    socket.on('alpha_relative', function(data) {
    });
    socket.on('beta_relative', function(data) {
    });
    socket.on('gamma_relative', function(data) {
    });
    socket.on('beta_session', function(data) {
        if (study_started) {
            question_beta.push(data);
        }
    });}



/********* SUBMISSION **********/
// TODO ADD CHECK FOR EMPTY VALUES

function displaySubmissionPage() {
    $('#edit-mode-container').css('display', 'none');
    $('#submission-container').css('display', 'block');
}

function saveAllToCSV() {
    var header = Object.keys(question_list[0]);
    var data = [];
    data.push(['sep=|']); // make sure the separator is different
    data.push(header);
    for (var i = 0; i < question_list.length; i++) {
        var question_data = [];
        for (var j = 0; j < header.length; j++) {
            if (header[j] == 'brainactivity') {
                question_data.push(question_list[i]['brainactivity']['beta']);
            } else {
                question_data.push(question_list[i][header[j]]);
            }
        }
        data.push(question_data);
    }
    var csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(infoArray, index){
       dataString = infoArray.join("|");
       csvContent += index < data.length ? dataString+ "\n" : dataString;

    });
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

/*$('#submit-back').click(function() {
    $('#edit-mode-container').css('display', 'block');
    $('#submission-container').css('display', 'none');
});*/

$('#submit-final').click(function() {
    $('#submission-container').css('display', 'none');
    $('#final-survey-container').css('display', 'block');
    saveAllToCSV();
});
