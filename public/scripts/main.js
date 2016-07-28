//let dict = {};

function init() {
	return new Promise((resolve, reject) => {
		$.get('/fetch', (data) => {
			let lines = data.split('\n');
			lines.pop();
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

function fadeout() {
	let $statusBar = $('#statusBar');
	$statusBar.fadeOut(1500);
}

function main() {

	init().then(([dict, questions, answers]) => {
		//console.log(dict['abnormal']);
		/*
		 * 生成问题
		 */
		let pool = [];
		for (let ques in answers)
			pool.push(ques);
		pool = shuffle(pool);

		let $progress = $('#progress');
		$progress.html(`0 / ${pool.length}`);

		let $queryResult = $('#queryResult div');
		let $forgotPool = $('#forgotPool');

		let $questionBox = $('#questionBox');
		let $answerBox = $('#answerBox');
		let $statusBar = $('#statusBar');
		let current = 0;
		let ques = pool[current];
		$questionBox.html(ques);

		/*
		 * 当按下Ctrl+C时，自动搜索相关内容
		 */
		$(document).bind('copy', (e) => {
			let str = window.getSelection().toString();
			str = str.trim();
			console.log(str);
			result = '';
			for (let name in dict) {
				if (name.indexOf(str) >= 0) {
					result += '<hr>' + (name + ' ' + dict[name]);
				}
			}
			if (result.length < 2) result = 'None';
			$queryResult.html(result);
		});

		$answerBox.keyup((e) => {
			if (e.which === 13) {
				e.preventDefault();
			}
			let word = $answerBox.val();
			word = word.trim();
			console.log(word);

			if (word === answers[ques]) {
				$statusBar.html("Correct!");
				$statusBar.removeClass("show");
				$statusBar.fadeIn(1000);
				setTimeout(fadeout, 3000);

				$progress.html(`${current + 1} / ${pool.length}`);

				if (current < pool.length - 1) {
					current++;
					ques = pool[current];
					$questionBox.html(ques);
				} else {
					console.log("Well Done! You have finished today's task.");
				}
				$answerBox.val('');
			}
		});

		/*
		 * Forgot 按下之后的操作
		 */
		let forgotWords = new Set();
		let forgotWordsBuffer = new Array();
		let $lookupButton = $('#lookupButton');
		$lookupButton.click(() => {
			let originHtml = $questionBox.html();
			$questionBox.html(originHtml + '<hr>' + answers[ques]);

			let ans = answers[ques];
			if (!forgotWords.has(ans)) {
				forgotWords.add(ans);
				originHtml = $forgotPool.html();
				$forgotPool.html(originHtml + '<hr>' + ques + ' ' + ans);
				
				forgotWordsBuffer.push(ans);
				$.post('/forgotwords', { 'contents': forgotWordsBuffer }, () => {
					while (forgotWordsBuffer.length() > 0)
						forgotWordsBuffer.pop();
				});
			}
		});
	});
}

$(document).ready(() => {
	main();
});
