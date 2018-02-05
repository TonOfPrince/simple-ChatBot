/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am FunnyBot a simple joke chat bot example."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket, "What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', data => { // If we get a new message from the client we process it;
        console.log(data);
        questionNum = bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum === 0) {
    answer = `Hello ${input}! You look like you could use a laugh!`;// output response
    waitTime = 2000;
    question = 'Do you want to hear a joke?';	// load next question
  } else if (questionNum === 1) {
    if (input.toLowerCase() === 'yes') {
      answer = `Great! One joke coming right up!`;// output response
      question = 'Knock Knock!'; // load next question
    } else if (input.toLowerCase() === 'no') {
      answer = `Too bad! I'm a joke bot and I my only purpose is to tell jokes!`;// output response
      question = 'Knock Knock!'; // load next question
    } else {
      answer = `I don't understand, so a joke it is!`;// output response
      question = 'Knock Knock!'; // load next question
    }
    waitTime = 2000;
  } else if (questionNum === 2) {
    if (input.toLowerCase() === `who's there?` || input.toLowerCase() === `whos there?` || input.toLowerCase() === `who's there` || input.toLowerCase() === `whos there`) {
      answer = '';// output response
      waitTime = 0;
      question = 'Nana';			    	// load next question
    } else {
      answer = `Is this your first knock knock joke? Ask me 'who's there?'!`;// output response
      question = 'Knock Knock!'; // load next question
      waitTime = 5000;
      questionNum--;
    }
  } else if (questionNum === 3) {
    if (input.toLowerCase() === 'nana who?' || input.toLowerCase() === 'nana who'){
      answer = 'Nana your business! Hahahahahahahhaahaha';
      question = '';
      waitTime = 5000;
    } else {
      answer = `Is this your first knock knock joke? Ask me 'nana who?'!`;// output response
      question = 'Nana'; // load next question
      waitTime = 5000;
      questionNum--;
    }
  }


// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return questionNum+1;
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
