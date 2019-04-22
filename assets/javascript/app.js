// Steps to complete:

//TODO: Make seconds count
//displays current time

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

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
  var trainTime = moment($("#first-train-input").val().trim(), "MM/DD/YYYY").format("X");
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

// Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.startTime);
  console.log(newTrain.frequency);

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


// First Time (pushed back 1 year to make sure it comes before current time)
// var firstTrainConverted = moment(trainTimeFormat).subtract(1, "years");
// console.log(firstTrainConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

// Difference between the times 
var diffTime = moment().diff(moment(trainTimeFormat), "minutes");
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
$('#current-time').text(moment(currentTime).format("HH:mm:ss"));


// Create the new row
var newRow = $("<tr>").append(
$("<td>").text(trainName),
$("<td>").text(trainDest),
$("<td>").text(trainFreq),
$("<td>").text(nextTrain),
$("<td>").text(minutesLeft),
);

// Append the new row to the table
$("#train-table > tbody").append(newRow);
});


