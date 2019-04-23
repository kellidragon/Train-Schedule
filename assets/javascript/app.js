
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


// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(trainTimeFormat, "HH:mm").subtract(1, "years");


// Current Time
var currentTime = moment();

// Difference between the times 
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

// Time apart (remainder)
var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

//minutes until next train
var tMinutesTillTrain = trainFreq - tRemainder;

//time next train will arrive
var nextTrain = moment().add(tMinutesTillTrain, "minutes");

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
$("<td>").text(trainName),
$("<td>").text(trainDest),
$("<td>").text(trainFreq),
$("<td>").text(nextTrain),
$("<td>").text(tMinutesTillTrain),
$("<button>").text("Remove").addClass("remove-button")
);

// Append the new row to the table
$("#train-table > tbody").append(newRow);


//allow user to delete trains
$('.remove-button').on('click', function(event){
  $(this).closest('tr').remove()
})

})
