(function ($) {
	var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', "#472E32", "#FF4136", "#39CCCC", "#BDBB99", "#77B1A9", "#73A857"];
	var username = '';
	var myColor;
	var all_questions = [{
		question_string: "Javascript is _________ language.",
		choices: {
			correct: "Scripting",
			wrong: ["Programming", "Application", "None of These"]
		}
    }, {
		question_string: "JavaScript is ______ Side Scripting Language.",
		choices: {
			correct: "Browser",
			wrong: ["Server", "ISP", "None of These"]
		}
    }, {
		question_string: "Which HTML attribute is used to define inline styles?",
		choices: {
			correct: "style",
			wrong: ["font", "class", "styles"]
		}
    }, {
		question_string: 'What does CSS stand for?',
		choices: {
			correct: "Cascading Style Sheets",
			wrong: ["Computer Style Sheets", "Colorful Style Sheets", "Creative Style Sheets"]
		}
    }, {
		question_string: 'Who is making the Web standards?',
		choices: {
			correct: "W3C",
			wrong: ["Mozilla", "Microsoft", "Google"]
		}
    }];

	function changeColor() {
		myColor = colors[Math.floor(Math.random() * colors.length)];
		$('body').css('background-color', myColor);
		$('.quiz-box').css('color', '#fff');
		//$('.option-input:checked::after').css('background', myColor);
	};
	//Objeto para un cuestionario, que contendrá objetos de pregunta.
	var Quiz = function (quiz_name) {
		//Campos privados para una instancia del objeto quiz.
		this.quiz_name = quiz_name;
		// Éste contendrá un array de objetos de preguntas en el orden en que se presentarán las preguntas.
		this.questions = [];
	}
	// Función que puede implementar en una instancia de un objeto quiz. Esta función se llama add_question () y toma un objeto Question que se agregará al campo de preguntas
	Quiz.prototype.add_question = function (question) {
		// Selecciona aleatoriamente dónde añadir pregunta
		//var index_to_add_question = Math.floor(Math.random() * this.questions.length);
		var index_to_add_question = this.questions.length;
		this.questions.splice(index_to_add_question--, 0, question);
	}
	Quiz.prototype.render = function (container) {
		changeColor();
		// For when we're out of scope
		var self = this;;
		// Crea un contenedor para preguntas
		var question_container = $('<div>').attr('id', 'question').appendTo(container);
		// Función auxiliar para cambiar la pregunta y actualizar los botones
		function change_question() {
			self.questions[current_question_index].render(question_container);
			$('#prevButton').prop('disabled', current_question_index === 0);
			$('#nextButton').prop('disabled', current_question_index === self.questions.length - 1);
			// Determinar si todas las preguntas han sido contestadas
			var all_questions_answered = true;
			for (var i = 0; i < self.questions.length; i++) {
				if (self.questions[i].user_choice_index === null) {
					all_questions_answered = false;
					break;
				}
			}
			$('#submit-button').prop('disabled', !all_questions_answered);
		}
		// Hacer la primera pregunta
		var current_question_index = 0;
		change_question();
		// Añade un "listener" para el botón de la pregunta anterior
		$('#prevButton').click(function () {
			if (current_question_index > 0) {
				current_question_index--;
				change_question();
			}
		});
		// Añade un "listener" para el botón de la siguiente pregunta
		$('#nextButton').click(function () {
			if (current_question_index < self.questions.length - 1) {
				current_question_index++;
				change_question();
				changeColor();
			}
		});
		// Añadir un "listener" para el botón sumit que es el que enviará las respuestas
		$('#submitButton').click(function () {
			changeColor();
			// Determina cuantas preguntas el usuario ha contestado correctas
			var score = 0;
			for (var i = 0; i < self.questions.length; i++) {
				if (self.questions[i].user_choice_index === self.questions[i].correct_choice_index) {
					score++;
				}
			}
			// Mestra la puntuación con el mensaje apropiado de acuerdo al porcentaje obtenido
			var percentage = (score / self.questions.length);
			var scoremessage = score + " Out of " + self.questions.length + " questions were correct.";
			var icon = '';
			var chartcolor = '';
			console.log(percentage);
			$('.percentage').data('percent', percentage * 100);
			$('.percentage span').text(percentage);
			var message;
			if (percentage === 1) {
				icon = "fa fa-smile-o";
				message = 'Great job!';
				chartcolor = "green";
			} else if (percentage >= .75) {
				icon = "fa fa-smile-o";
				message = 'You did alright.';
				chartcolor = "green";
			} else if (percentage >= .5) {
				icon = "fa fa-meh-o";
				message = 'Better luck next time.';
				chartcolor = "orange";
			} else {
				icon = "fa fa-meh-o";
				message = 'Maybe you should try a little harder.';
				chartcolor = "red";
			}
			$('.score-label h1').html('<small>Hi </small>' + username + ', ' + 'Your Score<i class="smiley"></i>');
			$('.message').text(message);
			$('.score-detail h3').text(scoremessage);
			$('.smiley').addClass(icon);
			$('#question-box').hide();
			$('#result').show();
			/*$('.percentage').easyPieChart({co
				animate: 1000,
				lineWidth: 4,
				onStep: function (value) {
					this.$el.find('span').text(Math.round(value));
				},
				onStop: function (value, to) {
					this.$el.find('span').text(Math.round(to));
				},
				barColor: chartcolor
			});*/
			$('#prevButton, #nextButton, #submitButton').hide();
			$('.navigation-buttons #resultButton').show();
		});
		$('#resultButton').click(function () {
			changeColor();
			$('#result').hide();
			var table = $('#result-stats table').find('tbody');
			var tr;
			for (var i = 0; i < self.questions.length; i++) {
				tr = $('<tr>');
				if (self.questions[i].user_choice_index === self.questions[i].correct_choice_index) {
					tr.append('<td><i class="fa fa-check-circle"></i>' + self.questions[i].question_string + '</td>');
				} else {
					tr.append('<td><i class="fa fa-times-circle"></i>' + self.questions[i].question_string + '</td>');
				}
				if (self.questions[i].choices[self.questions[i].user_choice_index] !== undefined) {
					tr.append('<td>' + self.questions[i].choices[self.questions[i].user_choice_index] + '</td>');
				} else {
					tr.append('<td>' + '<span class="grey">No Attempt</span>' + '</td>');
				}
				tr.append('<td>' + self.questions[i].choices[self.questions[i].correct_choice_index] + '</td>');
				tr.appendTo(table);
			}
			$('#result-stats').show();
			$('#resultButton').hide()
		});
		// Agregue un "listener" en el contenedor de preguntas para escuchar los cambios seleccionados por el usuario. Esto es para determinar si podemos enviar respuestas o no.
		question_container.bind('user-select-change', function () {
			var all_questions_answered = true;
			for (var i = 0; i < self.questions.length; i++) {
				if (self.questions[i].user_choice_index === null) {
					all_questions_answered = false;
					break;
				}
			}
			$('#submit-button').prop('disabled', !all_questions_answered);
		});
	}
	var Question = function (count, question_string, correct_choice, wrong_choices) {
		this.question_string = count + ". " + question_string;
		this.choices = [];
		this.user_choice_index = null; // Index de la seleccion del usuario
		// Random assign the correct choice an index
		this.correct_choice_index = Math.floor(Math.random() * wrong_choices.length + 1);
		var number_of_choices = wrong_choices.length + 1;
		for (var i = 0; i < number_of_choices; i++) {
			if (i === this.correct_choice_index) this.choices[i] = correct_choice;
			else {
				var wrong_choice_index = Math.floor(Math.random(0, wrong_choices.length));
				this.choices[i] = wrong_choices[wrong_choice_index];
				// Elimina la elección errónea del array de selección incorrecta para que no la recojamos de nuevo
				wrong_choices.splice(wrong_choice_index, 1);
			}
		}
	}
	//Función que puede representar en una instancia del objeto question. Esta función se llama render () y toma una variable llamada el contenedor, que es la <div> en la que haré la pregunta. Esta pregunta "volverá" con la puntuación cuando la pregunta haya sido contestada.
	Question.prototype.render = function (container) {
		// Para cuando estemos fuera del alcance
		var self = this;
		// Rellena la etiqueta de la pregunta
		var question_string_h2;
		if (container.children('h2').length === 0) {
			question_string_h2 = $('<h2>').appendTo(container);
		} else {
			question_string_h2 = container.children('h2').first();
		}
		question_string_h2.text(this.question_string);
		// Limpia los radio buttons y crea nunevos botones
		if (container.children('label').length > 0) {
			container.children('label').each(function () {
				var radio_button_id = $(this).attr('id');
				$(this).remove();
				container.children('label[for=' + radio_button_id + ']').remove();
			});
		}
		for (var i = 0; i < this.choices.length; i++) {
			// Crea la etiqueta label
			var choice_label = $('<label>').attr('for', 'choices-' + i).appendTo(container);
			// Crea el radio button
			var choice_radio_button = $('<input>').attr('id', 'choices-' + i).attr('type', 'radio').attr('name', 'choices').attr('value', 'choices-' + i).attr('class', 'option-input radio').attr('checked', i === this.user_choice_index).appendTo(choice_label);
			choice_label.append(this.choices[i]);
		}
		// Agregar un listener para el radio button de opción para cuando el usuario haya hecho clic
		$('input[name=choices]').change(function (index) {
			var selected_radio_button_value = $('input[name=choices]:checked').val();
			// Cambia el índice de elección del usuario
			self.user_choice_index = parseInt(selected_radio_button_value.substr(selected_radio_button_value.length - 1, 1));
			// Activa un cambio de selección de usuario
			container.trigger('user-select-change');
		});
	}
	$(document).ready(function () {
		changeColor();
		$('#name-input-box').css('border-bottom', 'solid thin ' + myColor);
		var quiz = new Quiz('My Quiz');
		for (var i = 0; i < all_questions.length; i++) {
			var question = new Question((i + 1), all_questions[i].question_string, all_questions[i].choices.correct, all_questions[i].choices.wrong);
			// Agregue la pregunta a la instancia del objeto Quiz que creamos anteriormente
			quiz.add_question(question);
		}
		// Render the quiz
		var quiz_container = $('#question-box');
		$('.navigation-buttons').hide();
		$('#result').hide();
		$('#result-stats').hide();
		$('#name-form').on('submit', function (event) {
			event.preventDefault();
			username = $('#name-input-box').val();
			if (username !== '' && username !== undefined) {
				$('.name-box').hide();
				quiz.render(quiz_container);
				$('.navigation-buttons').show();
				$('#resultButton').hide();
			}
		});
	});
})(jQuery);
