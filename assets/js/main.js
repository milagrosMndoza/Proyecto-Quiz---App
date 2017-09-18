'use strict';

// Model

function Question(stem, choices, answer) {
	this.stem = stem;
	this.choices = choices;
	this.answer = answer
  }
  
  Question.prototype.checkAnswer = function(choice) {
	return (choice === this.answer);
  }
  
  // Controlador
  
  function Quiz(questionList) {
	this.score = 0;
	this.questionList = questionList;
	this.questionNo = 0;
  };
  
  Quiz.prototype.getCurrentQuestion = function() {
	return this.questionList[this.questionNo];
  };
  
  Quiz.prototype.isEnded = function() {
	return this.questionNo == this.questionList.length;
  };
  
  Quiz.prototype.evaluateAnswer = function(answer) {
	if (this.getCurrentQuestion().checkAnswer(answer)) {
	  this.score++;
	};
	this.questionNo++;
  }
  
  // Vistas
  
  function populate() {
	if (quiz.isEnded()) {
	  showScores();
	} else {
	  let element = document.getElementById('stem');
	  element.innerHTML = quiz.getCurrentQuestion().stem;
  
	  for (let i = 0; i < quiz.getCurrentQuestion().choices.length; i++) {
		let element = document.getElementById('option' + i);
		element.innerHTML = quiz.getCurrentQuestion().choices[i];
		checkAnswer('option' + i, quiz.getCurrentQuestion().choices[i]);
		recordProgress();
	  };
	}
  };
  
  function showScores() {
	let scoreString = "<h1>Scores</h1>";
	scoreString += "<h3>You scored " + quiz.score + " out of " + quiz.questionList.length + "</h3>"
	scoreString += "<div id='refresh' class='refresh'>Star-Again</div>"
	let element = document.getElementById('quiz-area');
	element.innerHTML = scoreString;
  
	let reTake = document.getElementById('refresh');
	reTake.onclick = function() {
	  refresh()
	}
  };
  
  function checkAnswer(htmlId, answer) {
	let element = document.getElementById(htmlId);
	element.onclick = function() {
	  quiz.evaluateAnswer(answer);
	  populate();
	};
  };
  //Barra Progreess
  function setProgressBar() {
	let element = document.getElementById('progress');
	element.setAttribute('max', quiz.questionList.length);
  };
  
  function recordProgress() {
	let element = document.getElementById('progress');
	element.setAttribute('value', quiz.questionNo);
  }
  
  function refresh() {
	let renewHTML = '<div class="quiz col-xs-12  text-center" id="quiz-area">'+
	'<div class="stem" id="stem"></div>'+
	'<div class="choice-flexbox"><div class="options" id="option0"></div>'+
	'<div class="options" id="option1"></div><div class="options" id="option2"></div>'+
	'<div class="progress"><div><progress id="progress" max="100" value="0"></progress></div><div>Your progress</div></div></div>'
	let element = document.getElementById('wrap');
	element.innerHTML = renewHTML
  
	quiz.score = 0;
	quiz.questionNo = 0;
	populate();
	setProgressBar();
	}
	//Array de preguentas con sus respuestas
let questions = [
  new Question("Javascript is _________ language.", ["Programming", "Application", "Scripting"], "Scripting"),
  new Question("Which HTML attribute is used to define inline styles?", ["font", "class", "style"],"style"),
  new Question("What does CSS stand for?", ["Cascading Style Sheets","Colorful Style Sheets", "Creative Style Sheets"],  "Cascading Style Sheets"),
  new Question("Who is making the Web standards?", ["W3C", "Microsoft", "Google"], "W3C"),
  new Question("JavaScript is ______ Side Scripting Language.", ["Server", "None of These","Browser"], "Browser")
]

let quiz = new Quiz(questions);

populate();
setProgressBar();