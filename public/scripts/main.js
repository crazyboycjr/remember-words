//let dict = {};

function init() {
	return new Promise((resolve, reject) => {
		$.get('/fetch', (data) => {
			let lines = data.split('\n');
			let dict = {};
			let answers = {}, questions = {};
			for (let line of lines) {
				let [answer, question] = line.split('|');
				dict[question] = answer;
				dict[answer] = question;
				answers[question] = answer;
				questions[answer] = question;
			}
			resolve([dict, questions, answers]);
		});
	});
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function main() {
	//while (1) {
		/*$.get('/fetch?num=1', (data) => {
			alert(data);
			let $answerBox = $("#answer");
			answerBox.keydown((e) => {
				if (e.which === 13) {
					e.preventDefault();
				}
				let word = answerBox.val();
			});
		});*/
	//}

	init().then(([dict, questions, answers]) => {
		//console.log(dict['abnormal']);
		let pool = [];
		for (let ques in answers)
			pool.push(ques);
		//arr = shuffle(arr);
		let $questionBox = $('#questionBox');
		let $answerBox = $('#answerBox');
		let current = 0;
		let ques = pool[current];
		$questionBox.html(ques);

		$answerBox.keyup((e) => {
			if (e.which === 13) {
				e.preventDefault();
			}
			let word = $answerBox.val();
			word = word.trim();
			console.log(word);

			if (word === answers[ques]) {
				console.log('Correct');
				if (current < pool.length) {
					current++;
					ques = pool[current];
					$questionBox.html(ques);
				} else {
					console.log("Well Done! You have finished today's task.");
				}
				$answerBox.val('');
			}
		});
	});
}

$(document).ready(() => {
	main();
});
