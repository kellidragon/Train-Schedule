
//TODO get values to show for next arrival + min away

var config = {
    apiKey: "AIzaSyAniS2axYd_0rY7PMa0dwDMsiqCUO4IAMc",
    authDomain: "train-schedule-81937.firebaseapp.com",
    databaseURL: "https://train-schedule-81937.firebaseio.com",
    projectId: "train-schedule-81937",
    storageBucket: "train-schedule-81937.appspot.com",
    messagingSenderId: "857977505382"
  };
  firebase.initializeApp(config);

  database = firebase.database();

// button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

// Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var trainTime =  moment($("#first-train-input").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#frequency-input").val().trim();


// local object for holding employee data
var newTrain = {
    name: trainName,
    destination: trainDest,
    startTime: trainTime,
    frequency: trainFreq
};

// Uploads train data to the database
database.ref().push(newTrain);

alert("Train successfully added");

// Clears all of the text-boxes
$("#train-name-input").val("");
$("#destination-input").val("");
$("#first-train-input").val("");
$("#frequency-input").val("");

});


// Firebase adding train to the database 
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().startTime;
    var trainFreq = childSnapshot.val().frequency;
  
    // Employee Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainTime);
    console.log(trainFreq);

// fix train start time format
var trainTimeFormat =moment.unix(trainTime).format('HH:mm');

console.log(trainTimeFormat)
// First Time (pushed back 1 year to make sure it comes before current time)
var firstTrainConverted = moment(trainTimeFormat).subtract(1, "years");
console.log(firstTrainConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

// Difference between the times 
var diffTime = moment().diff(moment.unix(firstTrainConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % trainFreq;
console.log( tRemainder);

var minutesLeft = trainFreq - tRemainder;
console.log('Min left:' + minutesLeft);


var nextTrain = minutesLeft + currentTime
parseInt(nextTrain);
console.log('Next train: ' + nextTrain)

//show current time at the top of the page

//set current time at top of page
var currentTime = document.getElementById('current-time');

function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  currentTime.textContent = h + ":" + m + ":" + s;
}

setInterval(time, 1000);
 
 

// Create the new row
var newRow = $("<tr>").append(
$("<td>").attr('scope','col').text(trainName),
$("<td>").attr('scope','col').text(trainDest),
$("<td>").attr('scope','col').text(trainFreq),
$("<td>").attr('scope','col').text(nextTrain),
$("<td>").attr('scope','col').text(minutesLeft),
);

// Append the new row to the table
$("#train-table > tbody").append(newRow);


})
